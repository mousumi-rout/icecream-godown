package com.icecream.godown.controller;

import com.icecream.godown.entity.StockTransaction;
import com.icecream.godown.service.StockService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/stock")
@CrossOrigin(origins = "*")
public class StockController {

    private final StockService stockService;

    public StockController(StockService stockService) {
        this.stockService = stockService;
    }

    // Stock IN
    @PostMapping("/in")
    public StockTransaction stockIn(@RequestBody Map<String, Object> request) {

        String qrCode = (String) request.get("qrCode");
        int quantity = (Integer) request.get("quantity");

        return stockService.stockIn(qrCode, quantity);
    }

    // Stock OUT
    @PostMapping("/out")
    public StockTransaction stockOut(@RequestBody Map<String, Object> request) {

        String qrCode = (String) request.get("qrCode");
        int quantity = (Integer) request.get("quantity");

        return stockService.stockOut(qrCode, quantity);
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