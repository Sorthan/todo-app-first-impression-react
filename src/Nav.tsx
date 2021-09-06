import './App.css';
import {Link} from 'react-router-dom';

function Nav() {

    const navStyle = {
        color: 'white',
        textDecoration: 'none'
    }

    return (
        <nav>
            <h3>Work to be done</h3>
            <ul className="nav-links"> 
                <button className="link-button btn-background-slide ">
                    <Link style={navStyle} to='/'>
                        <li>Home</li>
                    </Link>
                </button>
                <button className="link-button btn-background-slide ">
                    <Link style={navStyle} to ='/todoapplication'>
                        <li>Todo Application</li>
                    </Link>
                </button>
            </ul>
        </nav>
    )
}

export default Nav
