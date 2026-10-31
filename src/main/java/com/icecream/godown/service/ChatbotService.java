package com.icecream.godown.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;

import org.springframework.stereotype.Service;

import com.icecream.godown.entity.Product;
import com.icecream.godown.entity.StockTransaction;
import com.icecream.godown.repository.ProductRepository;
import com.icecream.godown.repository.StockTransactionRepository;

@Service
public class ChatbotService {

    private final ProductRepository productRepository;
    private final StockTransactionRepository transactionRepository;

    public ChatbotService(
            ProductRepository productRepository,
            StockTransactionRepository transactionRepository) {

        this.productRepository = productRepository;
        this.transactionRepository = transactionRepository;
    }

    public String getReply(String message) {

        if (message == null || message.trim().isEmpty()) {
            return "Please type a question about your inventory.";
        }

        String question = message.toLowerCase(Locale.ROOT).trim();
        // Normalize Hinglish and Hindi question variations
        question = question
                .replace("kitna hai", "")
                .replace("kitna h", "")
                .replace("kitni hai", "")
                .replace("kitne hai", "")
                .replace("batao", "")
                .replace("dikhao", "")
                .replace("please", "")
                .trim();

        // Greeting
        if (question.matches(".*\\b(hi|hello|hey)\\b.*")) {
            return "Hello! 👋 Welcome to IceCreamGodown Inventory Assistant. "
                    + "Ask me about products, stock, low stock, or today's transactions.";
        }

        // Help
        if (question.contains("help") || question.contains("what can you do")) {
            return "I can help you with:\n"
                    + "1. Total products\n"
                    + "2. Product stock by name\n"
                    + "3. Low-stock products (10 or fewer units)\n"
                    + "4. Today's stock IN and OUT\n"
                    + "5. Recent stock transactions";
        }

        List<Product> products = productRepository.findAll();

        // Total products
        if (question.contains("total product")
                || question.contains("how many product")
                || question.contains("product count")) {

            return "Total products in your inventory: " + products.size();
        }

        // Total available stock units
        if (question.contains("total stock")
                || question.contains("total units")
                || question.contains("total quantity")) {

            int totalStock = products.stream()
                    .mapToInt(Product::getCurrentStock)
                    .sum();

            return "📦 Total available stock: "
                    + totalStock + " units across "
                    + products.size() + " products.";
        }

        // Out-of-stock products
        if (question.contains("out of stock")
                || question.contains("stock is zero")
                || question.contains("zero stock")) {

            List<Product> outOfStockProducts = products.stream()
                    .filter(p -> p.getCurrentStock() <= 0)
                    .toList();

            if (outOfStockProducts.isEmpty()) {
                return "✅ Great! No out-of-stock products found.";
            }

            StringBuilder reply = new StringBuilder(
                    "🚨 Out-of-stock products:\n");

            for (Product product : outOfStockProducts) {
                reply.append("• ")
                        .append(product.getProductName())
                        .append(" (")
                        .append(product.getProductCode())
                        .append(")\n");
            }

            return reply.toString();
        }

        // Product with the highest stock
        if (question.contains("highest stock")
                || question.contains("maximum stock")
                || question.contains("most stock")) {

            Product highestStockProduct = products.stream()
                    .max((p1, p2) -> Integer.compare(
                            p1.getCurrentStock(),
                            p2.getCurrentStock()))
                    .orElse(null);

            if (highestStockProduct == null) {
                return "No products found in your inventory.";
            }

            return "🏆 Highest-stock product:\n"
                    + "Name: " + highestStockProduct.getProductName() + "\n"
                    + "Product Code: " + highestStockProduct.getProductCode() + "\n"
                    + "Available Stock: "
                    + highestStockProduct.getCurrentStock() + " units";
        }

        // Critical stock: 5 or fewer units
        if (question.contains("critical stock")
                || question.contains("stock below 5")
                || question.contains("5 or fewer")) {

            List<Product> criticalStockProducts = products.stream()
                    .filter(p -> p.getCurrentStock() >= 0
                            && p.getCurrentStock() <= 5)
                    .toList();

            if (criticalStockProducts.isEmpty()) {
                return "✅ No critical-stock products found.";
            }

            StringBuilder reply = new StringBuilder(
                    "🚨 Critical-stock products (5 or fewer units):\n");

            for (Product product : criticalStockProducts) {
                reply.append("• ")
                        .append(product.getProductName())
                        .append(" — ")
                        .append(product.getCurrentStock())
                        .append(" units\n");
            }

            return reply.toString();
        }
        // Low-stock products
        if (question.contains("low stock")
                || question.contains("running low")
                || question.contains("stock alert")) {

            List<Product> lowStockProducts = products.stream()
                    .filter(p -> p.getCurrentStock() <= 10)
                    .toList();

            if (lowStockProducts.isEmpty()) {
                return "Great! No low-stock products found. ✅";
            }

            StringBuilder reply = new StringBuilder(
                    "⚠️ Low-stock products (10 or fewer units):\n");

            for (Product product : lowStockProducts) {
                reply.append("• ")
                        .append(product.getProductName())
                        .append(" — ")
                        .append(product.getCurrentStock())
                        .append(" units\n");
            }

            return reply.toString();
        }

        // Today's stock IN and OUT
        if (question.contains("today")
                && (question.contains("stock")
                || question.contains("transaction")
                || question.contains("in")
                || question.contains("out"))) {

            LocalDate today = LocalDate.now();

            List<StockTransaction> todayTransactions
                    = transactionRepository.findAll().stream()
                            .filter(t -> t.getTransactionTime() != null)
                            .filter(t -> t.getTransactionTime().toLocalDate()
                                    .equals(today))
                            .toList();

            int totalIn = todayTransactions.stream()
                    .filter(t -> "IN".equalsIgnoreCase(t.getTransactionType()))
                    .mapToInt(StockTransaction::getQuantity)
                    .sum();

            int totalOut = todayTransactions.stream()
                    .filter(t -> "OUT".equalsIgnoreCase(t.getTransactionType()))
                    .mapToInt(StockTransaction::getQuantity)
                    .sum();

            return "📊 Today's Stock Summary\n"
                    + "Stock IN: " + totalIn + " units\n"
                    + "Stock OUT: " + totalOut + " units\n"
                    + "Transactions: " + todayTransactions.size();
        }

        // Recent transactions
        if (question.contains("recent transaction")
                || question.contains("latest transaction")
                || question.contains("last transaction")) {

            List<StockTransaction> transactions
                    = transactionRepository.findAll().stream()
                            .sorted((a, b) -> {
                                LocalDateTime timeA = a.getTransactionTime();
                                LocalDateTime timeB = b.getTransactionTime();

                                if (timeA == null && timeB == null) {
                                    return 0;
                                }
                                if (timeA == null) {
                                    return 1;
                                }
                                if (timeB == null) {
                                    return -1;
                                }

                                return timeB.compareTo(timeA);
                            })
                            .limit(5)
                            .toList();

            if (transactions.isEmpty()) {
                return "No stock transactions found.";
            }

            StringBuilder reply = new StringBuilder(
                    "🕒 Latest stock transactions:\n");

            for (StockTransaction transaction : transactions) {
                reply.append("• ")
                        .append(transaction.getProduct().getProductName())
                        .append(" | ")
                        .append(transaction.getTransactionType())
                        .append(" | Quantity: ")
                        .append(transaction.getQuantity())
                        .append(" | New stock: ")
                        .append(transaction.getNewStock())
                        .append("\n");
            }

            return reply.toString();
        }

        // Product search by name or product code
        for (Product product : products) {

            String productName
                    = product.getProductName().toLowerCase(Locale.ROOT);

            String productCode
                    = product.getProductCode().toLowerCase(Locale.ROOT);

            if (question.contains(productName)
                    || question.contains(productCode)) {

                return "📦 Product Details\n"
                        + "Name: " + product.getProductName() + "\n"
                        + "Product Code: " + product.getProductCode() + "\n"
                        + "Category: " + product.getCategory() + "\n"
                        + "Price: " + product.getPrice() + "\n"
                        + "Current Stock: " + product.getCurrentStock()
                        + " units";
            }
        }

        // List all products
        if (question.contains("all product")
                || question.contains("list product")
                || question.contains("show product")
                || question.equals("products")) {

            if (products.isEmpty()) {
                return "No products found in your inventory.";
            }

            StringBuilder reply = new StringBuilder(
                    "📦 Your Products:\n");

            for (Product product : products) {
                reply.append("• ")
                        .append(product.getProductName())
                        .append(" — ")
                        .append(product.getCurrentStock())
                        .append(" units\n");
            }

            return reply.toString();
        }

        return "Sorry, I couldn't understand that question. 🤔\n"
                + "Try asking:\n"
                + "• How many products do we have?\n"
                + "• Show all products\n"
                + "• What is the stock of Vanilla Cup?\n"
                + "• Show low stock products\n"
                + "• What is today's stock IN and OUT?\n"
                + "• Show recent transactions";
    }
}
