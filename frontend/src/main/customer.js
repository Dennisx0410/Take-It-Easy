import React from 'react';
import { useState, useEffect } from 'react';
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { Buffer } from 'buffer';
import { Alert, Avatar, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';

function ChangePassword(){
    const PREFIX='http://localhost:5000';
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
            // console.log("Empty");
            setCPstatus({name: "EmptyPw", message: "Please fill in all the fields."});
        }
        else if (newpwd != REnewpwd) {
            // console.log(newpwd);
            // console.log(REnewpwd);
            setCPstatus({name: "NewPwMismatched", message:"The new password you typed does not match the re-entered new password. Please try again."});
        }
        else{
            oldPassowrd = oldpwd;
            newPassword = newpwd;
            // console.log(oldPassowrd);
            // console.log(newPassword);
            // setCPstatus("Valid New password");
            const url_d = PREFIX+'/customer/changePw';
            const attempt = async () => {
                try {
                    const response = await fetch(
                        url_d, {
                            method: 'POST',
                            headers: {
                                'Authorization': 'Bearer '+sessionStorage.getItem("token"),
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

function AccountInfo() {
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

          } catch (error) {
            console.log("error", error);
          }
        };
        fetchData();
    }, []);

    //load profile pic
    const [ImgUrl, setImgUrl] = useState();
    const [skip , setSkip] = useState(false);
    if (customerInfo.profilePic != undefined){
        if (!skip){
            let profilePic = customerInfo.profilePic;
            // console.log(profilePic);
            let img = Buffer.from(profilePic.data).toString('base64');
            setSkip(true);
            setImgUrl(img);
                
        }
                
    }

    const rows = [
        {name: 'User ID', data: customerInfo.userID},
        {name: 'Username', data: customerInfo.username},
        {name: 'Phone number', data: customerInfo.phoneNum},
        {name: 'Email', data: customerInfo.email},
        {name: 'Points', data: customerInfo.points ? customerInfo.points : 0},
    ];

    return(
        <>
            <div className='row'>
                <div className='col-1'></div>
                <div className='col-10'>
                    <h2>Glad to meet you, {customerInfo.username}!</h2>
                    <h4><i className="material-icons">badge</i>Your information:</h4>
                    <div className='row'>
                        {/* profilePic */}
                        <div className='col-12 col-md-3 mb-3'>
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
                    <hr></hr>
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

function Order(props) {
    console.log("In order");
    // console.log(props);
    const classes = useStyles();
    var createDate = props.order.createdAt;
    var updateDate = props.order.createdAt;
    var restaurantName = props.order.restaurantID.restaurantName;
    var restaurantID = props.order.restaurantID._id;
    var orderNo = props.order.orderNo;
        return(
            <>
                <Card className={classes.root} >
                    <CardContent>
                        <Typography gutterBottom variant="h4" component="h4">
                            <span style={{color: "#8a055e"}}>Order #{orderNo}</span>
                        </Typography>
                        <Typography gutterBottom variant="h5" component="h5">
                            <span style={{color: "#aaaaaa"}}>Restaurant Name: {restaurantName}</span>
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
                
            </>
            
        );
}

// /order/fetchByCustomer
function OrderHistory() {
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

    return (
        <>
            <div className='row'>
                <div className='col-1'></div>
                <div className='col-10'>
                    <h2><i className="material-icons">receipt_long</i>Your order history:</h2>
                    <hr/>
                    { orderHistory.length == 0? 
                        <h3>You haven't made any orders yet.</h3>
                        : 
                        orderHistory.map( (order,i) => <Order order={order} i={i} key={i} /> )
                    }
                </div>
                <div className='col-1'></div>
            </div>
        </>
    );
}

class Customer extends React.Component{
    // constructor(props) {
    //     super(props);
    // }
    render() {
        
        if (this.props.action == "profile"){
            return (
                <>  
                    <div className='page-styling' >
                        <AccountInfo/>
                    </div>
                </>
            );
        }
        else if (this.props.action == "history") {
            return (
                <>
                    <div className='page-styling' style={{minHeight: "100vh"}}>
                        <OrderHistory/>
                    </div>
                </>
            );
        }
        else {
            return (
                <>
                    <div className='page-styling'>
                        <AccountInfo/>
                    </div>
                </>
            );
        }
    }
}
export default Customer;