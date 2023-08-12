package com.example.springbootlibrary.service;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.springbootlibrary.dao.BookRepository;
import com.example.springbootlibrary.dao.CheckoutRepository;
import com.example.springbootlibrary.dao.HistoryRepository;
import com.example.springbootlibrary.entity.Book;
import com.example.springbootlibrary.entity.Checkout;
import com.example.springbootlibrary.entity.History;
import com.example.springbootlibrary.responsemodels.ShelfCurrentLoansResponse;

@Service
@Transactional // Ödünç alma işlemleri için transactional annotation'ı kullanılır
public class BookService {

    private BookRepository bookRepository;
    private CheckoutRepository checkoutRepository;
    private HistoryRepository historyRepository;

    public BookService(BookRepository bookRepository, CheckoutRepository checkoutRepository, HistoryRepository historyRepository) {
        this.bookRepository = bookRepository;
        this.checkoutRepository = checkoutRepository;
        this.historyRepository = historyRepository;
    }

    // Kitap ödünç almayı yöneten metot
    public Book checkoutBook(String userEmail, Long bookId) throws Exception {

        // Kitap veritabanından id'ye göre alınıyor
        Optional<Book> book = bookRepository.findById(bookId); // Optinal sınıfı null pointer exception'ı önlemek için
                                                               // kullanılır

        // Kullanıcının daha önce bu kitabı ödünç aldığı kontrol ediliyor
        Checkout validateCheckout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);

        // Eğer kitap bulunamazsa, stokta kalmamışsa veya kullanıcı zaten bu kitabı
        // ödünç almışsa, hata fırlatılır
        if (!book.isPresent() || book.get().getCopies() <= 0 || validateCheckout != null) {
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

    public Boolean checkoutBookByUser(String userEmail, Long bookId) {
        Checkout validaCheckout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);
        if (validaCheckout != null) {
            return true;
        } else {
            return false;
        }
    }

    public int currentLoansCount(String userEmail) {
        return checkoutRepository.findByUserEmail(userEmail).size();
    }

    public List<ShelfCurrentLoansResponse> currentLoans(String userEmail) throws Exception {

        // create an empty list to hold the current loans
        List<ShelfCurrentLoansResponse> shelfCurrentLoansResponseList = new ArrayList<>();

        // get a list of checkouts for the user
        List<Checkout> checkoutList = checkoutRepository.findByUserEmail(userEmail);

        // create an empty list to hold the book ids
        List<Long> bookIdList = new ArrayList<>();

        // loop through the checkouts and add the book ids to the list
        for (Checkout checkout : checkoutList) {
            bookIdList.add(checkout.getBookId());
        }

        // get a list of books for the book ids
        List<Book> bookList = bookRepository.findBooksByBookIds(bookIdList);

        // create a date formatter for the return dates
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

        // loop through the books and check if they are checked out by the user
        for (Book book : bookList) {
            Optional<Checkout> checkout = checkoutList.stream()
                    .filter(x -> x.getBookId() == book.getId()).findFirst();

            // if the book is checked out by the user, calculate the difference in days
            // between the return date and today
            if (checkout.isPresent()) {

                Date d1 = sdf.parse(checkout.get().getReturnDate());
                Date d2 = sdf.parse(LocalDate.now().toString());

                TimeUnit time = TimeUnit.DAYS;

                long diffrence_In_time = time.convert(d1.getTime() - d2.getTime(), TimeUnit.MILLISECONDS);

                // add the book and the difference in days to the current loans list
                shelfCurrentLoansResponseList.add(new ShelfCurrentLoansResponse(book, (int) diffrence_In_time));
            }
        }

        return shelfCurrentLoansResponseList;
    }

    public void returnBook(String userEmail, Long bookId) throws Exception {

        Optional<Book> book = bookRepository.findById(bookId);

        Checkout validateCheckout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);

        if (!book.isPresent() || validateCheckout == null) {
            throw new Exception("Book does not exist or not checked out by user");
        }

        book.get().setCopiesAvailable(book.get().getCopiesAvailable() + 1);

        bookRepository.save(book.get());
        checkoutRepository.deleteById(validateCheckout.getId());

        History history = new History(
                userEmail,
                validateCheckout.getCheckoutDate(),
                LocalDate.now().toString(),
                book.get().getTitle(),
                book.get().getAuthor(),
                book.get().getDescription(),
                book.get().getImg());

        historyRepository.save(history);

    }

    public void renewLoan(String userEmail, Long bookId) throws Exception {

        Checkout validateCheckout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);

        if (validateCheckout == null) {
            throw new Exception("Book does not exist or not checked out by user");
        }

        SimpleDateFormat sdfFormat = new SimpleDateFormat("yyyy-MM-dd");

        Date d1 = sdfFormat.parse(validateCheckout.getReturnDate());
        Date d2 = sdfFormat.parse(LocalDate.now().toString());

        if (d1.compareTo(d2) >= 0) {
            validateCheckout.setReturnDate(LocalDate.now().plusDays(7).toString());
            checkoutRepository.save(validateCheckout);
        }
    }
}
