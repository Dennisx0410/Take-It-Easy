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
import UserRestaurant from './main/user_restaurant';

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
    const [usertype, setUsertype]= useState();
    if(token === undefined) {
        console.log(token);
        return (
            <>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Login setToken={setToken} setUsertype={setUsertype}/>} />  
                        <Route path="/signup" element={<Signup/>} />
                        <Route path="*" element={<NoMatch/>} />
                    </Routes>
                </BrowserRouter>
            </>
        );
    }
    else{ 
        console.log("::::::"+usertype);
        if (usertype == "restaurant"){
            return (
                <>
                    <div>
                        <BrowserRouter>
                            {/* Header Bar */}
                            <HeaderBar usertype={usertype} setToken={setToken} />
                            <Routes> 

                                <Route path="/" element={<UserRestaurant page="menu" />} />
                                <Route path="/customer/profile" element={<UserRestaurant page="profile" />} />
                                <Route path="/customer/history" element={<UserRestaurant page="history" />} />
                                <Route path="*" element={<NoMatch/>} />
                            </Routes>
                        </BrowserRouter>
                    </div>
                </>
            );
        }
        else if (usertype == "customer"){
            return (
                <>
                    <div>
                        <BrowserRouter>
                            {/* Header Bar */}
                            <HeaderBar usertype={usertype} setToken={setToken} />
                            <Routes>
                                <Route path="/" element={<Main name="Take It Easy!"/>} />  
                                <Route path="/restaurant/:rid" element={<Restaurant />} />
                                <Route path="/customer/:action" element={<Customer token={token} />} />
                                <Route path="*" element={<NoMatch/>} />
                            </Routes>
                        </BrowserRouter>
                    </div>
                </>
            );
        }
    }
    
}


export default App;
