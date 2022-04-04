import './HeaderBar.css';
import React, { useState } from 'react';
import { BrowserRouter, Route, Routes} from 'react-router-dom';
import {useMatch, useParams, useLocation} from 'react-router-dom';
import { Link } from 'react-router-dom';
import MaterialIcon, {colorPalette} from 'material-icons-react';
import Dropdown from 'react-bootstrap/Dropdown'
import { handleBreakpoints } from '@mui/system';
import { useNavigate } from "react-router-dom";

function HeaderBar(props){
    const navigate = useNavigate();
    // {usertype, setToken}
    // const handleLogout = (logout) => {
    //     console.log("In handle logout");
    //     // logout(undefined);
    // }
    // function handleLink(){

    // }
    // console.log(props.setToken);
    function getPoint(){
        return -1;
    }
    if (props.usertype=="restaurant"){
        return (
            <>
                <div className='header stickyBar'>
                    <div className='container-fluid text-center'>
                        <div className='row'>
                            <div className='col-2'></div>
                            <div className='col-8'>
                                <Link to="/" className="header-title " style={{textAlign: "center"}}>
                                    <MaterialIcon icon="takeout_dining" color='#FFFFFF' />
                                    <span ><b>TAKE IT EASY</b></span>
                                    <MaterialIcon icon="takeout_dining" color='#FFFFFF' />
                                </Link>
                            </div>
                            
                            <div className='col-1'></div>
                            <div className='col-1 headerpadding bg-transparent btn-transparent'>
                                <Dropdown className="d-inline mx-2 bg-transparent btn-transparent" autoClose="outside" >
                                    <Dropdown.Toggle id="dropdown-autoclose-outside"  className="bg-transparent btn-transparent"  size="sm">
                                        <MaterialIcon icon="account_circle" color='#FFFFFF'/>
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                    {/* <Link to="/"></Link> */}
                                    <Dropdown.Item href="/">Menu</Dropdown.Item>
                                    {/* <Link to="/r/profile"></Link> */}
                                    <Dropdown.Item href="/r/profile">Profile</Dropdown.Item>
                                    <Dropdown.Item href="/r/history">Order History</Dropdown.Item>
                                        <Dropdown.Divider />
                                    <Dropdown.Item onClick={()=>{props.setToken(undefined);}} >Logout</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
    else if (props.usertype=="customer"){
        return (
            <>
                <div className='header stickyBar'>
                    <div className='container-fluid text-center'>
                        <div className='row'>
                            <div className='col-3'></div>
                            <div className='col-6'>
                                <Link to="/" className="header-title " style={{textAlign: "center"}}>
                                    <MaterialIcon icon="takeout_dining" color='#FFFFFF' />
                                    <span ><b>TAKE IT EASY</b></span>
                                    <MaterialIcon icon="takeout_dining" color='#FFFFFF' />
                                </Link>
                            </div>
                            <div className='col-1 '>
                               {/* Notification Button here */}
                            </div>
                            <div className='col-1 points'>
                                <MaterialIcon icon="savings" color='#FFFFFF' />: {getPoint()}
                            </div>
                            <div className='col-1 headerpadding bg-transparent btn-transparent'>
                                <Dropdown className="d-inline mx-2 bg-transparent btn-transparent" autoClose="outside" >
                                    <Dropdown.Toggle id="dropdown-autoclose-outside"  className="bg-transparent btn-transparent"  size="sm">
                                        <MaterialIcon icon="account_circle" color='#FFFFFF' />
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                    {/* <Link to="/customer/profile">
                                        Profile */}
                                    <Dropdown.Item onClick={() => navigate('/customer/profile', { replace: true })}>Profile</Dropdown.Item>
                                    {/* </Link> */}
                                    <Dropdown.Item onClick={() => navigate('/customer/history', { replace: true })}>Order History</Dropdown.Item>
                                        <Dropdown.Divider />
                                    <Dropdown.Item onClick={()=> {navigate('/'); props.setToken(undefined);}} >Logout</Dropdown.Item>
                                    {/* onClick={handleLogout(props.setToken)} */}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </>
        );
    }
    else if (props.usertype=="admin"){
        return (
            <>
                <div className='header stickyBar'>
                    <div className='container-fluid text-center'>
                        <div className='row'>
                            <div className='col-2'></div>
                            <div className='col-8'>
                                <Link to="/" className="header-title " style={{textAlign: "center"}}>
                                    <MaterialIcon icon="takeout_dining" color='#FFFFFF' />
                                    <span ><b>TAKE IT EASY</b></span>
                                    <MaterialIcon icon="takeout_dining" color='#FFFFFF' />
                                </Link>
                            </div>
                            
                            <div className='col-1 headerpadding'></div>
                            <div className='col-1 headerpadding bg-transparent btn-transparent'>
                                <Dropdown className="d-inline mx-2 bg-transparent btn-transparent" autoClose="outside" >
                                    <Dropdown.Toggle id="dropdown-autoclose-outside"  className="bg-transparent "  size="sm">
                                        <MaterialIcon icon="account_circle" color='#FFFFFF' />
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu style={{zIndex:10}} >
                                    <Dropdown.Item onClick={() => navigate("/", { replace: true })} >orders</Dropdown.Item>
                                    <Dropdown.Item onClick={() => navigate("/userlist/customers", { replace: true })} >Customers' List</Dropdown.Item>
                                    <Dropdown.Item onClick={() => navigate("/userlist/restaurants", { replace: true })} >Restaurants' List</Dropdown.Item>
                                        <Dropdown.Divider />
                                    <Dropdown.Item onClick={()=>{props.setToken(undefined);}} >Logout</Dropdown.Item>
                                    {/* onClick={handleLogout(props.setToken)} */}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </>
        );
    }    
}

export default HeaderBar;