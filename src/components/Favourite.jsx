import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaHeart } from 'react-icons/fa';

function Favourite() {
  const [userId, setUserId] = useState(null);
  const [userFavorites, setUserFavorites] = useState([]);
  const [favoriteBooks, setFavoriteBooks] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = decodeJwtToken(token);
      setUserId(decoded.userId);
      fetchFavorites(decoded.userId);
    }
  }, []);

  const isFavorite = (bookId) => {
    return userFavorites.some(favorite => favorite.bookId === bookId);
  };

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

  const fetchFavorites = async (userId) => {
    try {
      const response = await axios.get(`https://backendbook-2.onrender.com/api/user/${userId}/favorites`);
      setUserFavorites(response.data);
      fetchFavoriteBooks(response.data);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const fetchFavoriteBooks = async (favorites) => {
    try {
      const bookIds = favorites.map(favorite => favorite.bookId);
      const response = await axios.post('https://backendbook-2.onrender.com/books/favorites', { bookIds });
      setFavoriteBooks(response.data);
    } catch (error) {
      console.error('Error fetching favorite books:', error);
    }
  };

  // Function to handle adding/removing favorite
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
      <h1 className='favtext'>Favorite Books</h1>
      <div className="grid-container">
        {favoriteBooks.length === 0 ? (
          <p className='faverror'>No favorite books found</p>
        ) : (
          favoriteBooks.map(book => (
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
    </div>
  );
}

export default Favourite;
