import React, { useState } from 'react';
import './signup.css';
import { useNavigate } from 'react-router-dom';

async function signup(form, usertype) {
    return fetch(`http://localhost:5000/${usertype}/signup`, {
        method: 'POST', 
        body: form
    })
    .then(data => data.json())
}

function Signup(props) {
    const [imgUrl, setImgUrl] = useState('');
    const [formUsertype, setFormUsertype] = useState('');
    const [signupStatus, setSignupStatus] = useState('');
    const [pwVisibility, setPwVisibility] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async e => {
        e.preventDefault();

        setSignupStatus('');

        // extract fields from form
        let signupForm = e.target;
        let formData = new FormData(signupForm);
        let usertype = formData.get('usertype');
        props.setUserInfo({
            username: formData.get('username'),
            usertype: formData.get('usertype')
        });
        let res = await signup(formData, usertype);
        console.log(res);

        setSignupStatus(res.name);

        if (usertype === 'customer' && res.name === 'SignupSuccessAndVerificationEmailSent') {
            navigate('/verification');
        }
        else if (usertype === 'restaurant' && res.name === 'RegistrationReceived') {
            navigate('/verification');
        }
    }

    const handleUsertypeChange = async e => {
        let signupForm = e.target.form;
        setFormUsertype(e.target.value);

        // reset form with warning and img preview
        setSignupStatus('');
        setImgUrl('');
        signupForm.reset();

        // reset choice after reset form
        signupForm.usertype.value = e.target.value;
    }

    // preview after choosing profile picture
    const showPreview = async e => {
        e.preventDefault();

        let files = e.target.files;

        if (files.length === 0) { // no file 
            setImgUrl('');
        }
        else if (files[0].type !== 'image/jpeg' && files[0].type !== 'image/png') {
            setImgUrl('');
            setSignupStatus("FileExtensionError");
        }
        else { // have file
            let objURL = URL.createObjectURL(e.target.files[0]);
            setImgUrl(objURL);
            setSignupStatus('');
        }
    }

    const restaurantSignupContent = (
        <>
        <div className="mb-3">
            <label htmlFor="restaurantName" className="form-label">
                <i className="material-icons">store</i>Restaurant name
            </label>
            <input type="text" className="form-control" id="restaurantName" name="restaurantName" pattern="^[a-zA-Z0-9\u4e00-\u9fa5_ \\.]+$" title="Combinations of alphanumeric characters, 中文字, space, full stop('.') and underscore('_') only" required/>
        </div>
        <div className="mb-3">
            <label htmlFor="address" className="form-label">
                <i className="material-icons">place</i>Address
            </label>
            <input type="text" className="form-control" id="address" name="address" pattern="^[a-zA-Z0-9\u4e00-\u9fa5, \\.]+$" title="Combinations of alphanumeric characters, 中文字, space, full stop('.') and comma(',') only" required/>
        </div>
        <div className="mb-3">
            <label htmlFor="licenseNum" className="form-label">
                <i className="material-icons">tag</i>License number
            </label>
            <input type="text" className="form-control" id="licenseNum" name="licenseNum" pattern="^[a-zA-Z0-9]+$" title="Combinations of alphanumeric characters only" required/>
        </div>
        </>
    )

    const signupBox = (
        <>
            <div className="signup-container">
                <h1>Signup</h1>
                <hr className="header"></hr>
                <form id="signup" onSubmit={handleSubmit}>
                    <div>
                        <label>
                            <i className="material-icons">account_circle</i>User type
                        </label>
                        <div className="container" style={{width: "70%"}}>
                            <div className="row" onChange={handleUsertypeChange}>
                                <section className="col-12 col-sm-6">
                                    <div className="mb-3 form-radio" style={{textAlign: 'center'}}>
                                        <input className="form-check-input" type="radio" name="usertype" id="customer" value="customer" required/>
                                        <label className="form-check-label" htmlFor="customer">
                                            <i className="material-icons d-none d-lg-inline">person</i>
                                            Customer
                                        </label>
                                    </div>
                                </section>
                                <section className="col-12 col-sm-6">
                                    <div className="mb-3 form-radio" style={{textAlign: 'center'}}>
                                        <input className="form-check-input" type="radio" name="usertype" id="restaurant" value="restaurant" required/>
                                        <label className="form-check-label" htmlFor="restaurant">
                                            <i className="material-icons d-none d-lg-inline">restaurant</i>Restaurant
                                        </label>
                                    </div>
                                </section>
                            </div> 
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-12 col-md-6 d-inline-block">
                            <label htmlFor="username" className="form-label">
                                <i className="material-icons">edit</i>Username
                            </label>
                            <input type="text" className="form-control" id="username" name="username" pattern="^[a-zA-Z0-9_\\.]+$" title="Combinations of alphanumeric characters, full stop('.') and underscore('_') only" required/>
                            <p style={{color: "red", display: (signupStatus === 'UserAlreadyExisted') ? "block" : "none"}}> 
                                <i className="material-icons">warning</i>
                                User name aleady in used, please choose another username!
                            </p>
                        </div>
                        <div className="col-12 col-md-6 d-inline-block">
                            <label htmlFor="password" className="form-label">
                                <i className="material-icons">password</i>Password
                            </label>
                            <div className="input-group">
                                <input type={pwVisibility ? "text" : "password"} className="form-control" id="password" name="password" required/>
                                <button type="button" className="material-icons input-group-text" onClick={() => setPwVisibility(!pwVisibility)}>{pwVisibility ? "visibility_off" : "visibility"}</button>
                            </div>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-12 col-md-6 d-inline-block">
                            <label htmlFor="email" className="form-label">
                                <i className="material-icons">email</i>Email
                            </label>
                            <input type="email" className="form-control" id="email" name="email" required/>
                        </div>
                        <div className="col-12 col-md-6 d-inline-block">
                            <label htmlFor="phoneNum" className="form-label">
                                <i className="material-icons">smartphone</i>Phone number
                            </label>
                            <input type="tel" className="form-control" id="phoneNum" name="phoneNum" pattern="[0-9]{8}" title="8-digit phone number" required/>
                        </div>
                    </div>
                    {formUsertype == "restaurant" ? restaurantSignupContent : ''}
                    <div className="row mb-3">
                        <section className="col-12 col-md-8">
                            <label htmlFor="profile" className="form-label">
                                <i className="material-icons">add_photo_alternate</i>Profile
                            </label>
                            <input type="file" className="form-control" id="profile" name="profile" accept="image/jpeg, image/png" onChange={showPreview} placeholder="jpg/jepg/jfif/png" required/>
                        </section>
                        <section className="col-4 d-none d-md-inline">
                            <div className="preview" >
                                <img src={imgUrl} id="profile-preview" alt="profile"></img>
                            </div>
                        </section>
                    </div>
                    <p style={{color: "red", display: (signupStatus === 'FileExtensionError') ? "block" : "none"}}> 
                        <i className="material-icons">warning</i>
                        Please upload again with jpg/jepg/jfif/png format
                    </p>
                    
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
            </div>
        </>
    );
    
    return signupBox;
}

export default Signup;
