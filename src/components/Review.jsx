import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { BsStarFill, BsPersonFill } from 'react-icons/bs'; // Import star and person icons

function Review() {
  const [book, setBook] = useState(null);
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [userId, setUserId] = useState('');
  const [reviewData, setReviewData] = useState(null);
  const [ratingError, setRatingError] = useState('');
  const [commentsError, setCommentsError] = useState('');

  const { bookId } = useParams();

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

  useEffect(() => {
    if (bookId) {
      fetchBookDetails(bookId);
      fetchReviews(bookId);
    }
    // Fetch username from JWT token
    const token = localStorage.getItem('token');
    if (token) {
      const { name } = decodeJwtToken(token);
      setName(name);
    }
  }, [bookId]);

  const fetchBookDetails = async (id) => {
    try {
      const response = await axios.get(`https://backendbook-2.onrender.com/api/books/${id}`);
      setBook(response.data);
    } catch (error) {
      console.error('Error fetching book details:', error);
    }
  };

  const fetchReviews = async (id) => {
    try {
      const response = await axios.get(`https://backendbook-2.onrender.com/api/reviews/${id}`);
      setReviewData(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleRatingChange = (value) => {
    setRating(value);
    setRatingError('');
  };

  const handleCommentsChange = (event) => {
    setComments(event.target.value);
    setCommentsError('');
  };

  const handleSubmit = async () => {
    try {
      if (rating === 0) {
        setRatingError('Please select a rating');
        return;
      }

      if (comments.trim() === '') {
        setCommentsError('Please enter your comments');
        return;
      }

      const response = await axios.post('https://backendbook-2.onrender.com/api/reviews', {
        bookId,
        rating,
        comment: comments,
        username: name,
      });
      console.log('Review submitted successfully:', response.data);
      // Close the modal and reset state
      setModalIsOpen(false);
      setRating(0);
      setComments('');
      // Update reviews after submission
      fetchReviews(bookId);
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  if (!book) {
    return <div>Loading...</div>;
  }

  const { title, author, genre, description, imagePath } = book;

  return (
    <div className="review-container">
      <div className="book-card">
        <img src={`https://backendbook-2.onrender.com/${imagePath}`} alt="Book Cover" className="book-card-image" />
        <div className="book-card-details">
          <h2>{title}</h2>
          <p><strong>Author:</strong> {author}</p>
          <p><strong>Genre:</strong> {genre}</p>
          <p><strong>Description:</strong> {description}</p>
          <Button variant="primary" className="book-card-btn" onClick={() => setModalIsOpen(true)}>Rate</Button>
        </div>
      </div>
      <div className="review-card">
        <h3>Reviews</h3>
        {reviewData ? (
          reviewData.map((review, index) => (
            <div key={index} className="individual-review">
              <p><BsPersonFill /> {review.username}</p>
              <p>{[...Array(parseInt(review.rating))].map((_, index) => <BsStarFill key={index} style={{ color: '#FFD700' }} />)}</p>
              <p><strong>Comment:</strong> {review.comment}</p>
            </div>
          ))
        ) : (
          <p>No reviews</p>
        )}
      </div>
      <Modal show={modalIsOpen} onHide={() => setModalIsOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Rate & Comment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Rating</Form.Label>
            <div>
              {[...Array(5)].map((_, index) => (
                <BsStarFill
                  key={index}
                  onClick={() => handleRatingChange(index + 1)}
                  style={{ cursor: 'pointer', color: index < rating ? '#FFD700' : '#ced4da' }}
                />
              ))}
              {ratingError && <p style={{ color: 'red' }}>{ratingError}</p>}
            </div>
          </Form.Group>
          <Form.Group>
            <Form.Label>Comments</Form.Label>
            <Form.Control as="textarea" value={comments} onChange={handleCommentsChange} placeholder="Leave your comments" />
            {commentsError && <p style={{ color: 'red' }}>{commentsError}</p>}
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalIsOpen(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit}>Submit</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Review;
