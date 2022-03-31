import './customer.css';
import React, { useState } from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {Link} from 'react-router-dom';
import {useMatch, useParams, useLocation} from 'react-router-dom';
import ReactDOM from 'react-dom';
import HeaderBar from '../HeaderBar';




class Customer extends React.Component{
    render() {
        return (
            <>
              <div className='customer'>
                  
              </div>
                
            </>
        );
    }
}
export default Customer;