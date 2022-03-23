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

async function attemp2(pic, token_str) {
  return fetch('http://localhost:5000/customer/upload/img', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token_str}`
        },
        body: pic 
      })
} 

export default function Login( {setToken} ) {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();


  const handleSubmit = async e => {
    e.preventDefault();
    console.log(e.target)

    const token = await loginAttempt({
      username,
      password
    });

    // check the content of token for any error msg, 
    // a key called 'token' with token value would be contained inside token if successfullly login
    console.log(token)
    if (token.token != null) {
      console.log('login success');
      setToken(token);

      // // let token_str = token.token
      // let token_str = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjM5N2IzZWExODc2MDNmZTJlM2JiMzgiLCJpYXQiOjE2NDc5MzQ2NDIsImV4cCI6MTY0NzkzNjQ0Mn0.PNghwItfT9g7Ari48IuPbzEceNxY_XaCd4kEJcjQ0fU';

      // console.log(token_str);

      // let formm = new FormData(e.target);
      // console.log(formm)
      // console.log(formm.get('profile'))


      // const result = await attemp2({profile: formm.get('profile')}, token_str);

      // console.log(result)
    }
    else {
      console.log('login failed');
    }
  }

  const handleSubmit2 = async e => {
    let token_str = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjM5N2ZmNGM2N2E3ZmY4NTk3OTI2ODciLCJpYXQiOjE2NDc5MzU3NzQsImV4cCI6MTY0NzkzNzU3NH0.zogwQFGwcjesc6DEhalFcZFHvr6LqK6jyMS-k8BTvdc';

    console.log(token_str);

    let formm = new FormData(e.target);
    console.log(formm)
    console.log(formm.get('profile'))


    const result = await attemp2(formm, token_str);

    console.log(result)
    setToken({token: token_str});
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

      <form onSubmit={handleSubmit2}>
        <input type="file" name="profile" accept="image/*"/>
        <input type="submit"/>
      </form>
      <form onSubmit={handleSubmit}>
        <label>
          <p>Username</p>
          <input type="text" onChange={e => setUsername(e.target.value)} />
        </label>
        <br></br>
        <label>
          <p>Password</p>
          <input type="password" onChange={e => setPassword(e.target.value)} />
        </label>
        {/* <div>
          <button type="submit">Submit</button>
        </div>
        Picture: <input type="file" name="profile" accept="image/*"/> */}
      </form>
    </div>
  )
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired
};
