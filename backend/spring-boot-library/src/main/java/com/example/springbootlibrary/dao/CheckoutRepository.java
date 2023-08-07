package com.example.springbootlibrary.dao;

import org.springframework.data.jpa.repository.JpaRepository;


import java.util.List;

import com.example.springbootlibrary.entity.Checkout;

public interface CheckoutRepository extends JpaRepository<Checkout, Long> {
    
    Checkout findByUserEmailAndBookId(String userEmail, Long bookId);

    List<Checkout> findByUserEmail(String userEmail);
}