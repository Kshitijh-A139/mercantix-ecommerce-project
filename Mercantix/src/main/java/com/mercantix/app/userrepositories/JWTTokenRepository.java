package com.mercantix.app.userrepositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.mercantix.app.entities.JWTToken;
import com.mercantix.app.entities.User;

@Repository
public interface JWTTokenRepository extends JpaRepository<JWTToken, Long> {

    @Query("SELECT t FROM JWTToken t WHERE t.user.id = :userId")
    List<JWTToken> findByUserId(@Param("userId") long userId);

    Optional<JWTToken> findTopByUserOrderByExpiresAtDesc(User user);
    
    Optional<JWTToken> findByToken(String token);
}
