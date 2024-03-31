import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css'; // Import CSS file for styling

function Profile() {
  const [userId, setUserId] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadError, setUploadError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = decodeJwtToken(token);
      setUserId(decoded.userId);
      fetchUserInfo(decoded.userId);
    }
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

  const fetchUserInfo = async (userId) => {
    try {
      const response = await axios.get(`https://backendbook-2.onrender.com/api/user/${userId}`);
      setUserInfo(response.data);
      setProfileImage(response.data.profileImagePath); // Set profile image path if available
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(URL.createObjectURL(file));
    setUploadedImage(file);
  };

  const handleUploadImage = async () => {
    try {
      if (!uploadedImage) {
        console.error('No image selected');
        return;
      }

      const formData = new FormData();
      formData.append('image', uploadedImage);

      const response = await axios.post(
        `https://backendbook-2.onrender.com/api/user/${userId}/profile-image`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }
      );

      // Update the profile image path in the state
      setProfileImage(response.data.profileImagePath);
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploadError('Error uploading image');
    }
  };

  return (
    <div className="container containerprofile">
      {userInfo && (
        <div className="card cardprofile">
          <div className="profile-image-container">
            <img
              src={profileImage ? `https://backendbook-2.onrender.com/${profileImage}` : 'default-profile-image.jpg'}
              alt="Profile"
              className="profile-image"
            />
            {/* Upload button */}
            <input type="file" accept="image/*" onChange={handleImageChange} />
            <button className='uploadbtn' onClick={handleUploadImage}>Upload</button>
            {uploadError && <p className="error-message">{uploadError}</p>}
          </div>
          <div className="card-contentprofile">
            <h2>{userInfo.name}</h2>
            <p><strong>Mobile Number:</strong> {userInfo.mobileNumber}</p>
            <p><strong>Email:</strong> {userInfo.email}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
