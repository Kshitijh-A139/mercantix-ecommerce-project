package com.mercantix.app.userrepositories;

import com.mercantix.app.entities.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {

    // ── Categories (distinct) ─────────────────────────────────────────────
    @Query("SELECT DISTINCT p.category FROM Product p " +
            "WHERE p.category IS NOT NULL AND p.category <> '' ORDER BY p.category")
    List<String> findDistinctCategories();

    // ── Pageable filter (used by ProductService) ──────────────────────────
    //
    //   q          → case-insensitive match against name OR description (nullable)
    //   category   → exact, case-insensitive match (nullable)
    //   minPrice   → inclusive lower bound (nullable)
    //   maxPrice   → inclusive upper bound (nullable)
    //   inStock    → if true, only products with stock > 0; if false/null, all
    //
    @Query("""
            SELECT p FROM Product p
            WHERE (:q IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :q, '%'))
                              OR LOWER(p.description) LIKE LOWER(CONCAT('%', :q, '%')))
              AND (:category IS NULL OR LOWER(p.category) = LOWER(:category))
              AND (:minPrice IS NULL OR p.price >= :minPrice)
              AND (:maxPrice IS NULL OR p.price <= :maxPrice)
              AND (:inStock IS NULL OR :inStock = FALSE OR p.stock > 0)
           """)
    Page<Product> search(@Param("q")        String q,
                         @Param("category") String category,
                         @Param("minPrice") BigDecimal minPrice,
                         @Param("maxPrice") BigDecimal maxPrice,
                         @Param("inStock")  Boolean inStock,
                         Pageable pageable);
}
