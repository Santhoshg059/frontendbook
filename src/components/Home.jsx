import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch, FaArrowLeft, FaArrowRight, FaHeart } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';

function Home() {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(8);
  const [userId, setUserId] = useState(null);
  const [userFavorites, setUserFavorites] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = decodeJwtToken(token);
      setUserId(decoded.userId);
      fetchFavorites(decoded.userId);
    }
    fetchBooks();
  }, []);

  const decodeJwtToken = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));

      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding JWT token:', error);
      return null;
    }
  };

  const fetchBooks = async () => {
    try {
      const response = await axios.get('https://backendbook-2.onrender.com/api/books');
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const fetchFavorites = async (userId) => {
    try {
      const response = await axios.get(`https://backendbook-2.onrender.com/api/user/${userId}/favorites`);
      setUserFavorites(response.data);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const isFavorite = (bookId) => {
    return userFavorites.some(favorite => favorite.bookId === bookId);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredBooks = books.filter(book =>
    (book.title && book.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (book.genre && book.genre.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (book.author && book.author.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleNextPage = () => {
    if (currentPage < Math.ceil(filteredBooks.length / booksPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleFavorite = async (bookId) => {
    try {
      const existingFavorite = userFavorites.find(favorite => favorite.bookId === bookId);

      if (existingFavorite) {
        await axios.delete(`https://backendbook-2.onrender.com/api/favorites/${existingFavorite._id}`);
        fetchFavorites(userId);
      } else {
        await axios.post('https://backendbook-2.onrender.com/api/favorites', { userId, bookId });
        fetchFavorites(userId);
      }
    } catch (error) {
      console.error('Error handling favorite:', error);
    }
  };

  return (
    <div className="container">
      
      <div className="search-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Search by title, genre, or author"
          value={searchTerm}
          onChange={handleSearch}
        />
        <FaSearch className="search-icon" size={20} />
      </div>
      <div className="grid-container">
        {currentBooks.length === 0 ? (
          <p>No matches</p>
        ) : (
          currentBooks.map(book => (
            <div className="card" key={book._id}>
              {book.imagePath && (
                <img
                  src={`https://backendbook-2.onrender.com/${book.imagePath}`}
                  alt="Book Cover"
                  className="card-image"
                />
              )}
              <div className="card-content">
                <h2 className="card-title">{book.title}</h2>
                <p><strong>Author:</strong> {book.author}</p>
                <p><strong>Genre:</strong> {book.genre}</p>
                <FaHeart
                  className={`heart-icon ${isFavorite(book._id) ? 'red' : ''}`}
                  onClick={() => handleFavorite(book._id)}
                />
                <Link to={`/review/${book._id}`} className="view-button">View</Link>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="pagination">
        <button onClick={handlePrevPage}><FaArrowLeft /></button>
        {Array.from({ length: Math.ceil(filteredBooks.length / booksPerPage) }, (_, i) => (
          <button key={i + 1} onClick={() => paginate(i + 1)}>{i + 1}</button>
        ))}
        <button onClick={handleNextPage}><FaArrowRight /></button>
      </div>
    </div>
  );
}

export default Home;
