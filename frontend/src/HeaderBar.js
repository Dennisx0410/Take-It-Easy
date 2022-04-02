import './HeaderBar.css';
import { Link, useParams } from 'react-router-dom';
import MaterialIcon, {colorPalette} from 'material-icons-react';
import Dropdown from 'react-bootstrap/Dropdown'


function HeaderBar(props){
    // {usertype, setToken}
    // const handleLogout = (logout) => {
    //     console.log("In handle logout");
    //     // logout(undefined);
    // }
    console.log(props.setToken);
    if (props.usertype=="restaurant"){
        return (
            <>
                <div className='header'>
                    <div className='container-fluid text-center'>
                        <div className='row'>
                            <div className='col-4'></div>
                            <div className='col-4'>
                                <Link to="/" className="header-title " style={{textAlign: "center"}}>
                                    <MaterialIcon icon="takeout_dining" color='#FFFFFF' />
                                    <span ><b>TAKE IT EASY</b></span>
                                    <MaterialIcon icon="takeout_dining" color='#FFFFFF' />
                                </Link>
                            </div>
                            <div className='col-3'></div>
                            
                            <div className='col-1 headerpadding bg-transparent btn-transparent'>
                                <Dropdown className="d-inline mx-2 bg-transparent btn-transparent" autoClose="outside" >
                                    <Dropdown.Toggle id="dropdown-autoclose-outside"  className="bg-transparent btn-transparent"  size="sm">
                                        <MaterialIcon icon="account_circle" color='#FFFFFF'/>
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                    <Dropdown.Item href="/r/profile">Menu</Dropdown.Item>
                                    <Dropdown.Item href="/r/history">Order History</Dropdown.Item>
                                        <Dropdown.Divider />
                                    <Dropdown.Item onClick={()=>{props.setToken(undefined);}} >Logout</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
    else if (props.usertype=="customer"){
        return (
            <>
                <div className='header'>
                    <div className='container-fluid text-center'>
                        <div className='row'>
                            <div className='col-4'></div>
                            <div className='col-4'>
                                <Link to="/" className="header-title " style={{textAlign: "center"}}>
                                    <MaterialIcon icon="takeout_dining" color='#FFFFFF' />
                                    <span ><b>TAKE IT EASY</b></span>
                                    <MaterialIcon icon="takeout_dining" color='#FFFFFF' />
                                </Link>
                            </div>
                            <div className='col-2'></div>
                            
                            <div className='col-1 headerpadding'>Points</div>
                            <div className='col-1 headerpadding bg-transparent btn-transparent'>
                                <Dropdown className="d-inline mx-2 bg-transparent btn-transparent" autoClose="outside" >
                                    <Dropdown.Toggle id="dropdown-autoclose-outside"  className="bg-transparent btn-transparent"  size="sm">
                                        <MaterialIcon icon="account_circle" color='#FFFFFF' />
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                    <Dropdown.Item href="/customer/profile">Profile</Dropdown.Item>
                                    <Dropdown.Item href="/customer/history">Order History</Dropdown.Item>
                                        <Dropdown.Divider />
                                    <Dropdown.Item onClick={()=>{props.setToken(undefined);}} >Logout</Dropdown.Item>
                                    {/* onClick={handleLogout(props.setToken)} */}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </>
        );
    }
        
}

export default HeaderBar;