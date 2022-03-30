import './HeaderBar.css';
import { Link, useParams } from 'react-router-dom';
import MaterialIcon, {colorPalette} from 'material-icons-react';
import Dropdown from 'react-bootstrap/Dropdown'


function HeaderBar(){

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
                        <div className='col-1'></div>
                        <div className='col-1'>Points</div>
                        <div className='col-1'>
                            <Dropdown className="d-inline mx-2" autoClose="outside">
                                <Dropdown.Toggle id="dropdown-autoclose-outside">
                                    <MaterialIcon icon="account_circle" color='#FFFFFF' />
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                <Dropdown.Item href="/customer/profile">Profile</Dropdown.Item>
                                <Dropdown.Item href="/customer/history">Order History</Dropdown.Item>
                                    <Dropdown.Divider />
                                <Dropdown.Item eventKey="4">Logout</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                        <div className='col-1'></div>
                    </div>
                    
                </div>
                    
                
                
                    
                

            </div>
        </>
    );
}

export default HeaderBar;