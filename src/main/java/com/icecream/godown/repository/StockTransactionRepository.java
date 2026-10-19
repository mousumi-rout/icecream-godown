
package com.icecream.godown.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.icecream.godown.entity.StockTransaction;

public interface StockTransactionRepository
        extends JpaRepository<StockTransaction, Long> {

    List<StockTransaction> findByProductIdOrderByTransactionTimeDesc(
            Long productId
    );

    boolean existsByPerformedById(Long userId);
}
