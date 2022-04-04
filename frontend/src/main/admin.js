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