import './App.css';
import React, { useState } from 'react';
import { BrowserRouter, Route, Routes} from 'react-router-dom';
import {Link} from 'react-router-dom';
import {useMatch, useParams, useLocation} from 'react-router-dom';
import ReactDOM from 'react-dom';
import Login from './login/login';
import Signup from './login/signup';
import Main from './main/main';
import Restaurant from './main/restaurant';
import HeaderBar from './HeaderBar';
import Customer from './main/customer';

function NoMatch() {
    let location = useLocation();
    return (
      <div>
        <h3>
          No match for <code>{location.pathname}</code>
        </h3>
      </div>
    );
}

function App(){
    const [token, setToken] = useState();
    if(!token) {
        return (
        <>
            <Login setToken={setToken} />
            <Signup/>
        </>)
    }
    return (
        <>
            <div>
                <BrowserRouter>
                    {/* Header Bar */}
                    <HeaderBar/>
                    <Routes>
                        <Route path="/" element={<Main name="Take It Easy!"/>} />  
                        <Route path="/restaurant/:rid" element={<Restaurant />} />
                        <Route path="/customer/:action" element={<Customer />} />
                        <Route path="*" element={<NoMatch/>} />
                    </Routes>
                </BrowserRouter>
            </div>
        </>
    );
}


export default App;
