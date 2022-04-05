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
import MaterialIcon, {colorPalette} from 'material-icons-react';

import {Buffer} from 'buffer';
import { Avatar, Stack } from '@mui/material';

function ChangePassword(){
    const PREFIX='http://localhost:5000';
    var oldPassowrd = null, newPassword = null;
    const [CPstatus, setCPstatus] = useState("");
    const [mask, setMask] = useState(true);
    function handleSubmit(e) {
        e.preventDefault();
        let loginForm = e.target;
        let formData = new FormData(loginForm);
        let oldpwd = formData.get('oldpwd');
        let newpwd = formData.get('newpwd');
        let REnewpwd = formData.get('REnewpwd');
        if (oldpwd == "" || newpwd == "" || REnewpwd == ""){
            console.log("Empty");
            setCPstatus("Please fill in all the fields.");
        }
        else if(newpwd != REnewpwd){
            console.log(newpwd);
            console.log(REnewpwd);
            setCPstatus("The new password you typed does not match the re-entered new password. Please try again.");
        }
        else{
            oldPassowrd = oldpwd;
            newPassword = newpwd;
            console.log(oldPassowrd);
            console.log(newPassword);
            // setCPstatus("Valid New password");
            const url_d = PREFIX+'/customer/changePw';
            const attempt = async () => {
                try {
                    const response = await fetch(
                        url_d, {
                            method: 'POST',
                            headers: {
                                'Authorization': 'Bearer '+ sessionStorage.getItem("token"),
                                'Content-type': 'application/json'
                            },
                            body: JSON.stringify({
                                'passwordOld' : oldPassowrd,
                                'passwordNew' : newPassword
                            })
                        }
                        
                    );
                    const attempt_result = await response.json();
                    setCPstatus(JSON.stringify(attempt_result));
                    console.log(attempt_result);

                } catch (error) {
                    console.log("error", error);
                }
            };
            attempt();
        }
        
    }

    return(
        <>
            <hr/>
            <h3>Change password:</h3>
            
            <form onSubmit={(e)=>{handleSubmit(e)}}>
                <label>
                    <h5>Old password: </h5>
                    
                    <input name="oldpwd" type="password" required/>
                    
                </label>
                <br/>
                <label>
                    <h5>New password: 
                        <span style={{fontSize:"15px"}}>
                            <button type="button" onClick={() => setMask(!mask)} 
                                style={{ backgroundColor: '#faf0e5', border: "none", textAlign: "center", color: "#333333"}} >
                                {/* <MaterialIcon icon={mask ? "visibility_off" : "visibility"} color='#8a055e'/> */}
                                {mask ? "Show new password" : "Hide new password"}
                            </button>
                        </span>
                    </h5>
                    <input name="newpwd" type={mask ? "password" : "text"}  required/>
                </label>
                <br/>
                <label>
                    <h5>Please re-enter your new password: </h5>
                   
                    <input name="REnewpwd" type={mask ? "password" : "text"} required/>
                </label>
                <br/>
                <input type="submit" value="Submit" style={{color: "#8a055e" }}/>
            </form>
            <span style={{color: "red"}}>{CPstatus}</span>
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
                    User ID: <span style={{color: "black"}}>{customerInfo.userID}</span><br/>
                    Username: <span style={{color: "black"}}>{customerInfo.username}</span><br/>
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
      width: "100%",
      margin: "15px 0"
    }
  });

function Order(props){
    console.log("In order");
    console.log(props);
    const classes = useStyles();
    var createDate = props.order.createdAt;
    var updateDate = props.order.createdAt;
    var restaurantName = props.order.restaurantID;
    var orderNo = props.order.orderNo;
    return(
        <>
            <Card className={classes.root} >
                <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                        <span style={{color: "#8a055e"}}>Order #{orderNo}</span>
                    </Typography>
                    <Typography gutterBottom variant="h6" component="h3">
                        <span style={{color: "#aaaaaa"}}>Restaurant ID: {restaurantName}</span>
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        Order created at: {createDate} <br/>
                        Order finished at: {createDate == updateDate? "Not finished" : updateDate}<br/>
                        Status: {props.order.status? "TAKE": "TOOK"}<br/>
                    </Typography>
                </CardContent>
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
                    
                </div>
                <div className='row'>
                    <div className='col-1'></div>
                    <div className='col-10'>
                        <h2 style={{ padding: "1vh 0 0 0", color: "#ba1851" }}>Your Order History: </h2>
                        {orderHistory.map( (order,i) => <Order order={order} i={i} key={i} /> )}
                    </div>
                    <div className='col-1'></div>
                    
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