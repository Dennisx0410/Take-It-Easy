import './admin.css';
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
import Box from '@mui/material/Box';
import {Buffer} from 'buffer';

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
            setCPstatus("The new password you typed does not match the re-entered new password. Please try again.");
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
                                'Authorization': 'Bearer '+sessionStorage.getItem("token"),
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
            setCPstatus("Please fill in all the fields.");
        }
        else if(newpwd != REnewpwd){
            console.log(newpwd);
            console.log(REnewpwd);
            setCPstatus("The new password you typed does not match the re-entered new password. Please try again.");
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
                                'Authorization': 'Bearer '+sessionStorage.getItem("token"),
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

function Orders(){
    return(
        <>
            <h2>Orders:</h2>
        </>
    );
}

function CustomerList(){
    return(
        <>
            <h2>List of Customers:</h2>
        </>
    );

}

function RestaurantList(){
    return(
        <>
            <h2>List of Restaurants:</h2>
            <Card>
                <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                        : #
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        {}
                    </Typography>
                </CardContent>
                <CardActions disableSpacing>
                    <Button size="small" color="primary">
                    Approve
                    </Button>
                    <Button size="small" color="secondary">
                    Ban
                    </Button>
                </CardActions>
            </Card>
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
                <>
                    <Orders/>
                </>
                
            );
        }
        else if (this.props.page ==  "ULCustomer"){
            return(
                <>  
                    <ResetCustomerPassword/>
                    <CustomerList/>
                </>
                
            );
        }
        else if (this.props.page ==  "ULRestaurant"){
            return(
                <>
                    <ResetRestaurantPassword/>
                    <RestaurantList/>
                </>
                
            );
        }
    }
}
export default Admin;