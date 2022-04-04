import './admin.css';
import React, { useState } from 'react';
import { BrowserRouter, Route, Routes} from 'react-router-dom';
import {Link} from 'react-router-dom';
import {useMatch, useParams, useLocation} from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import Box from '@mui/material/Box';
import {Buffer} from 'buffer';

function ResetPassword(props){
    return(
        <>
            <h3>Reset Password:</h3>
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
                    <ResetPassword/>
                    <CustomerList/>
                </>
                
            );
        }
        else if (this.props.page ==  "ULRestaurant"){
            return(
                <>
                    <ResetPassword/>
                    <RestaurantList/>
                </>
                
            );
        }
    }
}
export default Admin;