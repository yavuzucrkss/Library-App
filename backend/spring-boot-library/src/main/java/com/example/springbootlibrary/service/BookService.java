package com.example.springbootlibrary.service;

import java.time.LocalDate;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.springbootlibrary.dao.BookRepository;
import com.example.springbootlibrary.dao.CheckoutRepository;
import com.example.springbootlibrary.entity.Book;
import com.example.springbootlibrary.entity.Checkout;

@Service
@Transactional // Ödünç alma işlemleri için transactional annotation'ı kullanılır
public class BookService {

    private BookRepository bookRepository;
    private CheckoutRepository checkoutRepository;

    public BookService(BookRepository bookRepository, CheckoutRepository checkoutRepository) {
        this.bookRepository = bookRepository;
        this.checkoutRepository = checkoutRepository;
    }

    // Kitap ödünç almayı yöneten metot
    public Book checkoutBook(String userEmail, Long bookId) throws Exception {
        
        // Kitap veritabanından id'ye göre alınıyor
        Optional<Book> book = bookRepository.findById(bookId); //Optinal sınıfı null pointer exception'ı önlemek için kullanılır

        // Kullanıcının daha önce bu kitabı ödünç aldığı kontrol ediliyor
        Checkout validateCheckout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);

        // Eğer kitap bulunamazsa, stokta kalmamışsa veya kullanıcı zaten bu kitabı ödünç almışsa, hata fırlatılır
        if(!book.isPresent() || book.get().getCopies() <= 0 || validateCheckout != null) {
            throw new Exception("Book not available or already checked out");
        }

        // Kitap stoktan bir adet azaltılır ve güncellenir
        book.get().setCopies(book.get().getCopies() - 1);
        bookRepository.save(book.get());

        // Ödünç alma kaydı oluşturulur ve veritabanına kaydedilir
        Checkout checkout = new Checkout(
            userEmail,
            book.get().getId(),
            LocalDate.now().toString(), // Ödünç alma tarihi olarak bugünün tarihi atanır
            LocalDate.now().plusDays(7).toString() // Teslim tarihi olarak bugünden 7 gün sonrası atanır
        );

        checkoutRepository.save(checkout);

        // Ödünç alınan kitap nesnesi döndürülür
        return book.get();
    }


    public Boolean checkoutBookByUser(String userEmail, Long bookId){
        Checkout validaCheckout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);
        if(validaCheckout != null){
            return true;
        }
        else{
            return false;
        }        
    }

    public int currentLoansCount(String userEmail){
        return checkoutRepository.findByUserEmail(userEmail).size();
    }
}
