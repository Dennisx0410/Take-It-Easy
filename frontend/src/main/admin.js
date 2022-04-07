import './admin.css';
import React from 'react';
import { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes} from 'react-router-dom';
import {Link} from 'react-router-dom';
import {useMatch, useParams, useLocation} from 'react-router-dom';
import { Badge } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from '@mui/material/CardMedia';
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import Box from '@mui/material/Box';
import {Buffer} from 'buffer';

const NOIMG = "";

function ResetCustomerPassword(props){    
    const PREFIX='http://localhost:5000';
    var targetUsername = null, newPassword = null;
    const [CPstatus, setCPstatus] = useState("");
    const [mask, setMask] = useState(true);
    function handleSubmit(e) {
        e.preventDefault();
        let loginForm = e.target;
        let formData = new FormData(loginForm);
        let username = formData.get('username');
        let newpwd = formData.get('newpwd');
        let REnewpwd = formData.get('REnewpwd');
        if (username == "" || newpwd == "" || REnewpwd == ""){
            console.log("Empty");
            setCPstatus("Please fill in all the fields.");
        }
        else if(newpwd != REnewpwd){
            console.log(newpwd);
            console.log(REnewpwd);
            setCPstatus({"message":"The new password you typed does not match the re-entered new password. Please try again."});
        }
        else{
            targetUsername = username;
            newPassword = newpwd;
            console.log(targetUsername);
            console.log(newPassword);
            // setCPstatus("Valid New password");
            const url_d = PREFIX+'/admin/customer/resetPw';
            const attempt = async () => {
                try {
                    const response = await fetch(
                        url_d, {
                            method: 'POST',
                            headers: {
                                'Authorization': 'Bearer '+ props.token,
                                'Content-type' : 'application/json'
                            },
                            body: JSON.stringify({
                                'username' : targetUsername,
                                'passwordNew' : newPassword
                            })
                        }
                        
                    );
                    const attempt_result = await response.json();
                    setCPstatus(attempt_result);
                    console.log(attempt_result);

                } catch (error) {
                    console.log("error", error);
                }
            };
            attempt();
        }
        loginForm.reset();
        
    }

    return(
        <>
            <hr/>
            <h3>Reset password:</h3>
            
            <form onSubmit={(e)=>{handleSubmit(e)}}>
                <label>
                    <h5>Target customer account username: </h5>
                    
                    <input name="username" type="text" required/>
                    
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
            <span style={{color: "red"}}>{CPstatus.message}</span>
        </>
    );
    
}

function ResetRestaurantPassword(props){    
    const PREFIX='http://localhost:5000';
    var targetUsername = null, newPassword = null;
    const [CPstatus, setCPstatus] = useState("");
    const [mask, setMask] = useState(true);
    function handleSubmit(e) {
        e.preventDefault();
        let loginForm = e.target;
        let formData = new FormData(loginForm);
        let username = formData.get('username');
        let newpwd = formData.get('newpwd');
        let REnewpwd = formData.get('REnewpwd');
        if (username == "" || newpwd == "" || REnewpwd == ""){
            console.log("Empty");
            setCPstatus({name: "EmptyPw", message:"Please fill in all the fields."});
        }
        else if(newpwd != REnewpwd){
            console.log(newpwd);
            console.log(REnewpwd);
            setCPstatus({name: "NewPwMismatched", message:"The new password you typed does not match the re-entered new password. Please try again."});
        }
        else{
            targetUsername = username;
            newPassword = newpwd;
            console.log(targetUsername);
            console.log(newPassword);
            // setCPstatus("Valid New password");
            const url_d = PREFIX+'/admin/restaurant/resetPw';
            const attempt = async () => {
                try {
                    const response = await fetch(
                        url_d, {
                            method: 'POST',
                            headers: {
                                'Authorization': 'Bearer '+ props.token,
                                'Content-type' : 'application/json'
                            },
                            body: JSON.stringify({
                                'username' : targetUsername,
                                'passwordNew' : newPassword
                            })
                        }
                        
                    );
                    const attempt_result = await response.json();
                    setCPstatus(attempt_result);
                    console.log(attempt_result);

                } catch (error) {
                    console.log("error", error);
                }
            };
            attempt();
        }
        loginForm.reset();
        
    }

    return(
        <>
            <hr/>
            <h3>Reset password:</h3>
            
            <form onSubmit={(e)=>{handleSubmit(e)}}>
                <label>
                <h5>Target restaurant account username: </h5>
                    
                    <input name="username" type="text" required/>
                    
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
            <span style={{color: "red"}}>{CPstatus.message}</span>
        </>
    );
    
}

//

function Order(props) {
    console.log(props);
    var createDate = props.order.createdAt;
    var updateDate = props.order.updatedAt;
    // var restaurantName = props.order.restaurant_Info[0].restaurantName;
    var restaurantID = props.order.restaurantID._id;
    var customerID = props.order.customerID._id;
    var orderNo = props.order.orderNo;
    return(
        <div style={{ marginTop: "10px" }}>
            <Card>
                <CardContent>
                    <Typography gutterBottom variant="h4" component="h4">
                        <span style={{color: "#8a055e"}}>Order #{orderNo}</span>
                    </Typography>
                    <Typography gutterBottom variant="h5" component="h5">
                        {/* <span style={{color: "#aaaaaa"}}>Restaurant Name: {restaurantName}</span> */}
                        <span style={{color: "#aaaaaa"}}>Customer ID: {customerID}</span>
                        <br/>
                        <span style={{color: "#aaaaaa"}}>Restaurant ID: {restaurantID}</span>
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        Order created at: {createDate} <br/>
                        Order finished at: {props.order.status? updateDate : "Not finished" }<br/>
                        Status: 
                        <span style={props.order.status? {color: "green"} : {color: "red"}}>
                            {props.order.status? "Completed":"Not completed" }<br/>
                        </span>
                    </Typography>
                </CardContent>
            </Card>
            {/* {props.i} */}
            {/* {props.order} */}
            
        </div>
        
    );
}

function OrderHistory(props) {
    const [orderHistory, setOrderHistory] = useState([]);
    const [reload, setReload] = useState(true);
    // window.location.reload();
    const PREFIX='http://localhost:5000';
    useEffect(() => {
        const url_d = PREFIX+'/admin/order/all';
        const fetchOrder= async () => {
          try {
            const response = await fetch(
                url_d, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer '+ props.token
                }}
            );
            const order_history = await response.json();
            setOrderHistory(order_history);
            console.log(order_history);

          } catch (error) {
            console.log("error", error);
          }
        };
        if (reload){
            fetchOrder();
        }
    }, []);

    return (
        <>
            <div className='row'>
                
                <div className='col-10'>
                    <h2 className="content-header" style={{fontSize: "40px"}}>List of orders: </h2>
                    <hr/>
                    {orderHistory.map( (order,i) => <Order order={order} i={i} key={i} /> )}
                </div>
                <div className='col-2'></div>
            </div>
        </>
    );
}
//

const useStyles = makeStyles({
    root: {
      width: "100%",
      margin: "15px 0"
    }
});

function CustomerCard(props){
    console.log(props);
    const [ImgUrl,setImgUrl] = useState();
    const [skip,setSkip] = useState(false);
    const classes = useStyles();
    let customer = props.customer;
    // console.log(customer);
        // let index = props.i;
    let profilePic = null;
        if (!skip){
            if (customer.profilePic != undefined){
                profilePic = customer.profilePic;
                console.log(profilePic);
                let img = Buffer.from(profilePic.data).toString('base64');
                setSkip(true);
                setImgUrl(img);
            }
            else{
                let img = Buffer.from(NOIMG);
                setSkip(true);
                setImgUrl(img);
            }
        }
            
        // skip = true;
                        
    return(
        <div  style={{padding: "5px 0"}}>
            <Card sx={{ display: 'flex' }}>
                <CardContent sx={{ flex: '1 0 auto' }}>
                    <Typography variant="h5"  component="div">
                        <span style={customer.online? {color: "green"}: {color: "red"}}>◉</span>
                        Username:&nbsp;{customer.username}&nbsp;(Customer ID: {customer._id})
                    </Typography>
                    <span style={customer.activated? {color: "green"}: {color: "red"}}>
                            {customer.activated? "Activated" : "Not activated"}
                    </span>
                    <br/>
                    <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
                            {customer.online? 
                                <Badge sx={{"& .MuiBadge-badge": {backgroundColor: "green"}}} badgeContent=" ">
                                    <CardMedia
                                        display="flex"
                                        component="img"
                                        sx={{ width: 151 }}
                                        image={`data:image/jpg; base64, ${ImgUrl}`}
                                        alt="Live from space album cover"
                                    />
                                </Badge> 
                                :
                                <Badge sx={{"& .MuiBadge-badge": {backgroundColor: "red"}}} badgeContent=" ">
                                    <CardMedia
                                        display="flex"
                                        component="img"
                                        sx={{ width: 151 }}
                                        image={`data:image/jpg; base64, ${ImgUrl}`}
                                        alt="Live from space album cover"
                                    />
                                </Badge>
                            }
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
                            <Typography component="div" variant="subtitle2">
                                E-mail: {customer.email}<br/>
                                Phone Number: {customer.phoneNum}<br/>
                                Points: {customer.points}<br/>
                                Created at: {customer.createdAt}<br/>
                                Last login: {customer.lastLogin}<br/>
                                Updated at: {customer.updatedAt}<br/>
                            </Typography>
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        </div>
    );
}



function CustomerList(props){
    const PREFIX='http://localhost:5000';
    const [reload, setReload] = useState(true);
    const [CustomerList, setCustomerList] = useState([]);
    useEffect(() => {
            const url = PREFIX+'/admin/customer/all';
            console.log("CA");
            async function fetchData () {
                try {
                    const response = await fetch(
                        url, {
                        method: 'GET',
                        headers: {
                            'Authorization': 'Bearer '+ props.token
                        }}
                    );
                    const customerDetails = await response.json();
                    setCustomerList(customerDetails);
                    setReload(false);
                    
                } catch (error) {
                    console.log("error", error);
                }
            };
            if (reload){
                fetchData();
            }
            console.log("CB");
    },[]);
    return(
        <>
            <h2 style={{ padding: "0 0 0 0", color: "#ba1851" }}>List of Customers:</h2>
            
            {/* <div className='row'>
                <div className='col-1'></div> */}
                {/* <div className='col-10'>
                </div> */}
                <div>
                    {CustomerList.map( (customer,i) => <CustomerCard customer={customer} i={i} key={i} /> )}
                </div>
                {/* <div className='col-1'></div>
                
            </div> */}

        </>
    );

}
//
//Restaurant
function RestaurantCard(props){
    const PREFIX='http://localhost:5000';
    const [update,setUpdate] = useState(true);
    function handleClick(action,username){
        setUpdate(false);
        if (action == "Approve"){
            const url = PREFIX+'/admin/restaurant/approve';
            console.log("CA");
            async function approve() {
                try {
                    const response = await fetch(
                        url, {
                            method: 'POST',
                            headers: {
                                'Authorization': 'Bearer '+ props.token,
                                'Content-type' : 'application/json'
                            },
                            body: JSON.stringify({
                                'username': username
                            })
                        }
                    );
                    const approve_result = await response.json();
                    console.log(approve_result);
                    props.setReload(true);
                } catch (error) {
                    console.log("error", error);
                }
            };
            approve();
            console.log("CB");
        }
        else if (action == "Reject"){
            const url = PREFIX+'/admin/restaurant/reject';
            console.log("CA");
            async function reject() {
                try {
                    const response = await fetch(
                        url, {
                            method: 'POST',
                            headers: {
                                'Authorization': 'Bearer '+props.token,
                                'Content-type' : 'application/json'
                            },
                            body: JSON.stringify({
                                'username': username,
                                'reason': "violating our regulation(s)." 
                            })
                        }
                    );
                    const approve_result = await response.json();
                    console.log(approve_result);
                    props.setReload(true);
                } catch (error) {
                    console.log("error", error);
                }
            };
            reject();
            console.log("CB");
        }
        window.location.reload();
        console.log("setting reload");
        setUpdate(true);
        
    }
    console.log(props);
    const [ImgUrl,setImgUrl] = useState();
    const [skip,setSkip] = useState(false);
    const classes = useStyles();
    let restaurant = props.restaurant;
    // console.log(customer);
        // let index = props.i;
        if (!skip){
            let profilePic = restaurant.profilePic;
            let img = Buffer.from(profilePic.data).toString('base64');
            //let img = Buffer.from(profilePic);
            setSkip(true);
            setImgUrl(img);
        }
            
        // skip = true;
                        
    return(
        <div style={{padding: "5px 0"}}>
            <Card sx={{ display: 'flex' }}>
                <CardContent sx={{ flex: '1 0 auto' }}>
                    <Typography variant="h5" color="text.secondary" component="div">
                        <span style={restaurant.online? {color: "green"}: {color: "red"}}>◉</span>
                        {restaurant.restaurantName}&nbsp;(Restaurant ID: {restaurant._id})
                    </Typography>
                    <Typography variant="h6" component="h6">
                        <span style={restaurant.approved? {color: "green", paddingLeft:"1%"}: {color: "red", paddingLeft:"1%"}}>
                            {restaurant.approved? "Approved" : "Not approved"}
                        </span>
                        <br/>
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
                            {restaurant.online? 
                                <Badge sx={{"& .MuiBadge-badge": {backgroundColor: "green"}}} badgeContent=" ">
                                    <CardMedia
                                        display="flex"
                                        component="img"
                                        sx={{ width: 151 }}
                                        image={`data:image/jpg; base64, ${ImgUrl}`}
                                        alt="Restaurant Profile Picture"
                                    />
                                </Badge> 
                                :
                                <Badge sx={{"& .MuiBadge-badge": {backgroundColor: "red"}}} badgeContent=" ">
                                    <CardMedia
                                        display="flex"
                                        component="img"
                                        sx={{ width: 151 }}
                                        image={`data:image/jpg; base64, ${ImgUrl}`}
                                        alt="Restaurant Profile Picture"
                                    />
                                </Badge>
                            }
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', pl: 1}}>
                            <Typography component="div" variant="body1">
                                Address: {restaurant.address}<br/>
                                Username: {restaurant.username}<br/>
                                E-mail: {restaurant.email}<br/>
                                Phone Number: {restaurant.phoneNum}<br/>
                                License Number: {restaurant.licenseNum}
                            </Typography>
                        </Box>
                    </Box>
                    {/* menu probably? */}
                    {/* <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
                            <CardMedia
                                display="flex"
                                component="img"
                                sx={{ width: 151 }}
                                image={`data:image/jpg; base64, ${ImgUrl}`}
                                alt="Live from space album cover"
                            />
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
                            <Typography component="div" variant="subtitle2">
                            </Typography>
                        </Box>
                    </Box> */}
                    {restaurant.approved? 
                        ""
                        :
                        <CardActions>
                                
                                <Button size="small" color="primary" onClick={() =>{handleClick("Approve",restaurant.username)}}>
                                    Approve
                                </Button>
                                <Button size="small" color="secondary" onClick={() =>{handleClick("Reject",restaurant.username)}}>
                                    Reject
                                </Button> 
                        </CardActions>
                    }
                </CardContent >
            </Card>
        </div>
    );
}
function RestaurantList(props){
    const PREFIX='http://localhost:5000';
    const [reload, setReload] = useState(true);
    const [RestaurantList, setRestaurantList] = useState([]);
    useEffect(() => {
            const url = PREFIX+'/admin/restaurant/all';
            console.log("CA");
            async function fetchData () {
                try {
                    const response = await fetch(
                        url, {
                        method: 'GET',
                        headers: {
                            'Authorization': 'Bearer '+ props.token
                        }}
                    );
                    const restaurantDetails = await response.json();
                    setRestaurantList(restaurantDetails);
                    setReload(false);
                    
                } catch (error) {
                    console.log("error", error);
                }
            };
            if (reload){
                fetchData();
            }
            console.log("CB");
    },[]);
    return(
        <>
            <h2>List of Restaurants:</h2>
            <div>
                {RestaurantList.map( (restaurant,i) => <RestaurantCard restaurant={restaurant} i={i} key={i} setReload={setReload}  /> )}
            </div>
        </>
    );
}

class Admin extends React.Component{
    constructor(props) {
        super(props);
        this.state = { 
        };
    }
    render() {
        
        if (this.props.page == "orders"){
            return(
                <div className='page-styling'>
                    <div className='row'>
                        <div className='col-1'>
                        
                        </div>
                        <div className='col-10' style={{margin: "1vh"}}>
                            <OrderHistory token={this.props.token}/>
                            <hr/>
                        </div>
                        <div className='col-1'>
                        
                        </div>
                    </div>
                    
                </div>
                
            );
        }
        else if (this.props.page ==  "ULCustomer"){
            return(
                <div className='page-styling'>  
                    <div className='row'>
                        <div className='col-1'>
                        
                        </div>
                        <div className='col-10'>
                            <ResetCustomerPassword token={this.props.token}/>
                            <hr/>
                            <CustomerList token={this.props.token}/>
                        </div>
                        <div className='col-1'>
                        
                        </div>
                    </div>
                    
                </div>
                
            );
        }
        else if (this.props.page ==  "ULRestaurant"){
            return(
                <div className='page-styling'>
                    <div className='row'>
                        <div className='col-1'>
                        
                        </div>
                        <div className='col-10'>
                            <ResetRestaurantPassword token={this.props.token}/>
                            <hr/> 
                            <RestaurantList token={this.props.token}/>
                        </div>
                        <div className='col-1'>
                        
                        </div>
                    </div>
                    
                </div>
                
            );
        }
    }
}
export default Admin;