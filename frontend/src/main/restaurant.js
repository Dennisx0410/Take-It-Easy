import './restaurant.css';
import React from 'react';
import { useState } from 'react';
import { BrowserRouter, Route, Routes} from 'react-router-dom';
import {Link} from 'react-router-dom';
import {useMatch, useParams, useLocation} from 'react-router-dom';

function Restaurant() {
    let { rid } = useParams();
    function handlePick(){
        alert("test");
    }
    return (
        <>
            <div>
                <h1>This is where a restaurant page should be</h1>
                <h2>ID = {rid}</h2> 
            </div>
        </>
    );
  }  
  
export default Restaurant;