package com.mercantix.app.service;

import com.mercantix.app.dto.PageResponse;
import com.mercantix.app.dto.ProductRequest;
import com.mercantix.app.dto.ProductResponse;
import com.mercantix.app.entities.Product;
import com.mercantix.app.exceptions.ResourceNotFoundException;
import com.mercantix.app.userrepositories.ProductRepository;
import com.mercantix.app.userserviceimplementations.ProductService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock ProductRepository productRepository;
    @InjectMocks ProductService productService;

    private Product sample() {
        Product p = new Product();
        p.setProductId(1);
        p.setName("Linen Shirt");
        p.setPrice(new BigDecimal("78.00"));
        p.setStock(5);
        p.setCategory("men");
        return p;
    }

    @Test
    void search_clampsPageSizeTo100() {
        ArgumentCaptor<Pageable> pageable = ArgumentCaptor.forClass(Pageable.class);
        when(productRepository.search(any(), any(), any(), any(), any(), pageable.capture()))
                .thenReturn(new PageImpl<>(List.of(sample())));

        productService.search(null, null, null, null, null, 0, 5000, "price", "asc");

        assertThat(pageable.getValue().getPageSize()).isEqualTo(100); // clamped from 5000
    }

    @Test
    void search_rejectsUnknownSortFieldAndFallsBackToCreatedAt() {
        ArgumentCaptor<Pageable> pageable = ArgumentCaptor.forClass(Pageable.class);
        when(productRepository.search(any(), any(), any(), any(), any(), pageable.capture()))
                .thenReturn(new PageImpl<>(List.of(sample())));

        // "; DROP TABLE" is not whitelisted → must fall back to createdAt
        productService.search(null, null, null, null, null, 0, 20, "maliciousColumn", "desc");

        assertThat(pageable.getValue().getSort().getOrderFor("createdAt")).isNotNull();
        assertThat(pageable.getValue().getSort().getOrderFor("maliciousColumn")).isNull();
    }

    @Test
    void search_mapsToPageResponse() {
        when(productRepository.search(any(), any(), any(), any(), any(), any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(sample())));

        PageResponse<ProductResponse> res =
                productService.search(null, null, null, null, null, 0, 20, "price", "asc");

        assertThat(res.getContent()).singleElement()
                .satisfies(p -> {
                    assertThat(p.getName()).isEqualTo("Linen Shirt");
                    assertThat(p.isInStock()).isTrue();
                });
    }

    @Test
    void getById_notFound_throws() {
        when(productRepository.findById(42)).thenReturn(Optional.empty());
        assertThatThrownBy(() -> productService.getById(42))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void create_mapsAllFields() {
        ProductRequest req = new ProductRequest();
        req.setName("Wool Coat");
        req.setBrand("Mercantix Atelier");
        req.setPrice(new BigDecimal("389.00"));
        req.setStock(10);
        req.setCategory("men");
        req.setSizes(List.of("S", "M", "L"));
        when(productRepository.save(any(Product.class))).thenAnswer(i -> i.getArgument(0));

        ProductResponse res = productService.create(req);

        assertThat(res.getName()).isEqualTo("Wool Coat");
        assertThat(res.getBrand()).isEqualTo("Mercantix Atelier");
        assertThat(res.getSizes()).containsExactly("S", "M", "L");
        assertThat(res.isInStock()).isTrue();
    }
}
