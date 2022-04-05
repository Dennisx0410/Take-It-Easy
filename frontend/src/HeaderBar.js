import './HeaderBar.css';
import React, { useState , useEffect} from 'react';
import { BrowserRouter, Route, Routes} from 'react-router-dom';
import {useMatch, useParams, useLocation} from 'react-router-dom';
import { Link } from 'react-router-dom';
import MaterialIcon, {colorPalette} from 'material-icons-react';
import Dropdown from 'react-bootstrap/Dropdown'
import { handleBreakpoints } from '@mui/system';
import { useNavigate } from "react-router-dom";
import { Badge, IconButton } from '@mui/material';
import DropdownToggle from 'react-bootstrap/esm/DropdownToggle';

// function Points(){
//     const [skipTriggerFetch, setskipTF] = useState(false);
//     const [customerInfo, setCustomerInfo] = useState([]);
    
//     const PREFIX='http://localhost:5000';
    
//     useEffect(() => {
//         const url_d = PREFIX+'/customer/data';
//         const fetchData = async () => {
//           try {
//             const response = await fetch(
//                 url_d, {
//                 method: 'GET',
//                 headers: {
//                     'Authorization': 'Bearer '+sessionStorage.getItem("token")
//                 }}
//             );
//             const customer_info = await response.json();
//             setCustomerInfo(customer_info);
//             console.log(customer_info);

//           } catch (error) {
//             console.log("error", error);
//           }
//         };
//         fetchData();
//     }, []);
//     return(
//         <>
//             {customerInfo.points}
//         </>
//     );

// }


function HeaderBar(props){
    let navigate = useNavigate();
    const [customerInfo, setCustomerInfo] = useState([]);
    const PREFIX='http://localhost:5000';
    useEffect(() => {
        console.log("A");
        const url_d = PREFIX+'/customer/data';
        const fetchData = async () => {
          try {
            const response = await fetch(
                url_d, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer '+sessionStorage.getItem("token")
                }}
            );
            const customer_info = await response.json();
            setCustomerInfo(customer_info);
            console.log(customer_info);

          } catch (error) {
            console.log("error", error);
          }
        };
        fetchData();
    }, []);
    const [notifications, setNotifications] = useState([]);
    const [notificationList, setList] = useState();
    
    useEffect(()=>{
        fetchNotification()
    }, []);


    const fetchNotification = async () => {
        const data = await fetch(`http://localhost:5000/notification/fetchIndividual`, {
            headers:{
                'Authorization':"Bearer " + props.token
            }
        });
        const notis = await data.json(); //Converting data to jason
        console.log(props.token)
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
                <Dropdown.Item id={notification._id}>
                {notification.message}
                <div className="notiTime" align="right">{new Date(notification.createdAt).toLocaleString()}</div>
                </Dropdown.Item>
            ))
            setList(notificationList)
        }

    },[notifications])

    // {usertype, setToken}
    // const handleLogout = (logout) => {
    //     console.log("In handle logout");
    //     // logout(undefined);
    // }
    // function handleLink(){

    // }
    // console.log(props.setToken);
    

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
                                    <Dropdown.Item onClick={()=>{props.setToken(undefined);sessionStorage.clear();props.socket.disconnect()}} >Logout</Dropdown.Item>
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
        // if (skipTriggerFetch == false){
        //     triggerFetch();
        //     console.log(skipTriggerFetch);
        // }
        return (
            <>
                <div className='header stickyBar'>
                    <div className='container-fluid text-center'>
                        <div className='row'>
                            <div className='col-1' style={{padding: "3px"}} >
                               <Dropdown autoClose="outside" align={"end"}>
                                <DropdownToggle id="noti" className="bg-transparent btn-transparent" >
                                    <Badge badgeContent={!notificationList ? 0 : notificationList.length} color="secondary">
                                        <MaterialIcon icon="notifications" color='#FFFFFF' />
                                    </Badge>
                                    </DropdownToggle>                                   
                                        <Dropdown.Menu id="NotiContainer">
                                        <Dropdown.Item><div className='noti-Title'>Notifications</div></Dropdown.Item>
                                        {notificationList}
                                    </Dropdown.Menu>

                                </Dropdown>
                                
                            </div>
                            <div className='col-1'></div>
                            <div className='col-8'>
                                <Link to="/" className="header-title " style={{textAlign: "center"}}>
                                    <MaterialIcon icon="takeout_dining" color='#FFFFFF' />
                                    <span ><b>TAKE IT EASY</b></span>
                                    <MaterialIcon icon="takeout_dining" color='#FFFFFF' />
                                </Link>
                            </div>
                            
                            <div className='col-1 points'>
                                {/* Points */}
                                <MaterialIcon icon="savings" color='#FFFFFF'/>
                                {/* <Points/> */}
                                {customerInfo.points? customerInfo.points: -1}
                            </div>
                            <div className='col-1 headerpadding bg-transparent btn-transparent'>
                                <Dropdown className="d-inline bg-transparent btn-transparent" autoClose="outside" >
                                    <Dropdown.Toggle id="dropdown-autoclose-outside"  className="bg-transparent btn-transparent"  size="sm">
                                        <MaterialIcon icon="account_circle" color='#FFFFFF' />
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                    {/* <Link to="/customer/profile">
                                        Profile */}
                                    <Dropdown.Item onClick={() => navigate('/', { replace: true })}>Restaurant</Dropdown.Item>
                                    <Dropdown.Item onClick={() => navigate('/customer/profile', { replace: true })}>Profile</Dropdown.Item>
                                    {/* </Link> */}
                                    <Dropdown.Item onClick={() => navigate('/customer/history', { replace: true })}>Order History</Dropdown.Item>
                                        <Dropdown.Divider />
                                    <Dropdown.Item onClick={()=> {navigate('/'); props.setToken(undefined); sessionStorage.clear(); props.socket.disconnect()}} >Logout</Dropdown.Item>
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