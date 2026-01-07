package com.example.ecomm.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // DB: name
    private String name;

    // DB: short_description
    @Column(name = "short_description")
    private String shortDescription;

    // DB: price (NUMERIC)
    private BigDecimal price;

    // DB: image_url
    @Column(name = "image_url")
    private String imageUrl;

    // DB: category
    private String category;

    @Column(name = "sub_category")
    private String subCategory;

    // DB: details (LONG DESCRIPTION | Description Tab)
    @Column(columnDefinition = "TEXT")
    private String details;

    // DB: technical_details (TECH SPECS TAB)
    @Column(name = "technical_details", columnDefinition = "TEXT")
    private String technicalDetails;

    // DB: brand
    private String brand;

    // DB: stock
    private Integer stock;

    // DB: featured
    private Boolean featured;

    // DB: created_at
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public Product() {}

    public Product(
            String name,
            String shortDescription,
            BigDecimal price,
            String imageUrl,
            String category,
            String details,
            String technicalDetails,
            String brand,
            Integer stock,
            Boolean featured,
            LocalDateTime createdAt
    ) {
        this.name = name;
        this.shortDescription = shortDescription;
        this.price = price;
        this.imageUrl = imageUrl;
        this.category = category;
        this.details = details;
        this.technicalDetails = technicalDetails;
        this.brand = brand;
        this.stock = stock;
        this.featured = featured;
        this.createdAt = createdAt;
    }

    // Getters & Setters

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getShortDescription() { return shortDescription; }
    public void setShortDescription(String shortDescription) { this.shortDescription = shortDescription; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getSubCategory() { return subCategory; }
    public void setSubCategory(String subCategory) { this.subCategory = subCategory; }

    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }

    public String getTechnicalDetails() { return technicalDetails; }
    public void setTechnicalDetails(String technicalDetails) { this.technicalDetails = technicalDetails; }

    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }

    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }

    public Boolean getFeatured() { return featured; }
    public void setFeatured(Boolean featured) { this.featured = featured; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
