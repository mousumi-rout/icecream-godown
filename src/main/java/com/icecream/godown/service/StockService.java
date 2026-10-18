
package com.icecream.godown.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.icecream.godown.entity.Product;
import com.icecream.godown.entity.StockTransaction;
import com.icecream.godown.entity.User;
import com.icecream.godown.repository.ProductRepository;
import com.icecream.godown.repository.StockTransactionRepository;
import com.icecream.godown.repository.UserRepository;

@Service
public class StockService {

    private final ProductRepository productRepository;
    private final StockTransactionRepository stockTransactionRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    public StockService(
            ProductRepository productRepository,
            StockTransactionRepository stockTransactionRepository,
            UserRepository userRepository,
            EmailService emailService) {

        this.productRepository = productRepository;
        this.stockTransactionRepository = stockTransactionRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
    }

    private void validateStockRequest(String qrCode, int quantity) {
        if (qrCode == null || qrCode.isBlank()) {
            throw new IllegalArgumentException("QR code cannot be empty");
        }

        if (quantity <= 0) {
            throw new IllegalArgumentException(
                    "Quantity must be greater than zero");
        }
    }

    private User findUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found"));
    }

    // STOCK IN
    @Transactional
    public StockTransaction stockIn(
            String qrCode, int quantity, Long userId) {

        validateStockRequest(qrCode, quantity);

        Product product = productRepository.findByQrCode(qrCode)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Product not found with QR code: " + qrCode));

        int previousStock = product.getCurrentStock();

        if (previousStock > Integer.MAX_VALUE - quantity) {
            throw new IllegalArgumentException(
                    "Stock quantity exceeds the supported limit");
        }

        int newStock = previousStock + quantity;

        product.setCurrentStock(newStock);
        productRepository.save(product);

        StockTransaction transaction = new StockTransaction();
        transaction.setProduct(product);
        transaction.setPerformedBy(findUser(userId));
        transaction.setTransactionType("IN");
        transaction.setQuantity(quantity);
        transaction.setPreviousStock(previousStock);
        transaction.setNewStock(newStock);
        transaction.setTransactionTime(LocalDateTime.now());

        StockTransaction savedTransaction =
                stockTransactionRepository.save(transaction);

        try {
            emailService.sendStockEmail(
                    product.getProductName(),
                    qrCode,
                    "IN",
                    quantity,
                    previousStock,
                    newStock);
        } catch (Exception e) {
            System.err.println(
                    "Email could not be sent: " + e.getMessage());
        }

        return savedTransaction;
    }

    // STOCK OUT
    @Transactional
    public StockTransaction stockOut(
            String qrCode, int quantity, Long userId) {

        validateStockRequest(qrCode, quantity);

        Product product = productRepository.findByQrCode(qrCode)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Product not found with QR code: " + qrCode));

        int previousStock = product.getCurrentStock();

        if (quantity > previousStock) {
            throw new IllegalArgumentException(
                    "Not enough stock available. Available stock: "
                            + previousStock);
        }

        int newStock = previousStock - quantity;

        product.setCurrentStock(newStock);
        productRepository.save(product);

        StockTransaction transaction = new StockTransaction();
        transaction.setProduct(product);
        transaction.setPerformedBy(findUser(userId));
        transaction.setTransactionType("OUT");
        transaction.setQuantity(quantity);
        transaction.setPreviousStock(previousStock);
        transaction.setNewStock(newStock);
        transaction.setTransactionTime(LocalDateTime.now());

        StockTransaction savedTransaction =
                stockTransactionRepository.save(transaction);

        try {
            emailService.sendStockEmail(
                    product.getProductName(),
                    qrCode,
                    "OUT",
                    quantity,
                    previousStock,
                    newStock);
        } catch (Exception e) {
            System.err.println(
                    "Email could not be sent: " + e.getMessage());
        }

        return savedTransaction;
    }

    // GET ALL TRANSACTIONS
    public List<StockTransaction> getAllTransactions() {
        return stockTransactionRepository.findAll();
    }

    // GET PRODUCT TRANSACTIONS
    public List<StockTransaction> getProductTransactions(Long productId) {
        return stockTransactionRepository
                .findByProductIdOrderByTransactionTimeDesc(productId);
    }
}
