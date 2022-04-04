import './customer.css';
import React from 'react';
import { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes} from 'react-router-dom';
import {Link} from 'react-router-dom';
import {useMatch, useParams, useLocation} from 'react-router-dom';
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";


import {Buffer} from 'buffer';
import { Avatar, Stack } from '@mui/material';

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
        const [skip , setSkip] = useState(false);
        if (customerInfo.profilePic != undefined){
            if (!skip){
                let profilePic = customerInfo.profilePic;
                console.log(profilePic);
                let img = Buffer.from(profilePic.data).toString('base64');
                setSkip(true);
                setImgUrl(img);
                
            }
                
        }

    return(
        <>
            <div className="ProfileHeader">
                <h2 style={{ padding: "1vh 3vw 0 3vw", color: "#ba1851" }}>Welcome!</h2>
            </div>
            <div className='row'>
                <div className='col-1'></div>
                <div className='col-10'>
                    <h3>Glad to meet you, {customerInfo.username}!</h3>
                    <h4>Your Information:</h4>
                    {/* profilePic */}
                    <Avatar alt="picture" src={`data:image/jpeg; base64, ${ImgUrl}`} sx={{ width: 85, height: 85 }} />
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

const useStyles = makeStyles({
    root: {
      maxWidth: 345
    }
  });

function Order(props){
    console.log("In order");
    console.log(props);
    const classes = useStyles();
    
    return(
        <>
            <Card className={classes.root}>
                <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                    CardActions Example
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                    CardActions are just a flexbox component that wraps the children in
                    8px of padding and 8px horizontal padding between children.
                    </Typography>
                </CardContent>
                <CardActions disableSpacing>
                    <Button size="small" color="primary">
                    Primary
                    </Button>
                    <Button size="small" color="secondary">
                    Secondary
                    </Button>
                </CardActions>
            </Card>
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
                    <h2 style={{ padding: "1vh 3vw 0 3vw", color: "#ba1851" }} >Your Order History:</h2>
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
                    <h2 style={{ padding: "1vh 3vw 0 3vw", color: "#ba1851" }}>Your Order History: </h2>
                </div>
                <div className='row'>
                    <div className='col-1'>Hi</div>
                    <div className='col-10'>
                        {orderHistory.map( (order,i) => <Order order={order} i={i} key={i} /> )}
                    </div>
                    <div className='col-1'>I love you</div>
                    
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