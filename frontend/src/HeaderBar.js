import './HeaderBar.css';
import { Link, useParams } from 'react-router-dom';


function HeaderBar(){

    return (
        <>
            <div className='header'>
                
                    <span href="/" class="material-icons-outlined">
                        shopping_bag
                    </span>
                    <span >TAKE IT EASY</span>
                

            </div>
        </>
    );
}

export default HeaderBar;