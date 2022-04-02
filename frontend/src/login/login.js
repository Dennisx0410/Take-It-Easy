import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './login.css';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import Signup from './signup';
import Socketapi from '../socketIO/socket_api.js'

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

export default function Login(props) {
  var invalid_message = false;
  // let choiceUsertype = "customer";
  const handleSubmit = async e => {
    e.preventDefault();
    // extract fields from form 
    let form = new FormData(e.target);
    let username = form.get('username');
    let password = form.get('password');
    let usertype = form.get('usertype');
    console.log(username);
    console.log(usertype);
    console.log(props.setToken);
    props.setUsertype(usertype);
    // console.log(setUsertype);
    if (username == ""){
      console.log("Blank Username");
      invalid_message = true;
      return;
    }
    if (password == ""){
      console.log("Blank Password");
      invalid_message = true;
      return;
    }
    let token = await loginAttempt({
      username: username,
      password: password
    });

    // check the variable really contains a token, else do handling
    if (token.token != null) {
      console.log('successfully login');
      props.setToken(token.token);
      // setUsertype(usertype);
      sessionStorage.setItem("token", token.token)       //Storing Token in Session Storage
      Socketapi.connect();                               //Connect to server after successfully login
      console.log(usertype);
    }
    else {
      console.log(token);
      invalid_message = true;
    }
  }

  
  return(
    <>
    <div className="row" style={{width: "100%"}}>
      <div className="col-md-9 background">
        <img src={process.env.PUBLIC_URL+"food.jpeg"} className="w-100" />
      </div>
      <div className="col-md-3">
        <div className="container">
          <h1>Please Log In</h1>
          <p>Please start the backend server as well</p>
          <form onSubmit={handleSubmit}>
            
            <input className="form-check-input" 
            // onChange={()=>{ choiceUsertype = "customer"}}
            type="radio" name="usertype" id="customer" value="customer" required/>
            <label className="form-check-label" htmlFor="customer">
              customer
            </label>
              <span>&nbsp;&nbsp;&nbsp;</span>
            <input className="form-check-input" 
            // onChange={()=>{ choiceUsertype = "restaurant"}}
            type="radio" name="usertype" id="restaurant" value="restaurant" required/>
            <label className="form-check-label" htmlFor="restaurant">
              restaurant
            </label>
              <br></br>
            <label>
              <p>Username</p>
              <input id='login-username' type="text" name="username" />
            </label>
            <br></br>
            <label>
              <p>Password</p>
              <input id='login-password' type="password" name="password" />
            </label>
            <div>
              <button type="submit">Submit</button>
            </div>
          </form>
          <div className='signup'>
            {invalid_message}
            <span style={{color: "red"}}>{invalid_message == true? "Invalid Username/Password":""}</span>
            <hr></hr>
            OR<br></br>
            <Link to="/signup" className='formattedLink' style={{textAlign: "center"}}>
              Click Here To Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
    </>   
  )
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired
};
