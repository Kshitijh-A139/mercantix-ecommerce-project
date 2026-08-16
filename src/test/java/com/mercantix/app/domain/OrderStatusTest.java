package com.mercantix.app.domain;

import com.mercantix.app.entities.OrderStatus;
import com.mercantix.app.exceptions.BusinessRuleException;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class OrderStatusTest {

    @Test
    void parse_isCaseInsensitiveAndTrims() {
        assertThat(OrderStatus.parse("  shipped ")).isEqualTo(OrderStatus.SHIPPED);
        assertThat(OrderStatus.parse("DELIVERED")).isEqualTo(OrderStatus.DELIVERED);
    }

    @Test
    void parse_rejectsUnknownValue() {
        assertThatThrownBy(() -> OrderStatus.parse("TELEPORTED"))
                .isInstanceOf(BusinessRuleException.class)
                .hasMessageContaining("Invalid status");
    }

    @Test
    void parse_rejectsBlank() {
        assertThatThrownBy(() -> OrderStatus.parse("  "))
                .isInstanceOf(BusinessRuleException.class);
    }
}
