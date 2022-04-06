import './user_restaurant.css';
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
            setCPstatus({"message":"Please fill in all the fields."});
        }
        else if(newpwd != REnewpwd){
            console.log(newpwd);
            console.log(REnewpwd);
            setCPstatus({"message":"The new password you typed does not match the re-entered new password. Please try again."});
        }
        else{
            oldPassowrd = oldpwd;
            newPassword = newpwd;
            console.log(oldPassowrd);
            console.log(newPassword);
            // setCPstatus("Valid New password");
            const url_d = PREFIX+'/restaurant/changePw';
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
            <span style={{color: "red"}}>{CPstatus.message}</span>
        </>
    );
}

function AccountInfo(){
    const [RestaurantInfo, setRestaurantInfo] = useState({});
    
    const PREFIX='http://localhost:5000';
    
    useEffect(() => {
        const url_d = PREFIX+'/restaurant/data';
        const fetchData = async () => {
          try {
            const response = await fetch(
                url_d, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer '+sessionStorage.getItem("token")
                }}
            );
            const restaurant_info = await response.json();
            setRestaurantInfo(restaurant_info);
            console.log(restaurant_info);

          } catch (error) {
            console.log("error", error);
          }
        };
        fetchData();
    }, []);

    //load profile pic
        const [ImgUrl, setImgUrl] = useState();
        const [skip , setSkip] = useState(false);
        if (RestaurantInfo.profilePic != undefined){
            if (!skip){
                let profilePic = RestaurantInfo.profilePic;
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
                    <h3>Glad to meet you, {RestaurantInfo.username}!</h3>
                    <h4>Your Information:</h4>
                    {/* profilePic */}
                    <Avatar alt="picture" src={`data:image/jpeg; base64, ${ImgUrl}`} sx={{ width: 85, height: 85 }} />
                    Restaurant ID: <span style={{color: "black"}}>{RestaurantInfo.userID}</span>
                    E-mail: <span style={{color: "black"}}>{RestaurantInfo.email}</span>
                    Phone Number: <span style={{color: "black"}}>{RestaurantInfo.phoneNum}</span>
                    Address: <span style={{color: "black"}}>{RestaurantInfo.address}</span><br/>
                    License Number: <span style={{color: "black"}}>{RestaurantInfo.licenseNum}</span>
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
            Order history:
        </>
    );
}

function OrderHistory(){
    return(
        <>
            Order history:
        </>
    );
}

function UserRestaurant() {
    
    if (this.props.action == "menu"){
        return(
            <>  <div className='userContent'>
                    <ChangeMenu/>
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
  
export default UserRestaurant;