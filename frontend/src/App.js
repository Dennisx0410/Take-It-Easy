import './App.css';
import React, { useState } from 'react';
import { BrowserRouter, Route, Routes} from 'react-router-dom';
import ReactDOM from 'react-dom';
import Login from './loginPage/try_login';
import Main from './mainPage/main';

function App(){
    const [token, setToken] = useState();
    if(!token) {
        return <Login setToken={setToken} />
    }
    return (
        <>
            {/* <div className="wrapper">
                <h1>Hello :)</h1> */}
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Main name="Take It Easy!"/>}>  
                            {/* <Route path="main" element={<Main />}> </Route>  */}
                            {/* <Route path="try_login" element={<Login setToken={setToken}/>}> </Route> */}
                        </Route>
                    </Routes>
                </BrowserRouter>
            {/* </div> */}
              
            {/* <Title name={this.props.name}/>
            <Gallery /> */}
        </>
    );
//   }
}


export default App;
