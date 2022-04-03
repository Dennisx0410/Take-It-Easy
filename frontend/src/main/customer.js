import './customer.css';
import React, { useState } from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {Link} from 'react-router-dom';
import {useMatch, useParams, useLocation} from 'react-router-dom';
import ReactDOM from 'react-dom';
import HeaderBar from '../HeaderBar';
import Card from 'react-bootstrap/Card'

class AccountInfo extends React.Component{
    
}

class OrderHistory extends React.Component{
    render(){
        return(
            <Card style={{ width: '100%' }}>
                <Card.Body>
                    <Card.Title></Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">Card Subtitle</Card.Subtitle>
                    <Card.Text>
                    Some quick example text to build on the card title and make up the bulk of
                    the card's content.
                    </Card.Text>
                    <Card.Link href="#">Card Link</Card.Link>
                    <Card.Link href="#">Another Link</Card.Link>
                </Card.Body>
            </Card>
        );
    }
}

class Customer extends React.Component{
    render() {
        const { action } = this.props.match.params;
        if (action == "profile"){
            return(
                <>
                    <div className="ProfileHeader">
                        <h1>Welcome</h1>
                    </div>
                    <AccountInfo token={this.props.token}></AccountInfo>
                </>
                
            );
        }
        else if (action ==  "history"){
            return(
                <>
                    <div className="ProfileHeader">
                        <h1>Welcome</h1>
                    </div>
                    <OrderHistory token={this.props.token}></OrderHistory>
                </>
                
            );
        }
        else{
            return(
                <>
                    <div className="ProfileHeader">
                        <h1>Welcome</h1>
                    </div>
                    <AccountInfo token={this.props.token}></AccountInfo>
                </>
                
            );
        }
    }
}
export default Customer;