import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './login.css';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import Signup from './signup';

const token_tmp_str = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjNiMzk5YzI5YWQyM2IyYWFkYjY0OWMiLCJpYXQiOjE2NDgwNDg2Njd9.MB6lDdXwVau8kbDV1AncSGdXAadl54--2uoHp1s5El8';

// send login request to get token 
async function loginAttempt(input) {
 return fetch('http://localhost:5000/customer/signin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(input)
  })
  .then(data => data.json())
} 

export default function Login( {setToken} ) {
  const [imgUrl, setImgUrl] = useState();
  const handleSubmit = async e => {
    e.preventDefault();

    // extract fields from form 
    let form = new FormData(e.target);
    let username = form.get('username');
    let password = form.get('password');

    let token = await loginAttempt({
      username: username,
      password: password
    });

    // check the variable really contains a token, else do handling
    if (token.token != null) {
      console.log('successfully login');
      setToken(token.token);
    }
    else {
      console.log(token.token);
    }
  }

  return(
    <>
    <div className="row">
      <div className="col-8 background">
        <img src={process.env.PUBLIC_URL+"food.jpeg"} className="w-100" />
      </div>
      <div className="col-4">
        <div className="loginstyling">
          <h1>Please Log In</h1>
          <p>Please start the backend server as well</p>
          <form onSubmit={handleSubmit}>
            <label>
              <p>Username</p>
              <input type="text" name="username" />
            </label>
            <br></br>
            <label>
              <p>Password</p>
              <input type="password" name="password" />
            </label>
            <div>
              <button type="submit">Submit</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    </>   
  )
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired
};