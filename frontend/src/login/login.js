import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './login.css';

//Just for testing, to be implemented with backend
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
  // const [username, setUsername] = useState();
  // const [password, setPassword] = useState();
  const handleSubmit = async e => {
    e.preventDefault();

    let form = new FormData(e.target);
    let username = form.get('username');
    let password = form.get('password');

    const token = await loginAttempt({
      username: username,
      password: password
    });

    // check the variable really contains a token, else do handling
    if (token.token != null) {
      console.log('successfully login');
      setToken(token);
    }
    else {
      console.log(token);
    }
  }

  return(
    <div className="loginstyling">
      <h1>Please Log In</h1>
      <p>
        This is still under construction.
        To go to the main page,
        Please type in the terminal "node .\src\testServer\server.js"
        to make a fake token,
        and enter whatever username and password you like to enter the main page.
      </p>
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
  )
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired
};