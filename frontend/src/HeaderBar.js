import './HeaderBar.css';
import React, { useState , useEffect} from 'react';
import { BrowserRouter, Route, Routes} from 'react-router-dom';
import {useMatch, useParams, useLocation} from 'react-router-dom';
import { Link } from 'react-router-dom';
import MaterialIcon, {colorPalette} from 'material-icons-react';
import Dropdown from 'react-bootstrap/Dropdown'
import { handleBreakpoints } from '@mui/system';
import { useNavigate } from "react-router-dom";
import { IconButton } from '@mui/material';
import DropdownToggle from 'react-bootstrap/esm/DropdownToggle';


function HeaderBar(props){
    const navigate = useNavigate();
    const [notiVisibility, setnotiVisibility] = useState(false)
    const [notifications, setNotifications] = useState([])
    const [notificationList, setList] = useState()

    useEffect(()=>{
        fetchNotification()
    }, []);


    const fetchNotification = async () => {
        const data = await fetch(`http://localhost:5000/notification/all`);
        const notis = await data.json(); //Converting data to jason
        setNotifications(notis) //Set State with fetched result
    }


    function handleOnClick(){
        console.log("clicked")
    }

    useEffect(()=>{
        //Listen to notificaition update
        props.socket?.on('notification', doc =>{
            setNotifications(prev=>[doc, ...prev])
        })

        return() =>{
            //Off listener when dismount component
            props.socket?.off('notification')
        }
    },[props.socket])

    useEffect(()=>{
        if (notifications.length > 0){
            let notificationList = notifications.map(notification=>(
                //Add React Element Here
                <Dropdown.Item id={notification._id}>{notification.message}</Dropdown.Item>
            ))
            setList(notificationList)
        }

    },[notifications])

    console.log(notifications)
    console.log(notificationList)
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
                            <div className='col-1 headerpadding'>
                               <Dropdown autoClose="outside">
                                <DropdownToggle id="noti" className="bg-transparent btn-transparent">
                                    <MaterialIcon icon="notifications" color='#FFFFFF' />
                                    </DropdownToggle>
                                    <Dropdown.Menu id="NotiContainer">
                                    {notificationList}
                                    </Dropdown.Menu>
                                </Dropdown>

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