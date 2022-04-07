import './admin.css';
import React from 'react';
import { useState, useEffect } from 'react';
import { Alert, Avatar, Badge, Grid, Stack } from '@mui/material';
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Box from '@mui/material/Box';
import {Buffer} from 'buffer';

const NOIMG = "";

function ResetPassword(props){    
    const PREFIX='http://localhost:5000';
    var targetUsername = null, newPassword = null;
    const [CPstatus, setCPstatus] = useState({});
    const [mask, setMask] = useState(true);
    function handleSubmit(e) {
        e.preventDefault();
        console.log(props);
        let loginForm = e.target;
        let formData = new FormData(loginForm);
        let username = formData.get('username');
        let newpwd = formData.get('newpwd');
        let REnewpwd = formData.get('REnewpwd');
        if (username == "" || newpwd == "" || REnewpwd == ""){
            setCPstatus({name: "EmptyPw", message: "Please fill in all the fields."});
        }
        else if(newpwd != REnewpwd){
            setCPstatus({name: "NewPwMismatched", message:"The new password you typed does not match the re-entered new password. Please try again."});
        }
        else{
            targetUsername = username;
            newPassword = newpwd;
            console.log(targetUsername);
            console.log(newPassword);
            const url_d = PREFIX+`/admin/${props.usertype}/resetPw`;
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
            <h2><i className="material-icons">password</i>Change password:</h2>

            <form onSubmit={(e)=>{handleSubmit(e)}}>
                <label htmlFor="password" className="form-label">
                    <h6>Target {props.usertype} account username: </h6>
                </label>
                <div className="input-group mb-2" style={{width: "250px"}}>
                    <input type="text" className="form-control" name="username" required/>
                </div>
                <label htmlFor="password" className="form-label">
                    <h6>New password:</h6>
                </label>
                <div className="input-group mb-2" style={{width: "250px"}}>
                    <input type={mask ? "text" : "password"} className="form-control" name="newpwd" required/>
                    <button type="button" className="material-icons input-group-text" onClick={() => setMask(!mask)}>{mask ? "visibility_off" : "visibility"}</button>
                </div>
                <label htmlFor="password" className="form-label">
                    <h6>Please re-enter your new password</h6>
                </label>
                <div className="input-group mb-2" style={{width: "250px"}}>
                    <input type={mask ? "text" : "password"} className="form-control" name="REnewpwd" required/>
                    <button type="button" className="material-icons input-group-text" onClick={() => setMask(!mask)}>{mask ? "visibility_off" : "visibility"}</button>
                </div>
                <button type="submit" className="btn">Submit</button>
            </form>
            { !CPstatus.name ? <></> : 
             CPstatus.name === "SuccessfullyChangedPassword" ? 
                <Alert severity="success">
                    {CPstatus.message}
                </Alert> : 
                <Alert severity="error">
                    {CPstatus.message}
                </Alert> }
        </>
    );
    
}

// function ResetCustomerPassword(props) {
//     return ResetPassword('customer');
// }

// function ResetRestaurantPassword(props) {
//     return ResetPassword('restaurant');
// }

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
    function handleReload(){
        window.location.reload();
    }
    return (
        <>
            <div className='row'>
                <div className='col-10'>
                    <h2>List of orders: <span style={{cursor:"pointer"}} onClick={()=>handleReload()}><i className="material-icons">sync</i></span></h2> 
                    <hr/>
                    {orderHistory.map( (order,i) => <Order order={order} i={i} key={i} /> )}
                </div>
                <div className='col-2'></div>
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
                    <Box sx={{ display: 'flex', flexDirection: 'row', px: 1, m: 1}}>
                        <Grid container spacing={2}>
                            <Grid item xs={10}>
                                <Typography variant="h5" component="div">
                                    <b>{customer.username}</b>
                                </Typography>
                            </Grid>
                            <Grid item xs={2}>
                                <b style={customer.activated ? {color: "green"}: {color: "red"}}>
                                        {customer.activated ? "Activated" : "Not activated"}
                                </b>
                            </Grid>
                            <Grid item xs={12}>
                                <h6 style={{color: "grey"}}>ID: {customer._id}</h6>
                            </Grid>
                        </Grid>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'row', px: 1, m: 1}}>
                        <Box sx={{ display: 'flex', alignItems: 'center', px: 1, m: 1}}>
                            <Stack
                                direction="row"
                                justifyContent="center"
                                alignItems="center"
                                spacing={2}
                                height="100%"
                            >
                                <div style={{position: "relative"}}>
                                    <Avatar alt="picture" src={`data:image/jpeg; base64, ${ImgUrl}`} sx={{ width: 150, height: "auto", maxWidth: "100%" }}/>
                                    <div class='online-status' style={{backgroundColor: customer.online ? "green" : "red"}}></div>
                                </div>
                            </Stack>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', px: 1, m: 1}}>
                            <Typography component="div" variant="body1">
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
    return (
        <> 
            <h2><i className="material-icons">list</i>List of customers:</h2>
            <div>
                {CustomerList.map( (customer,i) => <CustomerCard customer={customer} i={i} key={i} /> )}
            </div>
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
            console.log(username);

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
    
    let restaurant = props.restaurant;
    // console.log(customer);
        // let index = props.i;
        if (!skip){
            let profilePic = restaurant.profilePic;
            let img = Buffer.from(profilePic.data).toString('base64');
            
            setSkip(true);
            setImgUrl(img);
        }
            
        // skip = true;
                        
    return(
        <div style={{padding: "5px 0"}}>
            <Card sx={{ display: 'flex' }}>
                <CardContent sx={{ flex: '1 0 auto' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'row', px: 1, m: 1}}>
                        <Grid container spacing={2}>
                            <Grid item xs={10}>
                                <Typography variant="h5" component="div">
                                    <b>{restaurant.username}</b>
                                </Typography>
                            </Grid>
                            <Grid item xs={2}>
                                <b style={restaurant.approved ? {color: "green"}: {color: "red"}}>
                                        {restaurant.approved ? "Approved" : "Not approved"}
                                </b>
                            </Grid>
                            <Grid item xs={12}>
                                <h6 style={{color: "grey"}}>ID: {restaurant._id}</h6>
                            </Grid>
                        </Grid>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'row', px: 1, m: 1}}>
                        <Box sx={{ display: 'flex', alignItems: 'center', px: 1, m: 1}}>
                            <Stack
                                direction="row"
                                justifyContent="center"
                                alignItems="center"
                                spacing={2}
                                height="100%"
                            >
                                <div style={{position: "relative"}}>
                                    <Avatar alt="picture" src={`data:image/jpeg; base64, ${ImgUrl}`} sx={{ width: 150, height: "auto", maxWidth: "100%" }}/>
                                    <div class='online-status' style={{backgroundColor: restaurant.online ? "green" : "red"}}></div>
                                </div>
                            </Stack>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', px: 1, m: 1}}>
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
            <h2><i className="material-icons">list</i>List of restaurants:</h2>
            <div>
                {RestaurantList.map( (restaurant,i) => <RestaurantCard restaurant={restaurant} i={i} key={i} setReload={setReload} token={props.token} /> )}
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
                        <div className='col-1'></div>
                        <div className='col-10' style={{margin: "1vh"}}>
                            <OrderHistory token={this.props.token}/>
                        </div>
                        <div className='col-1'></div>
                    </div>
                </div>
            );
        }
        else if (this.props.page ==  "ULCustomer"){
            return (
                <div className='page-styling'>  
                    <div className='row'>
                        <div className='col-1'></div>
                        <div className='col-10'>
                            <ResetPassword token={this.props.token} usertype="customer"/>
                            <hr/>
                            <CustomerList token={this.props.token}/>
                        </div>
                        <div className='col-1'></div>
                    </div>
                </div>
            );
        }
        else if (this.props.page ==  "ULRestaurant"){
            return (
                <div className='page-styling'>
                    <div className='row'>
                        <div className='col-1'></div>
                        <div className='col-10'>
                            <ResetPassword token={this.props.token} usertype="restaurant"/>
                            <hr/> 
                            <RestaurantList token={this.props.token}/>
                        </div>
                        <div className='col-1'></div>
                    </div>
                </div>
            );
        }
    }
}
export default Admin;