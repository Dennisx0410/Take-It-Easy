import React from 'react';
import { useState, useEffect } from 'react';
import {Buffer} from 'buffer';
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
    if (restaurantInfo.profilePic != undefined){
        if (!skip){
            let profilePic = restaurantInfo.profilePic;
            console.log(profilePic);
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

    return(
        <>
            <div className="ProfileHeader">
                <h2 style={{ padding: "1vh 3vw 0 3vw", color: "#ba1851" }}>Welcome!</h2>
            </div>
            <div className='row'>
                <div className='col-1'></div>
                <div className='col-10'>
                    <h3>Glad to meet you, {restaurantInfo.username}!</h3>
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
                    {/* User ID: <span style={{color: "black"}}>{restaurantInfo.userID}</span><br/>
                    Username: <span style={{color: "black"}}>{restaurantInfo.username}</span><br/>
                    Phone Number: <span style={{color: "black"}}>{restaurantInfo.phoneNum}</span><br/>
                    E-mail: <span style={{color: "black"}}>{restaurantInfo.email}</span><br/>
                    Points: <span style={{color: "black"}}>{restaurantInfo.points? restaurantInfo.points:0}</span><br/> */}
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

function OrderHistory(){
    return(
        <>
            Order history:
        </>
    );
}

function UserRestaurant(props) {
    console.log(props.page);
    if (props.page == "menu"){
        return(
            <div className='userContent'>
                <ChangeMenu/>
            </div>

        );
    }
    else if (props.page ==  "history"){
        return(
            <div className='userContent'>
                <OrderHistory/>
            </div>
        );
    }
    else{
        return(
            <div className='userContent'>
                <AccountInfo/>
            </div>
        );
    }

}  
  
export default UserRestaurant;