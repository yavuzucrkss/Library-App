import { useEffect, useState } from "react";
import BookModel from "../../models/BookModel";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { StarsReview } from "../Utils/StarReview";
import { CheckoutAndReviewBox } from "./CheckoutAndReview";
import ReviewModel from "../../models/ReviewModel";
import { LatestReviews } from "./LatestReviews";
import { useOktaAuth } from "@okta/okta-react";
import ReviewRequestModel from "../../models/ReviewRequestModel";

export const BookCheckoutPage = () => {

    const { authState } = useOktaAuth();

    const [book, setBook] = useState<BookModel>();
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);

    //review state    
    const [reviews, setReviews] = useState<ReviewModel[]>([]);
    const [totalStars, setTotalStars] = useState(0);
    const [isLoadingReview, setIsLoadingReview] = useState(true);

    const [isReviewLeft, setIsReviewLeft] = useState(false);
    const [isLoadingUserReview, setIsLoadingUserReview] = useState(true);

    //Loand Count State
    const [currentLoansCount, setCurrentLoansCount] = useState(0);
    const [isLoadingCurrentLoanCount, setIsLoadingCurrentLoanCount] = useState(true);

    // Is Book Check Out ?
    const [isBookCheckOut, setIsBookCheckOut] = useState(false);
    const [isLoadingBookCheckOut, setIsLoadingBookCheckOut] = useState(true);


    const bookId = (window.location.pathname).split('/')[2];

    //bookUseEffect
    useEffect(() => {
        // useEffect, React bileşenlerinde yan etkilere (API çağrıları, veri yükleme vb.) tepki vermek için kullanılır.
        // İlk parametre, bir fonksiyon alır ve bu fonksiyon bileşen her render edildiğinde çalışır.

        const fetchBooks = async () => {
            // fetchBooks fonksiyonu, kitapları API'den almak için async/await kullanarak asenkron bir işlevdir.
            const baseUrl: string = `http://localhost:8080/api/books/${bookId}`;


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
    }, [isBookCheckOut])

    //reviewUseEffect
    useEffect(() => {
        const fetchReviews = async () => {
            // fetchBooks fonksiyonu, kitapları API'den almak için async/await kullanarak asenkron bir işlevdir.
            const reviewUrl: string = `http://localhost:8080/api/reviews/search/findByBookId?bookId=${bookId}`;

            const responseReview = await fetch(reviewUrl);

            if (!responseReview.ok) {
                // Eğer cevap başarılı değilse, yani hata durumu oluştuysa "Something went wrong!" hatası fırlatılır.
                throw new Error('Something went wrong!');
            }

            const responseJsonReview = await responseReview.json();

            const responseDataReview = responseJsonReview._embedded.reviews;

            const loadedReviews: ReviewModel[] = [];

            let weightedStarReviews: number = 0;

            responseDataReview.forEach((review: any) => {
                loadedReviews.push({
                    id: review.id,
                    userEmail: review.userEmail,
                    date: review.date,
                    rating: review.rating,
                    bookId: review.bookId,
                    reviewDescription: review.reviewDescription
                })
                weightedStarReviews = weightedStarReviews + review.rating;
            });

            if (loadedReviews) {
                const round = Math.round(((weightedStarReviews / loadedReviews.length) * 2) / 2).toFixed(1);
                setTotalStars(Number(round));
            }

            setReviews(loadedReviews);
            setIsLoadingReview(false)
        }

        fetchReviews().catch((error: any) => {
            setIsLoadingReview(false)
            setHttpError(error.message)
        })
    }, [isReviewLeft])

    //isReviewLeftUseEffect
    useEffect(() => {
        const fetchUserReview = async () => {
            if (authState && authState.isAuthenticated) {
                const url = `http://localhost:8080/api/reviews/secure/user/book/?bookId=${bookId}`;
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                };
                const userReview = await fetch(url, requestOptions);
                if (!userReview.ok) {
                    throw new Error('Something went wrong!');
                }
                const userReviewResponseJson = await userReview.json();
                setIsReviewLeft(userReviewResponseJson);
            }
            setIsLoadingUserReview(false);
        }
        fetchUserReview().catch((error: any) => {
            setIsLoadingUserReview(false)
            setHttpError(error.message)
        })

    }, [authState])

    //loadCountUseEffect
    useEffect(() => {
        const fetchCurrentLoanCount = async () => {
            if (authState && authState.isAuthenticated) {
                const currentLoanCountUrl = `http://localhost:8080/api/books/secure/currentloans/count`
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
                const currentLoadCountResponse = await fetch(currentLoanCountUrl, requestOptions);
                if (!currentLoadCountResponse.ok) {
                    throw new Error('Something went wrong!')
                }
                const currentLoadCountResponseJson = await currentLoadCountResponse.json();
                setCurrentLoansCount(currentLoadCountResponseJson);
            }
            setIsLoadingCurrentLoanCount(false);
        }

        fetchCurrentLoanCount().catch((error: any) => {
            setIsLoadingCurrentLoanCount(false)
            setHttpError(error.message)
        })
    }, [authState, isBookCheckOut])


    //isBookCheckOutUseEffect
    useEffect(() => {
        const fetchUserCheckedOutBook = async () => {
            if (authState && authState.isAuthenticated) {
                const url = `http://localhost:8080/api/books/secure/ischeckedout/byuser/?bookId=${bookId}`;
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                };
                const bookCheckedOut = await fetch(url, requestOptions);

                if (!bookCheckedOut.ok) {
                    throw new Error('Something went wrong!');
                }

                const bookCheckedOutResponseJson = await bookCheckedOut.json();
                setIsBookCheckOut(bookCheckedOutResponseJson);
            }
            setIsLoadingBookCheckOut(false);
        }
        fetchUserCheckedOutBook().catch((error: any) => {
            setIsLoadingBookCheckOut(false);
            setHttpError(error.message);
        })
    }, [authState, isBookCheckOut]);


    if (isLoading || isLoadingReview || isLoadingCurrentLoanCount || isLoadingBookCheckOut || isLoadingUserReview) {
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

    async function checkOutBook() {
        const url = `http://localhost:8080/api/books/secure/checkout/?bookId=${bookId}`;
        const requestOptions = {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json'
            }
        }
        const response = await fetch(url, requestOptions);
        if (!response.ok) {
            throw new Error('Something went wrong!');
        }
        setIsBookCheckOut(true);
    }

    async function submitReview(starInput: number, reviewDescription: string) {
        let bookId: number = 0;
        if (book?.id) {
            bookId = book.id;
        }

        const reviewRequestModel = new ReviewRequestModel(starInput, bookId, reviewDescription);
        const url = `http://localhost:8080/api/reviews/secure`;
        const requestOptions = {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reviewRequestModel)
        };
        const returnResponse = await fetch(url, requestOptions);
        if (!returnResponse.ok) {
            throw new Error('Something went wrong!');
        }
        setIsReviewLeft(true);
    }

    return (
        <div>
            {/* Desktop */}
            <div className='container d-none d-lg-block'>
                <div className='row mt-5'>
                    <div className='col-sm-2 col-md-2 mt-3 d-flex flex-column align-items-center '>
                        {book?.img ?
                            <img src={book?.img} width='226' height='349' alt='Book' />
                            :
                            <img src={require('./../../Images/BooksImages/book-luv2code-1000.png')} width='226'
                                height='349' alt='Book' />
                        }
                        <div className="mt-3 justify-content-center">
                            <StarsReview rating={totalStars} size={32} />
                        </div>
                    </div>
                    <div className='col-4 col-md-4 container'>
                        <div className='ml-2'>
                            <h2>{book?.title}</h2>
                            <h5 className='text-primary'>{book?.author}</h5>
                            <p className='lead'>{book?.description}</p>
                        </div>
                    </div>
                    <CheckoutAndReviewBox book={book} mobile={false} currentLoansCount={currentLoansCount}
                        isAuthenticated={authState?.isAuthenticated} isBookCheckOut={isBookCheckOut} 
                        checkOutBook={checkOutBook} isReviewLeft={isReviewLeft} submitReview={submitReview} />
                </div>
                <hr />
                <LatestReviews reviews={reviews} bookId={book?.id} mobile={false} />
            </div>

            {/* Mobile */}
            <div className='container d-lg-none mt-5'>
                <div className='d-flex justify-content-center align-items-center'>
                    {book?.img ?
                        <img src={book?.img} width='226' height='349' alt='Book' />
                        :
                        <img src={require('./../../Images/BooksImages/book-luv2code-1000.png')} width='226'
                            height='349' alt='Book' />
                    }

                </div>
                <div className='d-flex justify-content-center align-items-center mt-3'>
                    < StarsReview rating={totalStars} size={32} />
                </div>
                <div className='mt-4'>
                    <div className='ml-2'>
                        <h2>{book?.title}</h2>
                        <h5 className='text-primary'>{book?.author}</h5>
                        <p className='lead'>{book?.description}</p>
                    </div>
                </div>
                <CheckoutAndReviewBox book={book} mobile={false} currentLoansCount={currentLoansCount}
                        isAuthenticated={authState?.isAuthenticated} isBookCheckOut={isBookCheckOut} 
                        checkOutBook={checkOutBook} isReviewLeft={isReviewLeft} submitReview={submitReview} />
                <hr />
                <LatestReviews reviews={reviews} bookId={book?.id} mobile={true} />
            </div>
        </div>
    );
}