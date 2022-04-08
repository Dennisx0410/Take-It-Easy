import React from 'react';

import { useState, useEffect } from 'react';
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { Buffer } from 'buffer';
import { Alert, Avatar, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';

const PREFIX='http://localhost:5000';

function ChangePassword(){
    // const PREFIX='http://localhost:5000';
    var oldPassowrd = null, newPassword = null;
    const [CPstatus, setCPstatus] = useState({});
    const [mask, setMask] = useState(false);
    function handleSubmit(e) {
        e.preventDefault();
        let loginForm = e.target;
        let formData = new FormData(loginForm);
        let oldpwd = formData.get('oldpwd');
        let newpwd = formData.get('newpwd');
        let REnewpwd = formData.get('REnewpwd');
        if (oldpwd == "" || newpwd == "" || REnewpwd == ""){
            console.log("Empty");
            setCPstatus({name: "EmptyPw", message: "Please fill in all the fields."});
        }
        else if (newpwd != REnewpwd) {
            console.log(newpwd);
            console.log(REnewpwd);
            setCPstatus({name: "NewPwMismatched", message:"The new password you typed does not match the re-entered new password. Please try again."});
        }
        else{
            oldPassowrd = oldpwd;
            newPassword = newpwd;
            console.log(oldPassowrd);
            console.log(newPassword);
            // setCPstatus("Valid New password");
            const URL = PREFIX + '/restaurant/changePw';
            const attempt = async () => {
                try {
                    const response = await fetch(
                        URL, {
                            method: 'POST',
                            headers: {
                                'Authorization': 'Bearer '+ sessionStorage.getItem("token"),
                                'Content-type' : 'application/json'
                            },
                            body: JSON.stringify({
                                'passwordOld' : oldPassowrd,
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
            {/* <h3>Change password:</h3> */}
            <h4><i className="material-icons">password</i>Change password:</h4>
            
            <form onSubmit={(e)=>{handleSubmit(e)}}>
                <label htmlFor="password" className="form-label">
                    <h6>Old password:</h6>
                </label>
                <div className="input-group mb-2" style={{width: "250px"}}>
                    <input type={mask ? "text" : "password"} className="form-control" name="oldpwd" required/>
                    <button type="button" className="material-icons input-group-text" onClick={() => setMask(!mask)}>{mask ? "visibility_off" : "visibility"}</button>
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
{/* pattern="^.{8,}$" title="length should be longer than 8 characters"  */}
                {/* <label>
                    <h5>Old password: </h5>
                    
                    <input name="oldpwd" type="password" required/>
                    
                </label>
                <br/>
                <label>
                    <h5>New password: 
                        <span style={{fontSize:"15px"}}>
                            <button type="button" onClick={() => setMask(!mask)} 
                                style={{ backgroundColor: '#faf0e5', border: "none", textAlign: "center", color: "#333333"}} > */}
                                {/* <MaterialIcon icon={mask ? "visibility_off" : "visibility"} color='#8a055e'/> */}
                                {/* {mask ? "Show new password" : "Hide new password"} */}
                            {/* </button>
                        </span>
                    </h5>
                    <input name="newpwd" type={mask ? "password" : "text"}  required/>
                </label>
                <br/>
                <label>
                    <h5>Please re-enter your new password: </h5>
                   
                    <input name="REnewpwd" type={mask ? "password" : "text"} required/>
                </label>
                <br/> */}
                <button type="submit" className="btn">Submit</button>
                {/* <input type="submit" value="Submit" style={{color: "#8a055e" }}/> */}
            </form>
            { !CPstatus.name ? <></> : 
             CPstatus.name === "SuccessfullyChangedPassword" ? 
                <Alert severity="success">
                    {CPstatus.message}
                </Alert> : 
                <Alert severity="error">
                    {CPstatus.message}
                </Alert> }
            {/* <span style={{color: "red"}}>{CPstatus.message}</span> */}
        </>
    );
}

function AccountInfo(){
    const [restaurantInfo, setRestaurantInfo] = useState({});
    
    // const PREFIX='http://localhost:5000';
    
    useEffect(() => {
        const URL = PREFIX + '/restaurant/data';
        const fetchData = async () => {
          try {
            const response = await fetch(
                URL, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem("token")
                }}
            );
            const restaurant_info = await response.json();
            setRestaurantInfo(restaurant_info);
            console.log(restaurant_info);

          } catch (err) {
            console.log("error", err);
          }
        };
        fetchData();
    }, []);

    //load profile pic
    const [ImgUrl, setImgUrl] = useState();
    const [skip , setSkip] = useState(false);
    if (restaurantInfo.profilePic != undefined) {
        if (!skip) {
            let profilePic = restaurantInfo.profilePic;
            let img = Buffer.from(profilePic.data).toString('base64');
            setSkip(true);
            setImgUrl(img);
        }
    }

    const rows = [
        {name: 'User ID', data: restaurantInfo._id},
        {name: 'Username', data: restaurantInfo.username},
        {name: 'Phone number', data: restaurantInfo.phoneNum},
        {name: 'Email', data: restaurantInfo.email},
        {name: 'Address', data: restaurantInfo.address},
        {name: 'License Number', data: restaurantInfo.licenseNum},
        {name: 'Address', data: restaurantInfo.address}
    ];

    return (
        <>
            <div className='row'>
                <div className='col-1'></div>
                <div className='col-10'>
                    <h2>Glad to meet you, {restaurantInfo.username}!</h2>
                    <h4><i className="material-icons">badge</i>Your information:</h4>
                    <div className='row'>
                        {/* profilePic */}
                        <div className='col-12 col-md-3 mb-3' style={{ alignContent: "center" }}>
                            <Stack
                                direction="row"
                                justifyContent="center"
                                alignItems="center"
                                spacing={2}
                                height="100%"
                            >
                                <Avatar alt="picture" src={`data:image/jpeg; base64, ${ImgUrl}`} sx={{ width: 200, height: "auto", maxWidth: "100%" }}/>
                            </Stack>
                        </div>
                        <div className='col-12 col-md-9 mb-3'>
                            <TableContainer sx={{width: 500, maxWidth: "100%"}} component={Paper}>
                                <Table aria-label="simple table">
                                    <TableBody>
                                    {rows.map((row) => (
                                        <TableRow
                                            key={row.name}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                        <TableCell component="th" scope="row">
                                            <h6>{row.name}</h6>
                                        </TableCell>
                                        <TableCell align="right">{row.data}</TableCell>
                                        </TableRow>
                                    ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    </div>
                    <hr/>
                    <ChangePassword/>
                </div>
                <div className='col-1'></div>
            </div>
            
        </>
        
    );

}

function ChangeMenu(){
    return(
        <>
            Change Menu:
        </>
    );
}

const useStyles = makeStyles({
    root: {
      width: "100%",
      margin: "15px 0"
    }
  });

function Order(props) {
    console.log("In order");
    console.log(props);
    const classes = useStyles();
    var createDate = props.order.createdAt;
    var updateDate = props.order.updatedAt;
    var customerName = props.order.customerID.username;
    var customerID = props.order.customerID._id;
    var customerPhonenum = props.order.customerID.phoneNum;
    var orderNo = props.order.orderNo;
    
    function handleClick(orderID){
        let s_orderID = orderID.toString();
        const URL = PREFIX +'/order/done';
        console.log("OA");
        async function done() {
            try {
                const response = await fetch(
                    URL, {
                        method: 'POST',
                        headers: {
                            'Authorization': 'Bearer '+ sessionStorage.getItem("token"),
                            'Content-type' : 'application/json'
                        },
                        body: 
                        JSON.stringify(
                            {
                                orderNo: s_orderID
                            }   
                        )
                    }
                );
                const approve_result = await response.json();
                console.log(approve_result);
            } catch (error) {
                console.log("error", error);
            }
        };
        done();
        console.log("OB");
        window.location.reload();
        console.log("setting reload");
    }

    return(
        <>
            <Card className={classes.root} >
                <CardContent>
                    <Typography gutterBottom variant="h4" component="h4">
                        <span style={{color: "#8a055e"}}>Order #{orderNo}</span>
                    </Typography>
                    <Typography gutterBottom variant="h5" component="h5">
                        Customer Username: {customerName}&nbsp;<span style={{color: "#444444", fontSize:"20px"}}>(ID: {customerID})</span>
                        <br/>
                        <span style={{color: "#444444", fontSize:"20px"}}>
                            <i className="material-icons">phone</i>Phone: {customerPhonenum}
                        </span>
                        
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        Order created at: {createDate} <br/>
                        Order finished at: {props.order.status? updateDate : "Not finished" }<br/>
                        Status: 
                        <span style={props.order.status? {color: "green"} : {color: "red"}}>
                            {props.order.status? "Completed":"Not completed" }
                        </span>
                    </Typography>
                </CardContent>
                {props.order.status? 
                        ""
                        :
                        <CardActions>
                                <Button size="small" style={{backgroundColor:"#8a055e"}}  onClick={() => {handleClick(orderNo)}}>
                                    <span style={{color: "white", padding:"2px"}}>Finish order</span>
                                </Button>
                        </CardActions>
                }
            </Card>
        </>
        
    );
}

function OrderHistory() {
    const [orderHistory, setOrderHistory] = useState([]);
    
    // const PREFIX='http://localhost:5000';
    useEffect(() => {
        const URL = PREFIX + '/order/fetchByRestaurant';
        const fetchOrder= async () => {
          try {
            const response = await fetch(
                URL, {
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
    

    return (
        <>
            <div className='row'>
                <div className='col-1'></div>
                <div className='col-10'>
                    <h2><i className="material-icons">receipt_long</i>Your order history:
                        <span style={{cursor:"pointer"}} onClick={()=>{window.location.reload();}}><i className="material-icons">sync</i></span>
                    </h2>
                    <hr/>
                    { orderHistory.length == 0? 
                        <h3>You haven't received any orders yet.</h3>
                        : 
                        orderHistory.map( (order,i) => <Order order={order} i={i} key={i} /> )
                    }
                </div>
                <div className='col-1'></div>
            </div>
        </>
    );
}

function UserRestaurant(props) {
    console.log(props.page);
    if (props.page == "menu"){
        return(
            <div style={{backgroundColor: "#faf0e5"}}>
                <ChangeMenu/>
            </div>

        );
    }
    else if (props.page ==  "history"){
        return(
            <div style={{backgroundColor: "#faf0e5", height:"100%"}}>
                <OrderHistory/>
            </div>
        );
    }
    else{
        return(
            <div style={{backgroundColor: "#faf0e5"}}>
                <AccountInfo/>
            </div>
        );
    }

}  
  
export default UserRestaurant;