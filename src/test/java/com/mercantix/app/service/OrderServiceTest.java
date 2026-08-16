package com.mercantix.app.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mercantix.app.dto.OrderItemRequest;
import com.mercantix.app.dto.OrderResponse;
import com.mercantix.app.dto.PlaceOrderRequest;
import com.mercantix.app.entities.Order;
import com.mercantix.app.entities.Product;
import com.mercantix.app.entities.Role;
import com.mercantix.app.entities.User;
import com.mercantix.app.exceptions.BusinessRuleException;
import com.mercantix.app.exceptions.ResourceNotFoundException;
import com.mercantix.app.userrepositories.CartItemRepository;
import com.mercantix.app.userrepositories.OrderRepository;
import com.mercantix.app.userrepositories.ProductRepository;
import com.mercantix.app.userserviceimplementations.OrderService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock  OrderRepository    orderRepository;
    @Mock  ProductRepository  productRepository;
    @Mock  CartItemRepository cartItemRepository;

    OrderService orderService;
    private User user;

    @BeforeEach
    void setUp() {
        // ObjectMapper is a real instance (Mockito cannot spy it on modern JDKs).
        orderService = new OrderService(orderRepository, productRepository,
                cartItemRepository, new ObjectMapper());
        user = new User("alice", "alice@example.com", "hash", Role.CUSTOMER);
        user.setUserId(1);
        // save() returns the same order it was given
        lenient().when(orderRepository.save(any(Order.class)))
                 .thenAnswer(inv -> inv.getArgument(0));
    }

    private Product product(int id, String name, String price, int stock) {
        Product p = new Product();
        p.setProductId(id);
        p.setName(name);
        p.setPrice(new BigDecimal(price));
        p.setStock(stock);
        return p;
    }

    private PlaceOrderRequest request(int productId, int qty) {
        OrderItemRequest item = new OrderItemRequest();
        item.setProductId(productId);
        item.setQuantity(qty);
        PlaceOrderRequest req = new PlaceOrderRequest();
        req.setItems(List.of(item));
        req.setPaymentMethod("CARD");
        return req;
    }

    @Test
    void placeOrder_pricesFromCatalogue_notFromClient() {
        // Product really costs 50.00; the client cannot influence this.
        when(productRepository.findAllById(any()))
                .thenReturn(List.of(product(10, "Linen Shirt", "50.00", 5)));

        OrderResponse res = orderService.placeOrder(user, request(10, 2));

        // 2 × 50.00 = 100.00 — computed server-side
        assertThat(res.getTotal()).isEqualByComparingTo("100.00");
        assertThat(res.getItems()).singleElement()
                .satisfies(i -> {
                    assertThat(i.getPrice()).isEqualByComparingTo("50.00");
                    assertThat(i.getQuantity()).isEqualTo(2);
                    assertThat(i.getProductName()).isEqualTo("Linen Shirt");
                });
    }

    @Test
    void placeOrder_decrementsStock() {
        Product p = product(10, "Linen Shirt", "50.00", 5);
        when(productRepository.findAllById(any())).thenReturn(List.of(p));

        orderService.placeOrder(user, request(10, 3));

        assertThat(p.getStock()).isEqualTo(2); // 5 - 3
    }

    @Test
    void placeOrder_insufficientStock_throwsAndDoesNotSave() {
        Product p = product(10, "Linen Shirt", "50.00", 1);
        when(productRepository.findAllById(any())).thenReturn(List.of(p));

        assertThatThrownBy(() -> orderService.placeOrder(user, request(10, 2)))
                .isInstanceOf(BusinessRuleException.class)
                .hasMessageContaining("Insufficient stock");

        verify(orderRepository, never()).save(any());
        assertThat(p.getStock()).isEqualTo(1); // unchanged
    }

    @Test
    void placeOrder_unknownProduct_throwsNotFound() {
        when(productRepository.findAllById(any())).thenReturn(List.of()); // nothing found

        assertThatThrownBy(() -> orderService.placeOrder(user, request(999, 1)))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void placeOrder_clearsCartAndBatchLoadsProducts() {
        when(productRepository.findAllById(any()))
                .thenReturn(List.of(product(10, "Linen Shirt", "50.00", 5)));

        orderService.placeOrder(user, request(10, 1));

        verify(productRepository, times(1)).findAllById(any()); // single batch query, no N+1
        verify(cartItemRepository, times(1)).deleteByUser(user);
    }

    @Test
    void placeOrder_consolidatesDuplicateProductLines() {
        Product p = product(10, "Linen Shirt", "50.00", 10);
        when(productRepository.findAllById(any())).thenReturn(List.of(p));

        // Same product twice (e.g. two sizes) → qty 2 + 3 = 5
        OrderItemRequest a = new OrderItemRequest(); a.setProductId(10); a.setQuantity(2);
        OrderItemRequest b = new OrderItemRequest(); b.setProductId(10); b.setQuantity(3);
        PlaceOrderRequest req = new PlaceOrderRequest();
        req.setItems(List.of(a, b));

        OrderResponse res = orderService.placeOrder(user, req);

        assertThat(p.getStock()).isEqualTo(5);          // 10 - 5
        assertThat(res.getTotal()).isEqualByComparingTo("250.00");
        ArgumentCaptor<Order> captor = ArgumentCaptor.forClass(Order.class);
        verify(orderRepository).save(captor.capture());
        assertThat(captor.getValue().getItems()).hasSize(1); // consolidated to one line
    }

    @Test
    void getOrder_deniesOtherUsersOrder() {
        User owner = new User("bob", "bob@example.com", "h", Role.CUSTOMER);
        owner.setUserId(2);
        Order order = new Order();
        order.setUser(owner);
        when(orderRepository.findWithItemsByOrderId(7)).thenReturn(Optional.of(order));

        // alice (id 1) must not see bob's (id 2) order
        assertThatThrownBy(() -> orderService.getOrder(7, user))
                .isInstanceOf(ResourceNotFoundException.class);
    }
}
