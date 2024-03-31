import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';

function Login() {
const [name,setName]=useState("")
const [mobileNumber,setMobileNumber]=useState("")
const [email,setEmail]=useState("")
const [password,setPassword]=useState("")
const [loginEmail,setLoginEmail]=useState("")
const [loginPassword,setLoginPassword]=useState("")
const [loginError, setLoginError] = useState("");
const [registerError, setRegisterError] = useState("");

const navigate=useNavigate()

  const [formPosition, setFormPosition] = useState({ login: '50px', register: '-400px', btn: '0' });
  const register = () => {
    setFormPosition({ login: '-400px', register: '50px', btn: '110px' });
  };

  const login = () => {
    setFormPosition({ login: '50px', register: '450px', btn: '0' });
  };

  const handleloginSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8000/login', { email, password })
        .then(response => {
            const { token } = response.data;
            localStorage.setItem('token', token);
            navigate('/home');
        })
        .catch(error => {
            console.error("Error during login:", error);
            setLoginError("Invalid email or password");
        });
};

  const handleregisterSubmit = (e) => {
    e.preventDefault();
    axios.post('https://backendbook-2.onrender.com/user', { name, mobileNumber, email, password })
      .then(result => {
        console.log(result);
        login();
        setName('');
        setMobileNumber('');
        setEmail('');
        setPassword('');
      })
      .catch(error => {
        console.error("Error registering user:", error);
        if (error.response && error.response.data) {
          const errorMessage = error.response.data;
          setRegisterError(errorMessage);
        } else {
          setRegisterError("An error occurred while registering user.");
        }
      });
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
        const { exp } = JSON.parse(atob(token.split('.')[1]));
        const expirationTime = exp * 1000;
        const currentTime = Date.now();
        console.log("Token Expiry Time:", new Date(expirationTime));
        // Calculate time left before token expiration
        const timeLeft = expirationTime - currentTime;
        console.log("Time Left Before Expiry:", timeLeft);

        if (timeLeft <= 0) {
            // Token expired, clear localStorage and navigate to login
            localStorage.removeItem('token');
            navigate('/');
        } else {
            // Token still valid, set timeout for automatic logout
            const timeout = setTimeout(() => {
                localStorage.removeItem('token');
                navigate('/');
            }, timeLeft);
            console.log("Timeout set for automatic logout"); 
            return () => clearTimeout(timeout); // Cleanup
        }
    }
}, [Navigate]);
  
  return (
    <div className="head">
      <div className="fbox">
        <div className="button-box">
          <div id="btn" style={{ left: formPosition.btn }}></div>
          <button type="button" className="toggle-button" onClick={login}>Log In</button>
          <button type="button" className="toggle-button" onClick={register}>Register</button>
        </div>
        <div className="social-icons">
          <img src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png" alt="Google Icon" />
        </div>
        <form onSubmit={handleloginSubmit} id="login" className="input-details" style={{ left: formPosition.login }}>
          <input type="text" id="UserIdl" className="input-field" placeholder="Email Id"  onChange={(e)=> setEmail(e.target.value)}  required />
          <input type="password" id="passwordl" className="input-field" placeholder="Enter the Password" onChange={(e)=> setPassword(e.target.value)} required />
          <input type="checkbox" id="agreel" className="chck-box" required/><span>Remember Password</span>
          <button type="submit" id="submitl" className="sbt-btn">Log in</button>
          {loginError && <p className="loginerror">{loginError}</p>}
        </form>
        
        <form onSubmit={handleregisterSubmit} id="register" className="input-details" style={{ left: formPosition.register }}>
        
          <input type="text" id="UserIdr" className="input-field" placeholder="User Name" value={name} onChange={(e)=> setName(e.target.value)} required />
          <input type="email" id="emailr" className="input-field" placeholder="Email Id" value={email} onChange={(e)=> setEmail(e.target.value)} required />
          <input type="text" id="numberr" className="input-field" placeholder="Enter PhoneNumber" value={mobileNumber} onChange={(e)=> setMobileNumber(e.target.value)}/>
          <input type="password" id="passwordr" className="input-field" placeholder="Enter the Password" value={password} onChange={(e)=> setPassword(e.target.value)} required />
          <input type="checkbox" id="agreer" className="chck-box" required/><span>Agree to the terms and conditions</span>
          <button type="submit" id="submitr" className="sbt-btn">Register</button>
          {registerError && <p className="registerError">{registerError}</p>}
          
        </form>
      </div>
    </div>
  );
}

export default Login;
