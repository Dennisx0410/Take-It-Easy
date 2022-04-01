import './user_restaurant.css';
import React from 'react';
import { useState } from 'react';
import { BrowserRouter, Route, Routes} from 'react-router-dom';
import {Link} from 'react-router-dom';
import {useMatch, useParams, useLocation} from 'react-router-dom';

function UserRestaurant() {
    
    return (
        <>
            <div>
                <h1>This is where a restaurant can change their menu and check orders</h1>
            </div>
        </>
    );
}  
  
export default UserRestaurant;