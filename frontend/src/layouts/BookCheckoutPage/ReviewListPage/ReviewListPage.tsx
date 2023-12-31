import { useEffect, useState } from 'react';
import ReviewModel from '../../../models/ReviewModel';
import { Pagination } from '../../Utils/Pagination';
import { Review } from '../../Utils/Review';
import { SpinnerLoading } from '../../Utils/SpinnerLoading';
import BookModel from '../../../models/BookModel';

export const ReviewListPage = () => {

    const [reviews, setReviews] = useState<ReviewModel[]>([]);
    const [book, setBook] = useState<BookModel>();
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);



    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [reviewsPerPage] = useState(5);
    const [totalAmountOfReviews, setTotalAmountOfReviews] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // Book to lookup reviews
    const bookId = (window.location.pathname).split('/')[2];

    //bookUseEffect
    useEffect(() => {
        // useEffect, React bileşenlerinde yan etkilere (API çağrıları, veri yükleme vb.) tepki vermek için kullanılır.
        // İlk parametre, bir fonksiyon alır ve bu fonksiyon bileşen her render edildiğinde çalışır.

        const fetchBooks = async () => {
            // fetchBooks fonksiyonu, kitapları API'den almak için async/await kullanarak asenkron bir işlevdir.
            const baseUrl: string = `{${process.env.REACT_APP_API}/books/${bookId}`;


            const response = await fetch(baseUrl);
            // fetch fonksiyonu ile API'den istek atılıyor ve cevap bekleniyor.

            if (!response.ok) {
                // Eğer cevap başarılı değilse, yani hata durumu oluştuysa "Something went wrong!" hatası fırlatılır.
                throw new Error('Something went wrong!');
            }

            const responseJson = await response.json();
            // Cevap, JSON formatında parse ediliyor ve responseJson değişkenine atanıyor.
            const book = responseJson;

            const loadedBook: BookModel = {
                id: book.id,
                title: book.title,
                author: book.author,
                description: book.description,
                copies: book.copies,
                copiesAvailable: book.copiesAvailable,
                category: book.category,
                img: book.img,
            };

            setBook(loadedBook);
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
        window.scrollTo(0, 0);
    }, [])

    useEffect(() => {
        const fetchBookReviewsData = async () => {

            const reviewUrl: string = `${process.env.REACT_APP_API}/reviews/search/findByBookId?bookId=${bookId}&page=${currentPage - 1}&size=${reviewsPerPage}`;

            const responseReviews = await fetch(reviewUrl);

            if (!responseReviews.ok) {
                throw new Error('Something went wrong!');
            }

            const responseJsonReviews = await responseReviews.json();

            const responseData = responseJsonReviews._embedded.reviews;

            setTotalAmountOfReviews(responseJsonReviews.page.totalElements);
            setTotalPages(responseJsonReviews.page.totalPages);

            const loadedReviews: ReviewModel[] = [];

            for (const key in responseData) {
                loadedReviews.push({
                    id: responseData[key].id,
                    userEmail: responseData[key].userEmail,
                    date: responseData[key].date,
                    rating: responseData[key].rating,
                    bookId: responseData[key].book_id,
                    reviewDescription: responseData[key].reviewDescription,
                });
            }

            setReviews(loadedReviews);
            setIsLoading(false);
        };
        fetchBookReviewsData().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message);
        })
    }, [currentPage]);

    if (isLoading) {
        return (
            <SpinnerLoading />
        )
    }

    if (httpError) {
        return (
            <div className='container m-5'>
                <p>{httpError}</p>
            </div>
        );
    }


    const indexOfLastReview: number = currentPage * reviewsPerPage;
    const indexOfFirstReview: number = indexOfLastReview - reviewsPerPage;

    let lastItem = reviewsPerPage * currentPage <= totalAmountOfReviews ?
        reviewsPerPage * currentPage : totalAmountOfReviews;

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);


    return (
        <div className="container mt-5">
            <div>
                <h2>{book?.title}</h2>
                <hr />
                <h3>Comments: ({reviews.length})</h3>
            </div>
            <p>
                {indexOfFirstReview + 1} to {lastItem} of {totalAmountOfReviews} items:
            </p>
            <div className="row">
                {reviews.map(review => (
                    <Review review={review} key={review.id} />
                ))}
            </div>

            {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />}
        </div>
    );
}
