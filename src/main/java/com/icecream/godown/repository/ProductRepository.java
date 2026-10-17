package com.icecream.godown.repository;

import com.icecream.godown.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {

    Optional<Product> findByProductCode(String productCode);

    Optional<Product> findByQrCode(String qrCode);
}