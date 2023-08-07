package com.example.springbootlibrary.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.RequestParam;

import com.example.springbootlibrary.entity.Review;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    
    Page<Review> findByBookId(@RequestParam("id") Long id, Pageable pageable);

    Review findByUserEmailAndBookId(String userEmail, Long bookId);
}