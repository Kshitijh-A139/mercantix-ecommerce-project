package com.mercantix.app;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

/**
 * Smoke test: the full Spring context boots (wiring, security, JPA mappings)
 * against an in-memory H2 database. Validates that the entity ↔ schema mapping
 * is internally consistent.
 */
@SpringBootTest
@ActiveProfiles("test")
class MercantixApplicationTests {

	@Test
	void contextLoads() {
	}

}
