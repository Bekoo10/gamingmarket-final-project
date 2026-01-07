package com.example.ecomm.controller;

import com.example.ecomm.model.Product;
import com.example.ecomm.repository.ProductRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:3000")
public class ProductController {

    private final ProductRepository productRepository;

    public ProductController(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    // ✅ GET http://localhost:8080/api/products
    @GetMapping
    public List<Product> getAll() {
        return productRepository.findAll();
    }

    // ✅ GET http://localhost:8080/api/products/featured
    @GetMapping("/featured")
    public List<Product> getFeatured() {
        return productRepository.findByFeaturedTrue();
    }

    // ✅ GET http://localhost:8080/api/products/1
    @GetMapping("/{id}")
    public Product getById(@PathVariable Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found: " + id));
    }

    // ✅ GET http://localhost:8080/api/products/category/components
    // ✅ GET http://localhost:8080/api/products/category/components?sub=ram
    @GetMapping("/category/{category}")
    public List<Product> getByCategory(
            @PathVariable String category,
            @RequestParam(required = false) String sub
    ) {
        if (sub == null || sub.isBlank()) {
            return productRepository.findByCategoryIgnoreCase(category);
        }
        return productRepository.findByCategoryIgnoreCaseAndSubCategoryIgnoreCase(category, sub);
    }
}
