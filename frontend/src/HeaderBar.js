import './HeaderBar.css';
import { Link, useParams } from 'react-router-dom';


function HeaderBar(){

    return (
        <>
            <div className='header'>
                <Link to="/" className = {'header-title'}>
                    Main
                </Link>
            </div>
        </>
    );
}

export default HeaderBar;