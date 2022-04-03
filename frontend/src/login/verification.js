import React, { useState } from 'react';
import './verification.css';
import { useNavigate } from 'react-router-dom';

async function verify(username, otp) {
    return fetch(`http://localhost:5000/customer/activate`, {
        method: 'POST', 
        headers: {"Content-Type": 'application/json'},
        body: JSON.stringify({username: username, otp: otp})
    })
    .then(data => data.json())
}

async function reverify(username) {
    return fetch(`http://localhost:5000/customer/reverify`, {
        method: 'POST', 
        headers: {"Content-Type": 'application/json'},
        body: JSON.stringify({username: username})
    })
    .then(data => data.json())
}

function Verification(props) {
    const [verifyStatus, setVerifyStatus] = useState('');
    const navigate = useNavigate();

    console.log(props.userInfo);

    const handleOtpSubmit = async e => {
        e.preventDefault();

        setVerifyStatus('');
        let otpForm = new FormData(e.target);
        let otp = otpForm.get('otp');

        let res = await verify(props.userInfo.username, otp.toString());

        console.log(res);

        if (res.token != null) {
            navigate('/');
            props.setToken(res.token);
        }
        else {
            setVerifyStatus(res.name); 
        }
    }

    const handleReverify = async e => {
        e.preventDefault();

        setVerifyStatus('');
        let res = await reverify(props.userInfo.username);
        console.log(res);

        setVerifyStatus(res.name);
    }

    const verificationBox = (
        <>
            <div className="verification-container">
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
                        <p style={{color: "red", display: (verifyStatus === 'AlreadyActivated') ? "block" : "none"}}> 
                            <i className="material-icons">warning</i>
                            You have already activated your account, please directly login to your account!
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
                        <p style={{color: "red", display: (verifyStatus === 'PendingOtp') ? "block" : "none"}}> 
                            <i className="material-icons">warning</i>
                            There is an unexpired verification code in your mailbox, please enter that code.
                        </p>
                        <p style={{color: "blue", display: (verifyStatus === 'VerificationEmailSent') ? "block" : "none"}}> 
                            <i className="material-icons">warning</i>
                            New verification code sent, please check your mailbox.
                        </p>
                        <a className="formattedLink" onClick={handleReverify}>I dont receive a verification code/please re-issue another code for me</a>
                    </div>
                </form>
            </div>
        </>
    );
    
    const waitApprovalBox = (
        <>
            <div className="verification-container">
                <h1>Opps</h1>
                <hr></hr>
                <p>Your restaurant signup request is sent, please wait for admin approval. You will receive an email about your signup progress after admin has review your request.</p>
            </div>
        </>
    );

    if (props.userInfo.usertype === 'customer') {
        return verificationBox;
    }
    else if (props.userInfo.usertype === 'restaurant') {
        return waitApprovalBox;
    }
    else {
        return <>Content not found</>;
    }
}

export default Verification;
