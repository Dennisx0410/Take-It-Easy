import './customer.css';
import React from 'react';
import { useState, useEffect  } from 'react';
import { BrowserRouter, Route, Routes} from 'react-router-dom';
import {Link} from 'react-router-dom';
import {useMatch, useParams, useLocation} from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import Box from '@mui/material/Box';
import {Buffer} from 'buffer';

function ChangePassword(){
    return(
        <>
        </>
    );
}

function AccountInfo(){
    const [customerInfo, setCustomerInfo] = useState({});
    
    const PREFIX='http://localhost:5000';
    
    useEffect(() => {
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

        // const url_p = PREFIX+'/customer/profilePic';
        // const fetchCustomerProfilepic = async () => {
        //     try {
        //       const response = await fetch(
        //           url_p, {
        //           method: 'GET',
        //           headers: {
        //               'Authorization': 'Bearer '+sessionStorage.token
        //           }}
        //       );
        //       const json = await response.json();
        //       setRestaurants(JSON.stringify(json[rid]));
        //       console.log(json);
        //     } catch (error) {
        //       console.log("error", error);
        //     }
        // };
        // fetchCustomerProfilepic();
        fetchData();
    }, []);

    //load profile pic
        const [ImgUrl, setImgUrl] = useState();
        // let profilePic = customerInfo.profilePic;
        // // console.log(profilePic);
        // let img = Buffer.from(profilePic.data).toString('base64');
        // this.loadImage(img);
        // setImgUrl(img);

    return(
        <>
            <div className="ProfileHeader">
                <h2 style={{ padding: "1vh 3vw 0 3vw", color: "" }}>Welcome!</h2>
            </div>
            <div className='row'>
                <div className='col-1'></div>
                <div className='col-10'>
                    <h3>Glad to meet you, {customerInfo.username}!</h3>
                    <h4>Your Information:</h4>
                    {/* profilePic */}
                    {/* <image src={`data:image/jpg; base64, ${ImgUrl}`}></image> */}
                    Phone Number: <span style={{color: "black"}}>{customerInfo.phoneNum}</span><br/>
                    E-mail: <span style={{color: "black"}}>{customerInfo.email}</span><br/>
                    Points: <span style={{color: "black"}}>{customerInfo.points? customerInfo.points:0}</span><br/>
                    <ChangePassword/>
                </div>
                <div className='col-1'></div>
            </div>
            
        </>
        
    );

}

function Order(props){
    console.log("In order");
    console.log(props);
    return(
        <>
            {/* {props.i} */}
            {/* {props.order} */}
            
        </>
        
    );
}

// /order/fetchByCustomer
function OrderHistory(){
    const [orderHistory, setOrderHistory] = useState([]);
    
    const PREFIX='http://localhost:5000';
    useEffect(() => {
        const url_d = PREFIX+'/order/fetchByCustomer';
        const fetchOrder= async () => {
          try {
            const response = await fetch(
                url_d, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer '+sessionStorage.getItem("token")
                }}
            );
            const order_history = await response.json();
            setOrderHistory(order_history);
            console.log(order_history);

          } catch (error) {
            console.log("error", error);
          }
        };
        fetchOrder();
    }, []);

    if (orderHistory == []){
        console.log("Hi");
        return(
            <>
                <div className="ProfileHeader">
                    <h2>Your Order History:</h2>
                </div>
                <div>
                    Loading...
                </div>
            </>
            
        );
    }
    else{
        return(
            <>
                <div className="ProfileHeader">
                    <h2>Your Order History:</h2>
                </div>
                <div>
                    {orderHistory.map( (order,i) => <Order order={order} i={i} key={i} /> )}
                </div>
            </>
            
        );
    }
    
}

class Customer extends React.Component{
    constructor(props) {
        super(props);
    }
    render() {
        
        if (this.props.action == "profile"){
            return(
                <>  <div className='userContent'>
                        <AccountInfo/>
                    </div>
                </>
                
            );
        }
        else if (this.props.action ==  "history"){
            return(
                <>
                    <div className='userContent'>
                        <OrderHistory/>
                    </div>
                    
                </>
            );
        }
        else{
            return(
                <>
                    <AccountInfo/>
                </>
                
            );
        }
    }
}
export default Customer;