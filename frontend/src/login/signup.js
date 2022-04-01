import React, { useState } from 'react';
import './signup.css';

async function signup(form, userType) {
    return fetch(`http://localhost:5000/${userType}/signup`, {
        method: 'POST', 
        body: form
    })
    .then(data => data.json())
}

async function verify(username, otp) {
    return fetch(`http://localhost:5000/customer/activate`, {
        method: 'POST', 
        headers: {"Content-Type": 'application/json'},
        body: JSON.stringify({username: username, otp: otp})
    })
    .then(data => data.json())
}

async function reverify(username, email) {
    return fetch(`http://localhost:5000/customer/reverify`, {
        method: 'POST', 
        headers: {"Content-Type": 'application/json'},
        body: JSON.stringify({username: username, email: email})
    })
    .then(data => data.json())
}

function Signup({setToken}) {
    const [imgUrl, setImgUrl] = useState('');
    const [signupStatus, setSignupStatus] = useState('');
    const [userInfo, setUserInfo] = useState({});
    const [verifyStatus, setVerifyStatus] = useState('');
    const [pwVisibility, setPwVisibility] = useState(false);

    const handleSubmit = async e => {
        e.preventDefault();

        setSignupStatus('');

        let signupForm = new FormData(e.target);
        let userType = signupForm.get('user-type');
        setUserInfo({
            username: signupForm.get('username'),
            email: signupForm.get('email'),
            userType: signupForm.get('user-type')
        });
        let res = await signup(signupForm, userType);
        console.log(res);

        setSignupStatus(res.name);
    }

    // preview after choosing profile picture
    const showPreview = async e => {
        e.preventDefault();
    
        let objURL = URL.createObjectURL(e.target.files[0]);
        setImgUrl(objURL);
    }

    const handleOtpSubmit = async e => {
        e.preventDefault();

        setVerifyStatus('');
        let otpForm = new FormData(e.target);
        let otp = otpForm.get('otp');
        console.log(otp);
        console.log(userInfo.username);

        let res = await verify(userInfo.username, otp.toString());

        console.log(res);

        if (res.token != null) {
            setToken(res.token);
        }
        else {
            setVerifyStatus(res.name); 
        }
    }

    const handleReverify = async e => {
        e.preventDefault();

        setVerifyStatus('');
        let res = await reverify(userInfo.username, userInfo.email);
        console.log(res);

        setVerifyStatus(res.name);
    }
    
    const signupBox = (
        <>
            <div className="signup-container">
                <h1>Signup</h1>
                <hr></hr>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label>
                            <i className="material-icons">account_circle</i>User type
                        </label>
                        <div className="container" style={{width: "70%"}}>
                            <div className="row">
                                <section className="col-12 col-sm-6">
                                    <div className="mb-3 form-radio" style={{textAlign: 'center'}}>
                                        <input className="form-check-input" type="radio" name="user-type" id="customer" value="customer" required/>
                                        <label className="form-check-label" htmlFor="customer">
                                            <i className="material-icons d-none d-lg-inline">person</i>
                                            Customer
                                        </label>
                                    </div>
                                </section>
                                <section className="col-xs-12 col-sm-6">
                                    <div className="mb-3 form-radio" style={{textAlign: 'center'}}>
                                        <input className="form-check-input" type="radio" name="user-type" id="restaurant" value="restaurant" required/>
                                        <label className="form-check-label" htmlFor="restaurant">
                                            <i className="material-icons d-none d-lg-inline">store</i>Restaurant
                                        </label>
                                    </div>
                                </section>
                            </div> 
                        </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">
                            <i className="material-icons">edit</i>Username
                        </label>
                        <input type="text" className="form-control" id="username" name="username" required/>
                        <p style={{color: "red", display: (signupStatus === 'UserAlreadyExisted') ? "block" : "none"}}> 
                            <i className="material-icons">warning</i>
                            User name aleady in used, please choose another username!
                        </p>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">
                            <i className="material-icons">password</i>Password
                        </label>
                        <div className="input-group">
                            <input type={pwVisibility ? "text" : "password"} className="form-control" id="password" name="password" required/>
                            <button type="button" className="material-icons input-group-text" onClick={() => setPwVisibility(!pwVisibility)}>{pwVisibility ? "visibility_off" : "visibility"}</button>
                        </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">
                            <i className="material-icons">email</i>Email
                        </label>
                        <input type="email" className="form-control" id="email" name="email" required/>
                        
                    </div>
                    <div className="mb-3">
                        <label htmlFor="phoneNum" className="form-label">
                            <i className="material-icons">smartphone</i>Phone number
                        </label>
                        <input type="tel" className="form-control" id="phoneNum" name="phoneNum" pattern="[0-9]{8}" title="8-digit phone number" required/>
                    </div>
                    <div className="mb-3">
                        <div className='row mb-3'>
                            <section className='col-8'>
                                <label htmlFor="profile" className="form-label">
                                    <i className="material-icons">add_photo_alternate</i>Profile
                                </label>
                                <input type="file" className="form-control" id="profile" name="profile" accept="image/jpeg, image/png" onChange={showPreview} placeholder="jpg/jepg/jfif/png" required/>
                            </section>
                            <section className='col-4'>
                                <div className="preview" >
                                    <img src={imgUrl} id="profile-preview" alt="profile"></img>
                                </div>
                            </section>
                        </div>
                        <p style={{color: "red", display: (signupStatus === 'FileExtensionError') ? "block" : "none"}}> 
                            <i className="material-icons">warning</i>
                            Please upload again with jpg/jepg/jfif/png format
                        </p>
                    </div>
                    
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
            </div>
        </>
    );

    const verificationBox = (
        <>
            <div className="signup-container">
                <h1>Verification</h1>
                <hr></hr>
                <p>The 6-digit verification code has been sent to your registered email, please enter the verification code to activate your account within 2 minutes.</p>
                <form onSubmit={handleOtpSubmit}>
                    <div className="container">
                        <div className="row mb-3">
                            <div className="col-12 col-md-8 d-block">
                                <input type="text" className="form-control" id="otp" name="otp" pattern="[0-9]{6}" title="6-digit code" required/>
                            </div>

                            <div className="col-12 col-md-4 d-block">
                                <button type="submit" className="btn btn-primary">Submit</button>
                            </div>
                        </div>
                        <p style={{color: "red", display: (verifyStatus === 'InvalidOtp') ? "block" : "none"}}> 
                            <i className="material-icons">warning</i>
                            Wrong verification code!
                        </p>
                        <p style={{color: "red", display: (verifyStatus === 'OtpNotFound') ? "block" : "none"}}> 
                            <i className="material-icons">warning</i>
                            User not found!
                        </p>
                        <p style={{color: "red", display: (verifyStatus === 'OtpExpired') ? "block" : "none"}}> 
                            <i className="material-icons">warning</i>
                            The verification code has been expired, please request for another verification code.
                        </p>
                        <p style={{color: "red", display: (verifyStatus === 'TooMuchTrials') ? "block" : "none"}}> 
                            <i className="material-icons">warning</i>
                            You have made too much wrong trials, please request for another verification code.
                        </p>
                        <p style={{color: "blue", display: (verifyStatus === 'TooMuchTrials') ? "block" : "none"}}> 
                            <i className="material-icons">warning</i>
                            New verification code sent, please check your mailbox.
                        </p>
                        <p style={{color: "red", display: (verifyStatus === 'PendingOtp') ? "block" : "none"}}> 
                            <i className="material-icons">warning</i>
                            There is an unexpired verification code in your mailbox, please enter that code.
                        </p>
                        <a className="formattedLink" onClick={handleReverify}>I dont receive a verification code/please re-issue another code for me</a>
                    </div>
                </form>
            </div>
        </>
    );

    if (signupStatus === 'VerificationEmailSent' && userInfo.userType === 'customer') {
        return verificationBox;
    }
    else {
        return signupBox;
    }
}

export default Signup;
