package com.example.back.controllers;

import com.example.back.models.Product;
import com.example.back.services.ProductService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/products")
public class ProductController {
    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    /**
     * Récupère tous les produits
     * @return Liste de tous les produits
     */
    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    /**
     * Récupère un produit par son id
     * @param id L'id du produit
     * @return Le produit correspondant
     */
    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Product getProductById(@PathVariable Long id) {
        return productService.getProductById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Produit introuvable"));
    }

    /**
     * Crée un nouveau produit
     * @param product Le produit à créer
     * @return Le produit créé
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Product createProduct(@RequestBody Product product) {
        return productService.createProduct(product);
    }

    /**
     * Supprime un produit
     * @param productRequest L'id du produit à supprimer
     */
    @PostMapping("/delete")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteProduct(@RequestBody Product productRequest) {
        productService.deleteProduct(productRequest.getId());
    }

    /**
     * Met à jour un produit
     * @param updatedProduct Les nouvelles informations du produit
     * @return Le produit mis à jour
     */
    @PostMapping("/update")
    @ResponseStatus(HttpStatus.OK)
    public Product updateProduct(@RequestBody Product updatedProduct) {
        return productService.updateProduct(updatedProduct.getId(), updatedProduct)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Produit introuvable"));
    }
}
