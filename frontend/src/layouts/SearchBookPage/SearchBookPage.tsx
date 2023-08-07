import { useState, useEffect } from 'react';
import BookModel from '../../models/BookModel';
import { SpinnerLoading } from '../Utils/SpinnerLoading';
import { SearchBook } from './components/SearchBook';
import { Pagination } from '../Utils/Pagination';

export const SearchBookPage = () => {

    const [books, setBooks] = useState<BookModel[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [httpError, setHttpError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [booksPerPage] = useState(5);
    const [totalAmountOfBooks, setTotalAmountOfBooks] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchUrl, setSearchUrl] = useState('');
    const [categorySelection, setCategorySelection] = useState('Book Category');


    useEffect(() => {
        // useEffect, React bileşenlerinde yan etkilere (API çağrıları, veri yükleme vb.) tepki vermek için kullanılır.
        // İlk parametre, bir fonksiyon alır ve bu fonksiyon bileşen her render edildiğinde çalışır.

        // fetchBooks fonksiyonu, kitapları API'den almak için async/await kullanarak asenkron bir işlevdir.
        const fetchBooks = async () => {

            // API'den kitapları almak için istek yapılacak olan URL oluşturuluyor.
            const baseUrl: string = 'http://localhost:8080/api/books';
            let url: string;

            if (searchUrl === '') {
                url = `${baseUrl}?page=${currentPage - 1}&size=${booksPerPage}`;
            }
            else {
                let searchWithPage = searchUrl.replace('<pageNumber>', `${currentPage - 1}`);
                url = baseUrl + searchWithPage;
            }



            // fetch fonksiyonu ile API'den istek atılıyor ve cevap bekleniyor.
            const response = await fetch(url);

            // Eğer cevap başarılı değilse, yani hata durumu oluştuysa "Something went wrong!" hatası fırlatılır.
            if (!response.ok) {
                throw new Error('Something went wrong!');
            }


            // Cevap, JSON formatında parse ediliyor ve responseJson değişkenine atanıyor.
            const responseJson = await response.json();

            // Kitaplar, responseJson'dan çıkarılıyor ve responseData değişkenine atanıyor.
            const responseData = responseJson._embedded.books;

            setTotalAmountOfBooks(responseJson.page.totalElements);
            setTotalPages(responseJson.page.totalPages);


            const loadedBooks: BookModel[] = [];

            // responseData içindeki her kitap için bir döngü oluşturuluyor.
            responseData.forEach((book: any) => {

                // Her kitap için bir "BookModel" nesnesi oluşturuluyor ve "loadedBooks" dizisine ekleniyor.
                // "BookModel" nesnesi içinde kitap bilgileri yer alıyor.
                loadedBooks.push({
                    id: book.id,
                    title: book.title,
                    author: book.author,
                    description: book.description,
                    copies: book.copies,
                    category: book.category,
                    img: book.img,
                });
            });

            // Elde edilen kitaplar, "setBooks" fonksiyonu aracılığıyla bileşenin durumuna (state) atanıyor.
            setBooks(loadedBooks);

            // Verilerin yüklendiğini belirtmek için "setIsLoading" fonksiyonu kullanılarak "false" değeri atanıyor.
            setIsLoading(false);
        };

        // fetchBooks fonksiyonu çağrılıyor ve kitaplar alınıyor. Eğer hata oluşursa, bu kısım çalışır.
        fetchBooks().catch((error: any) => {

            // Hata durumunda da verilerin yüklenmediği belirtilir.
            setIsLoading(false);

            // Hata mesajı, "setHttpError" fonksiyonu aracılığıyla bileşenin durumuna (state) atanır.
            setHttpError(error.message);
        });
        window.scrollTo(0, 0);
    }, [currentPage, searchUrl])

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


    const searchHandler = () => {
        setCurrentPage(1);
        if (searchTerm === '') {
            setSearchUrl('');
        }
        else {
            setSearchUrl(`/search/findByTitleContaining?title=${searchTerm}&page=<pageNumber>&size=${booksPerPage}`);
        }

        setCategorySelection('Book Category');
    }

    const handleCategorySelection = (category: string) => {
        setCurrentPage(1);
        let categorySelection: string = '';
        if (category.toLowerCase() === 'fe' ||
            category.toLowerCase() === 'be' ||
            category.toLowerCase() === 'data' ||
            category.toLowerCase() === 'devops') {
                if(category.toLowerCase() === 'fe'){
                    categorySelection = 'Front End';
                    setCategorySelection(categorySelection);
                }
                else if(category.toLowerCase() === 'be'){
                    categorySelection = 'Back End';
                    setCategorySelection(categorySelection);
                }
                else {
                    setCategorySelection(category);
                }
            setSearchUrl(`/search/findByCategory?category=${category}&page=<pageNumber>&size=${booksPerPage}`);
        }
        else {
            setCategorySelection('All');
            setSearchUrl(`?page=<pageNumber>&size=${booksPerPage}`);
        }
    }


    const indexOfLastBook: number = currentPage * booksPerPage;
    const indexOfFirstBook: number = indexOfLastBook - booksPerPage;
    let lastItem = booksPerPage * currentPage <= totalAmountOfBooks ?
        booksPerPage * currentPage
        : totalAmountOfBooks;

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
    return (
        <div>
            <div className='container'>
                <div>
                    <div className='row mt-5'>
                        <div className='col-6'>
                            <div className='d-flex'>
                                <input className='form-control me-2' type='search'
                                    placeholder='Search' aria-labelledby='Search'
                                    onChange={(event) => setSearchTerm(event.target.value)}
                                />
                                <button className='btn btn-outline-success' onClick={() => searchHandler()}>
                                    Search
                                </button>
                            </div>
                        </div>
                        <div className='col-4'>
                            <div className='dropdown'>
                                <button className='btn btn-secondary dropdown-toggle' type='button'
                                    id='dropdownMenuButton1' data-bs-toggle='dropdown'
                                    aria-expanded='false'>
                                    {categorySelection}
                                </button>
                                <ul className='dropdown-menu' aria-labelledby='dropdownMenuButton1'>
                                    <li onClick={() => handleCategorySelection('All')}>
                                        <a className='dropdown-item' href='#'>
                                            All
                                        </a>
                                    </li>
                                    <li onClick={() => handleCategorySelection('Fe')}>
                                        <a className='dropdown-item' href='#'>
                                            Front End
                                        </a>
                                    </li>
                                    <li onClick={() => handleCategorySelection('Be')}>
                                        <a className='dropdown-item' href='#'>
                                            Back End
                                        </a>
                                    </li>
                                    <li onClick={() => handleCategorySelection('Data')}>
                                        <a className='dropdown-item' href='#'>
                                            Data
                                        </a>
                                    </li>
                                    <li onClick={() => handleCategorySelection('Devops')}>
                                        <a className='dropdown-item' href='#'>
                                            DevOps
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    {totalAmountOfBooks > 0 ?
                        <>
                            <div className='mt-3'>
                                <h5>Number of results: ({totalAmountOfBooks})</h5>
                            </div>
                            <p>
                                {indexOfFirstBook + 1} to {lastItem} of {totalAmountOfBooks} items:
                            </p>
                            {books.map(book => (
                                <SearchBook book={book} key={book.id} />
                            ))}
                        </>
                        :
                        <div className='m-5'>
                            <h3> Can't find that what you  are looking for</h3>
                            <a type='button' className='btn main-color btn-md px-4 me-md-2 fw-vold text-white mt-2' href='#'>
                                Library Services
                            </a>
                        </div>
                    }
                    {totalPages > 1 &&
                        <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />
                    }
                </div>
            </div>
        </div>
    );
}
