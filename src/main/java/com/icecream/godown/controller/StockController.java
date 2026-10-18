
package com.icecream.godown.controller;

import com.icecream.godown.entity.StockTransaction;
import com.icecream.godown.service.StockService;

import jakarta.servlet.http.HttpSession;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/stock")
@CrossOrigin(
        origins = "http://localhost:5173",
        allowCredentials = "true"
)
public class StockController {

    private final StockService stockService;

    public StockController(StockService stockService) {
        this.stockService = stockService;
    }

    private Long getLoggedInUserId(HttpSession session) {
        Object userId = session.getAttribute("userId");

        if (!(userId instanceof Number)) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Please log in to perform stock movement"
            );
        }

        return ((Number) userId).longValue();
    }

    // Stock IN
    @PostMapping("/in")
    public StockTransaction stockIn(
            @RequestBody Map<String, Object> request,
            HttpSession session) {

        String qrCode = (String) request.get("qrCode");
        int quantity = ((Number) request.get("quantity")).intValue();

        Long userId = getLoggedInUserId(session);

        return stockService.stockIn(qrCode, quantity, userId);
    }

    // Stock OUT
    @PostMapping("/out")
    public StockTransaction stockOut(
            @RequestBody Map<String, Object> request,
            HttpSession session) {

        String qrCode = (String) request.get("qrCode");
        int quantity = ((Number) request.get("quantity")).intValue();

        Long userId = getLoggedInUserId(session);

        return stockService.stockOut(qrCode, quantity, userId);
    }

    // All transaction history
    @GetMapping("/history")
    public List<StockTransaction> getAllTransactions() {
        return stockService.getAllTransactions();
    }

    // Transactions of a particular product
    @GetMapping("/history/{productId}")
    public List<StockTransaction> getProductTransactions(
            @PathVariable Long productId) {

        return stockService.getProductTransactions(productId);
    }
}
