import './App.css';
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes} from 'react-router-dom';
import {Link} from 'react-router-dom';
import {useMatch, useParams, useLocation} from 'react-router-dom';
import ReactDOM from 'react-dom';
import Login from './login/login';
import Signup from './login/signup';
import Verification from './login/verification';
import Main from './main/main';
import Restaurant from './main/restaurant';
import HeaderBar from './HeaderBar';
import Customer from './main/customer';
import UserRestaurant from './main/user_restaurant';
import Admin from './main/admin';
import { useNavigate } from "react-router-dom";
import { io} from "socket.io-client"

function NoMatch() {
    const navigate = useNavigate();
    let location = useLocation();
    console.log(location.pathname);
    // navigate('/', { replace: true })
    return (
      <div>
        <h3>
          No match for <code>{location.pathname}</code>
        </h3>
      </div>
    );
}


function App(){
    const [token, setToken] = useState(null);
    const [userInfo, setUserInfo]= useState({});
    const [socket, setSocket] = useState(null)

    //Try Fetch from sessionStorage
    useEffect(()=>{
        setToken(sessionStorage.getItem("token"))
        let username = sessionStorage.getItem("username")
        let usertype = sessionStorage.getItem("usertype")
        setUserInfo({username, usertype})
    },[])

    useEffect(()=>{
        if (token != null){
            setSocket(io("http://localhost:8080", {
                query:{token}
              }))
        }
      },[token])

    useEffect(() =>{
      socket?.on('connect', () =>{
        console.log(`Client Connect to the Server with ID ${socket.id}`)})
    },[socket])


    console.log(userInfo)
    if (token == null) {
        if (!['customer', 'restaurant', 'admin'].includes(userInfo.usertype)) {
            return (
                <>
                    <div className="row main">
                        <div className="d-none d-md-block col-md-8 background">
                            <img id="bgd" src={process.env.PUBLIC_URL+"food.jpeg"} />
                        </div>
                        <div className="col-md-4">
                            <BrowserRouter>
                                <Routes>
                                    <Route path="/" element={<Login setToken={setToken} setUserInfo={setUserInfo}/>} />  
                                    <Route path="/signup" element={<Signup setToken={setToken} setUserInfo={setUserInfo} />} />
                                    <Route path="*" element={<NoMatch/>} />
                                </Routes>
                            </BrowserRouter>
                        </div>
                    </div>
                </>
            );
        }
        else {
            return (
                <>
                    <div className="row main">
                        <div className="d-none d-md-block col-md-8 background">
                            <img id="bgd" src={process.env.PUBLIC_URL+"food.jpeg"} />
                        </div>
                        <div className="col-md-4">
                            <BrowserRouter>
                                <Routes>
                                    <Route path="/" element={<Login setToken={setToken} setUserInfo={setUserInfo}/>} />  
                                    <Route path="/signup" element={<Signup setToken={setToken} setUserInfo={setUserInfo} />} />
                                    <Route path="/verification" element={<Verification setToken={setToken} userInfo={userInfo} />} />  
                                    <Route path="*" element={<NoMatch/>} />
                                </Routes>
                            </BrowserRouter>
                        </div>
                    </div>
                
                </>
            );
        }
        
    }
    else { 
        let usertype = userInfo.usertype;
        console.log("::::::"+userInfo.usertype);
        if (usertype == "restaurant"){
            console.log("::::::"+usertype);
            return (
                <>
                    <div>
                        <BrowserRouter>
                            {/* Header Bar */}
                            <HeaderBar usertype={usertype} setToken={setToken} />
                            <Routes> 
                                <Route path="/" element={<UserRestaurant page="menu" />} />
                                <Route path="/r/profile" element={<UserRestaurant page="profile" />} />
                                <Route path="/r/history" element={<UserRestaurant page="history" />} />
                                <Route path="*" element={<NoMatch/>} />
                            </Routes>
                        </BrowserRouter>
                    </div>
                </>
            );
        }
        else if (usertype == "customer"){
            console.log("::::::"+usertype);
            return (
                <>
                    <div>
                        <BrowserRouter>
                            {/* Header Bar */}
                            <HeaderBar usertype={usertype} setToken={setToken} socket={socket}/>
                            <Routes>
                                <Route path="/" element={<Main />} />  
                                {/* <Route path="/signup" element={<Main name="Take It Easy!"/>} />   */}
                                <Route path="/restaurant/:rid" element={<Restaurant />} />
                                <Route path="/customer/profile" element={<Customer action={"profile"} />} />
                                <Route path="/customer/history" element={<Customer action={"history"} />} />
                                <Route path="*" element={<NoMatch/>} />
                            </Routes>
                        </BrowserRouter>
                    </div>
                </>
            );
        }
        else if (usertype == "admin"){
            console.log("::::::"+usertype);
            return (
                <>
                    <div>
                        <BrowserRouter>
                            {/* Header Bar */}
                            <HeaderBar usertype={usertype} setToken={setToken} />
                            <Routes>
                                <Route path="/" element={<Admin page="orders"/>} />  
                                <Route path="/userlist/customers" element={<Admin page="ULCustomer"/>} />  
                                <Route path="/userlist/restaurants" element={<Admin page="ULRestaurant"/>} />  
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
