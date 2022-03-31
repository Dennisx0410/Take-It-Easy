import React, { useState } from 'react';
import './signup.css';

async function signup(form, userType) {
    return fetch(`http://localhost:5000/${userType}/signup`, {
        method: 'POST', 
        body: form
    })
    .then(data => data.json())
}

function Signup() {
    const [imgUrl, setImgUrl] = useState();
    const [signupStatus, setSignupStatus] = useState('');

    const handleSubmit = async e => {
        e.preventDefault();

        let form = new FormData(e.target);
        let userType = form.get('user-type');
        let res = await signup(form, userType);
        console.log(res);

        setSignupStatus(res.name);

        if (res.name === 'UploadSuccess') {
            // should be go to verification page
        }
        
    }

    // preview after choosing profile picture
    const showPreview = async e => {
        e.preventDefault();
    
        let objURL = URL.createObjectURL(e.target.files[0]);
        setImgUrl(objURL);
    }
    
    return (
        <>
            <div className='signin-container'>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label>
                            <i className="material-icons">account_circle</i>User type
                        </label>
                        <div className="container" style={{width: "70%", margin: "auto"}}>
                            <div className="row">
                                <section className="col-6">
                                    <div className="mb-3 form-radio" style={{textAlign: 'center'}}>
                                        <input className="form-check-input" type="radio" name="user-type" id="customer" value="customer" checked="checked" required/>
                                        <label className="form-check-label" htmlFor="customer">
                                            <i className="material-icons">person</i>
                                            Customer
                                        </label>
                                    </div>
                                </section>
                                <section className="col-6">
                                    <div className="mb-3 form-radio" style={{textAlign: 'center'}}>
                                        <input className="form-check-input" type="radio" name="user-type" id="restaurant" value="restaurant" required/>
                                        <label className="form-check-label" htmlFor="restaurant">
                                            <i className="material-icons">store</i>Restaurant
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
                            <i className="material-icons">smartphone</i>Password
                        </label>
                        <input type="password" className="form-control" id="password" name="password" required/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">
                            <i className="material-icons">email</i>Email
                        </label>
                        <input type="email" className="form-control" id="email" name="email" required/>
                        
                    </div>
                    <div className="mb-3">
                        <label htmlFor="phoneNum" className="form-label">
                            <i className="material-icons">add_photo_alternate</i>Phone number
                        </label>
                        <input type="tel" className="form-control" id="phoneNum" name="phoneNum" pattern='[0-9]{8}' required/>
                    </div>
                    <div className="mb-3">
                        <div className='row'>
                            <section className='col-8'>
                                <label htmlFor="profile" className="form-label">
                                    <i className="material-icons">add_photo_alternate</i>Profile
                                </label>
                                <input type="file" id="profile" name="profile" accept="image/jpeg, image/png" onChange={showPreview} placeholder="jpg/jepg/jfif/png" required/>
                            </section>
                            <section className='col-4'>
                                <div className="preview" >
                                    <img src={imgUrl} id="profile-preview" alt="profile picture"></img>
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
    )

}

export default Signup;
