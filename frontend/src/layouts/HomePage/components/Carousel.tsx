import { ReturnBook } from "./ReturnBook";
import { useState, useEffect } from "react";
import BookModel from "../../../models/BookModel";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { Link } from "react-router-dom";


export const Carousel = () => {

    const [books, setBooks] = useState<BookModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);

    useEffect(() => {
        // useEffect, React bileşenlerinde yan etkilere (API çağrıları, veri yükleme vb.) tepki vermek için kullanılır.
        // İlk parametre, bir fonksiyon alır ve bu fonksiyon bileşen her render edildiğinde çalışır.

        const fetchBooks = async () => {
            // fetchBooks fonksiyonu, kitapları API'den almak için async/await kullanarak asenkron bir işlevdir.

            const baseUrl: string = `${process.env.REACT_APP_API}/books`;
            const url: string = `${baseUrl}?page=0&size=9`;

            // API'den kitapları almak için istek yapılacak olan URL oluşturuluyor.

            const response = await fetch(url);
            // fetch fonksiyonu ile API'den istek atılıyor ve cevap bekleniyor.

            if (!response.ok) {
                // Eğer cevap başarılı değilse, yani hata durumu oluştuysa "Something went wrong!" hatası fırlatılır.
                throw new Error('Something went wrong!');
            }

            const responseJson = await response.json();
            // Cevap, JSON formatında parse ediliyor ve responseJson değişkenine atanıyor.

            const responseData = responseJson._embedded.books;
            // Kitaplar, responseJson'dan çıkarılıyor ve responseData değişkenine atanıyor.

            const loadedBooks: BookModel[] = [];

            responseData.forEach((book: any) => {
                // responseData içindeki her kitap için bir döngü oluşturuluyor.

                loadedBooks.push({
                    // Her kitap için bir "BookModel" nesnesi oluşturuluyor ve "loadedBooks" dizisine ekleniyor.
                    // "BookModel" nesnesi içinde kitap bilgileri yer alıyor.

                    id: book.id,
                    title: book.title,
                    author: book.author,
                    description: book.description,
                    copies: book.copies,
                    category: book.category,
                    img: book.img,
                });
            });

            setBooks(loadedBooks);
            // Elde edilen kitaplar, "setBooks" fonksiyonu aracılığıyla bileşenin durumuna (state) atanıyor.

            setIsLoading(false);
            // Verilerin yüklendiğini belirtmek için "setIsLoading" fonksiyonu kullanılarak "false" değeri atanıyor.
        };

        fetchBooks().catch((error: any) => {
            // fetchBooks fonksiyonu çağrılıyor ve kitaplar alınıyor. Eğer hata oluşursa, bu kısım çalışır.

            setIsLoading(false);
            // Hata durumunda da verilerin yüklenmediği belirtilir.

            setHttpError(error.message);
            // Hata mesajı, "setHttpError" fonksiyonu aracılığıyla bileşenin durumuna (state) atanır.
        });

    }, [])


    if (isLoading) {
        return (
            <SpinnerLoading />
        );
    }

    if (httpError) {
        return (
            <div className="container m-5">
                <p>{httpError}</p>
            </div>
        );
    }

    return (
        <div className='container mt-5' style={{ height: 550 }}>
            <div className='homepage-carousel-title'>
                <h3>Find your next "I stayed up too late reading" book.</h3>
            </div>
            <div id='carouselExampleControls' className='carousel carousel-dark slide mt-5 
                d-none d-lg-block' data-bs-interval='false'>

                {/* Desktop */}
                <div className='carousel-inner'>
                    <div className='carousel-item active'>
                        <div className='row d-flex justify-content-center align-items-center'>
                            {books.slice(0, 3).map((book: BookModel) => (
                                <ReturnBook key={book.id} book={book} />
                            ))}
                        </div>
                    </div>
                    <div className='carousel-item'>
                        <div className='row d-flex justify-content-center align-items-center'>
                            {books.slice(3, 6).map((book: BookModel) => (
                                <ReturnBook key={book.id} book={book} />
                            ))}
                        </div>
                    </div>
                    <div className='carousel-item'>
                        <div className='row d-flex justify-content-center align-items-center'>
                            {books.slice(6, 9).map((book: BookModel) => (
                                <ReturnBook key={book.id} book={book} />
                            ))}
                        </div>
                    </div>
                    <button className='carousel-control-prev' type='button'
                        data-bs-target='#carouselExampleControls' data-bs-slide='prev'>
                        <span className='carousel-control-prev-icon' aria-hidden='true'></span>
                        <span className='visually-hidden'>Previous</span>
                    </button>
                    <button className='carousel-control-next' type='button'
                        data-bs-target='#carouselExampleControls' data-bs-slide='next'>
                        <span className='carousel-control-next-icon' aria-hidden='true'></span>
                        <span className='visually-hidden'>Next</span>
                    </button>
                </div>
            </div>

            {/* Mobile */}
            <div className='d-lg-none mt-3'>
                <div className='row d-flex justify-content-center align-items-center'>
                    <ReturnBook book={books[7]} key={books[7].id} />
                </div>
            </div>
            <div className='homepage-carousel-title mt-3'>
                <Link className='btn btn-outline-secondary btn-lg' to='/search'>View More</Link>
            </div>
        </div>
    );
}