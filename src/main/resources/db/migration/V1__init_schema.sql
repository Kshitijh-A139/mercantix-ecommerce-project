-- ──────────────────────────────────────────────────────────────────────────
-- V1: Initial Mercantix schema.
-- Column types/names mirror the JPA entities so `ddl-auto=validate` passes.
-- Engine InnoDB + utf8mb4 throughout for FK support and full Unicode.
-- ──────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS users (
    user_id     INT          NOT NULL AUTO_INCREMENT,
    username    VARCHAR(255) NOT NULL,
    email       VARCHAR(255) NOT NULL,
    password    VARCHAR(255) NOT NULL,
    role        VARCHAR(255) NOT NULL,
    created_at  DATETIME(6)  NOT NULL,
    updated_at  DATETIME(6)  NOT NULL,
    PRIMARY KEY (user_id),
    CONSTRAINT uk_users_username UNIQUE (username),
    CONSTRAINT uk_users_email    UNIQUE (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS products (
    product_id     INT           NOT NULL AUTO_INCREMENT,
    name           VARCHAR(255)  NOT NULL,
    brand          VARCHAR(255),
    description    VARCHAR(2000),
    price          DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2),
    stock          INT           NOT NULL,
    category       VARCHAR(255),
    sub_category   VARCHAR(255),
    color          VARCHAR(255),
    rating         DECIMAL(3,2),
    review_count   INT,
    tag            VARCHAR(255),
    sizes          VARCHAR(1000),
    gallery        VARCHAR(2000),
    image_url      VARCHAR(255),
    created_at     DATETIME(6)   NOT NULL,
    updated_at     DATETIME(6)   NOT NULL,
    PRIMARY KEY (product_id),
    INDEX idx_products_category (category),
    INDEX idx_products_sub_category (sub_category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS cart_items (
    cart_item_id INT           NOT NULL AUTO_INCREMENT,
    user_id      INT           NOT NULL,
    product_id   INT           NOT NULL,
    quantity     INT           NOT NULL,
    unit_price   DECIMAL(10,2) NOT NULL,
    added_at     DATETIME(6)   NOT NULL,
    PRIMARY KEY (cart_item_id),
    CONSTRAINT uk_cart_user_product UNIQUE (user_id, product_id),
    CONSTRAINT fk_cart_user    FOREIGN KEY (user_id)    REFERENCES users (user_id)    ON DELETE CASCADE,
    CONSTRAINT fk_cart_product FOREIGN KEY (product_id) REFERENCES products (product_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS orders (
    order_id         INT           NOT NULL AUTO_INCREMENT,
    user_id          INT           NOT NULL,
    total            DECIMAL(10,2) NOT NULL,
    payment_method   VARCHAR(255),
    shipping_address VARCHAR(2000),
    status           VARCHAR(255)  NOT NULL,
    created_at       DATETIME(6)   NOT NULL,
    updated_at       DATETIME(6)   NOT NULL,
    PRIMARY KEY (order_id),
    INDEX idx_orders_user (user_id),
    INDEX idx_orders_status (status),
    CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS order_items (
    item_id      INT           NOT NULL AUTO_INCREMENT,
    order_id     INT           NOT NULL,
    product_id   INT           NOT NULL,
    product_name VARCHAR(255),
    quantity     INT           NOT NULL,
    price        DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (item_id),
    INDEX idx_order_items_order (order_id),
    CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders (order_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
