import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './login.css';
import { Link, useNavigate } from 'react-router-dom';

// send login request to get token 
async function loginAttempt(input, usertype) {
 return fetch(`http://localhost:5000/${usertype}/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(input)
  })
  .then(data => data.json())
} 

export default function Login(props) {
  // var invalid_message = false;
  const [loginStatus, setLoginStatus] = useState('');
  const [pwVisibility, setPwVisibility] = useState(false);
  const navigate = useNavigate();

  // let choiceUsertype = "customer";
  const handleSubmit = async e => {
    e.preventDefault();

    // extract fields from form 
    let loginForm = e.target;
    let formData = new FormData(loginForm);
    let username = formData.get('username');
    let password = formData.get('password');
    let usertype = formData.get('usertype');

    console.log(username);
    console.log(usertype);
    console.log(props.setToken);
    // if (username == ""){
    //   console.log("Blank Username");
    //   invalid_message = true;
    //   return;
    // }
    // if (password == ""){
    //   console.log("Blank Password");
    //   invalid_message = true;
    //   return;
    // }
    props.setUserInfo({
        username: formData.get('username'),
        usertype: formData.get('usertype')
    });
    let res = await loginAttempt({
      username: username,
      password: password
    }, usertype);

    // check the variable really contains a token, else do handling
    if (res.token != null) {
      console.log('successfully login');
      props.setToken(res.token);
      sessionStorage.setItem("token", res.token)       //Storing Token in Session Storage
      sessionStorage.setItem("username", username)
      sessionStorage.setItem("usertype", usertype)
      console.log(usertype);
    }
    else {
      console.log(res);
      setLoginStatus(res.name);
      if (usertype === 'customer' && ['AccountNotActivatedAndVerificationEmailSent', 'AccountNotActivatedAndPendingOtp'].includes(res.name)) {
        console.log('account not activated!');
        navigate('/verification');
      }
      else if (usertype === 'restaurant' && res.name === 'AccountNotApproved') {
        console.log('account not approved!');
        navigate('/verification');
      }
      // invalid_message = true;
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
          <h1>Login</h1>
          <hr className="header"></hr>
            <form id="login" onSubmit={handleSubmit}>
              <div>
                <label>
                  <i className="material-icons">account_circle</i>User type
                </label>
                <div className="container">
                  <div className="row">
                    <div className="mb-3 form-radio" style={{textAlign: ''}}>
                      <input className="form-check-input" type="radio" name="usertype" id="customer" value="customer" required/>
                      <label className="form-check-label" htmlFor="customer">
                        <i className="material-icons d-none d-lg-inline">person</i>
                        Customer
                      </label>
                    </div>
                    <div className="mb-3 form-radio" style={{textAlign: ''}}>
                      <input className="form-check-input" type="radio" name="usertype" id="restaurant" value="restaurant" required/>
                      <label className="form-check-label" htmlFor="restaurant">
                        <i className="material-icons d-none d-lg-inline">restaurant</i>Restaurant
                      </label>
                    </div>
                    <div className="mb-3 form-radio" style={{textAlign: ''}}>
                      <input className="form-check-input" type="radio" name="usertype" id="admin" value="admin" required/>
                      <label className="form-check-label" htmlFor="admin">
                        <i className="material-icons d-none d-lg-inline">manage_accounts</i>Admin
                      </label>
                    </div>
                  </div> 
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-12">
                  <label htmlFor="username" className="form-label">
                    <i className="material-icons">edit</i>Username
                  </label>
                  <input type="text" className="form-control" id="username" name="username" pattern="^[a-zA-Z0-9_\\.]+$" title="Combinations of alphanumeric characters, full stop('.') and underscore('_') only" required/>
                </div>
                <div className="col-12">
                  <label htmlFor="password" className="form-label">
                    <i className="material-icons">password</i>Password
                  </label>
                  <div className="input-group">
                    <input type={pwVisibility ? "text" : "password"} className="form-control" id="password" name="password" required/>
                    <button type="button" className="material-icons input-group-text" onClick={() => setPwVisibility(!pwVisibility)}>{pwVisibility ? "visibility_off" : "visibility"}</button>
                  </div>
                </div>
              </div>
              <p style={{color: "red", display: ['UserNotFound', 'InvalidPassword'].includes(loginStatus) ? "block" : "none"}}> 
                <i className="material-icons">warning</i>
                Invalid username and password pair!
              </p>
              <button type="submit" className="btn btn-primary">Submit</button>
            </form>

          {/* <form onSubmit={handleSubmit}>
            <input className="form-check-input" 
            type="radio" name="usertype" id="customer" value="customer" required/>
            <label className="form-check-label" htmlFor="customer">
              customer
            </label>
              <span>&nbsp;&nbsp;&nbsp;</span>
            <input className="form-check-input" 
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
          </form> */}
          <div className='signup'>
            {/* {invalid_message} */}
            {/* <span style={{color: "red"}}>{invalid_message == true? "Invalid Username/Password":""}</span> */}
            <hr className="header"></hr>
            OR<br></br>
            <Link to="/signup" className='formattedLink' style={{textAlign: "center"}}>
              Click here to sign up
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
