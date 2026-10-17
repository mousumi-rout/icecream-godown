package com.icecream.godown.controller;

import com.icecream.godown.entity.Product;
import com.icecream.godown.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    // Add a new product
    @PostMapping
    public Product addProduct(@RequestBody Product product) {
        return productService.addProduct(product);
    }

    @PutMapping("/{id}")
public ResponseEntity<Product> updateProduct(
        @PathVariable Long id,
        @RequestBody Product product) {

    return productService.getProductById(id)
            .map(existingProduct -> {

                existingProduct.setProductCode(product.getProductCode());
                existingProduct.setProductName(product.getProductName());
                existingProduct.setCategory(product.getCategory());
                existingProduct.setPrice(product.getPrice());
                existingProduct.setCurrentStock(product.getCurrentStock());
                existingProduct.setQrCode(product.getQrCode());

                return ResponseEntity.ok(
                        productService.addProduct(existingProduct)
                );

            })
            .orElse(ResponseEntity.notFound().build());
}

    // Get all products
    @GetMapping
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    // Get product by ID
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {

        return productService.getProductById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Get product by QR code
    @GetMapping("/qr/{qrCode}")
    public ResponseEntity<Product> getProductByQrCode(
            @PathVariable String qrCode) {

        return productService.getProductByQrCode(qrCode)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Delete product
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {

        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}