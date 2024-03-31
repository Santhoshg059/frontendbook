import React, { useState } from 'react';
import applogo from "../images/applogo.png"
import Home from './Home';
import AppRoutes from '../utils/AppRoutes';

function Navbar() {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(prev => !prev);
  };
const handleLogout = () => {
    // Clear authentication token from local storage
    localStorage.removeItem('token');
    // Redirect to login page
    history.push('/');
  };
  return (
    <div id="headhome">
      <nav className="topnav">
        <input type="checkbox" id="check" onChange={handleCheckboxChange} checked={isChecked} />
        <label htmlFor="check" className="chckbtn">
          <i className={`fas ${isChecked ? 'fa-check-square' : 'fa-square'}`}></i> {/* Use FontAwesome icons to represent check/uncheck */}
        </label>

        <img className="comradeimg" src={applogo} alt="App Logo" />
        <label className="comradename">BookHub</label>
        
        <ul className={`nav-links ${isChecked ? 'active' : ''}`}>
          <li><a href="/home">Home</a></li>
          <li><a href="/favourite">Your Favorite</a></li>
          <li><a href="/">LogOut</a></li>
          {/* <li><a href="/notifications"><FontAwesomeIcon icon={faBell} /></a></li> */}
          <li>
            <a href="/profile">
              Profile
              <img className="profileimg" src="https://cdn1.iconfinder.com/data/icons/avatar-2-2/512/Programmer-512.png" alt="Profile Image" />
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Navbar;
