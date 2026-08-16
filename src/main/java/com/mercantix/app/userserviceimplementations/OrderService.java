package com.mercantix.app.userserviceimplementations;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mercantix.app.dto.OrderItemRequest;
import com.mercantix.app.dto.OrderResponse;
import com.mercantix.app.dto.PlaceOrderRequest;
import com.mercantix.app.dto.ShippingAddressRequest;
import com.mercantix.app.entities.Order;
import com.mercantix.app.entities.OrderItem;
import com.mercantix.app.entities.Product;
import com.mercantix.app.entities.User;
import com.mercantix.app.exceptions.BusinessRuleException;
import com.mercantix.app.exceptions.ResourceNotFoundException;
import com.mercantix.app.userrepositories.CartItemRepository;
import com.mercantix.app.userrepositories.OrderRepository;
import com.mercantix.app.userrepositories.ProductRepository;
import com.mercantix.app.userservices.OrderServiceContract;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * Order domain logic.
 *
 * Security-critical guarantees:
 *   • Item prices and the order total are computed from the persisted product
 *     records — never from client input (prevents price tampering).
 *   • Stock is validated and decremented inside the same transaction
 *     (prevents overselling); insufficient stock rolls the whole order back.
 *   • Products are batch-loaded in a single query (no N+1).
 */
@Service
public class OrderService implements OrderServiceContract {

    private final OrderRepository    orderRepository;
    private final ProductRepository  productRepository;
    private final CartItemRepository cartItemRepository;
    private final ObjectMapper       objectMapper;

    public OrderService(OrderRepository orderRepository,
                        ProductRepository productRepository,
                        CartItemRepository cartItemRepository,
                        ObjectMapper objectMapper) {
        this.orderRepository    = orderRepository;
        this.productRepository  = productRepository;
        this.cartItemRepository = cartItemRepository;
        this.objectMapper       = objectMapper;
    }

    @Override
    @Transactional
    public OrderResponse placeOrder(User user, PlaceOrderRequest request) {
        // Consolidate quantities per product (the cart may list the same product
        // more than once, e.g. different sizes) so stock checks are correct.
        Map<Integer, Integer> qtyByProduct = new LinkedHashMap<>();
        for (OrderItemRequest item : request.getItems()) {
            qtyByProduct.merge(item.getProductId(), item.getQuantity(), Integer::sum);
        }

        // Single query to fetch every product referenced by the order.
        Map<Integer, Product> productsById = productRepository.findAllById(qtyByProduct.keySet())
                .stream()
                .collect(Collectors.toMap(Product::getProductId, Function.identity()));

        Order order = new Order();
        order.setUser(user);
        order.setPaymentMethod(request.getPaymentMethod());
        order.setShippingAddress(serialiseAddress(request.getShippingAddress()));

        BigDecimal total = BigDecimal.ZERO;

        for (Map.Entry<Integer, Integer> entry : qtyByProduct.entrySet()) {
            Integer productId = entry.getKey();
            int qty = entry.getValue();

            Product product = productsById.get(productId);
            if (product == null) {
                throw new ResourceNotFoundException("Product", productId);
            }

            int available = product.getStock() == null ? 0 : product.getStock();
            if (available < qty) {
                throw new BusinessRuleException(
                        "Insufficient stock for '" + product.getName() +
                        "' (requested " + qty + ", available " + available + ")");
            }

            // Reserve stock within this transaction — rolled back if anything fails.
            product.setStock(available - qty);

            OrderItem line = new OrderItem();
            line.setOrder(order);
            line.setProductId(productId);
            line.setProductName(product.getName());
            line.setQuantity(qty);
            line.setPrice(product.getPrice());                  // authoritative, server-side price
            order.getItems().add(line);

            total = total.add(product.getPrice().multiply(BigDecimal.valueOf(qty)));
        }

        order.setTotal(total);

        Order saved = orderRepository.save(order);   // cascades to items; stock decrement flushed by dirty checking

        // The order now owns these goods — empty the user's server-side cart.
        cartItemRepository.deleteByUser(user);

        return OrderResponse.from(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponse> getMyOrders(User user) {
        return orderRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(OrderResponse::from)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponse getOrder(Integer orderId, User user) {
        return orderRepository.findWithItemsByOrderId(orderId)
                .filter(o -> o.getUser().getUserId().equals(user.getUserId()))
                .map(OrderResponse::from)
                .orElseThrow(() -> new ResourceNotFoundException("Order", orderId));
    }

    // ── Helpers ──────────────────────────────────────────────────────────

    private String serialiseAddress(ShippingAddressRequest addr) {
        if (addr == null) return null;
        try {
            return objectMapper.writeValueAsString(addr);
        } catch (Exception e) {
            // Fall back to a minimal representation rather than failing the order.
            return addr.getLine1();
        }
    }
}
