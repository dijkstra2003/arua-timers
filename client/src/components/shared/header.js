import React from 'react';
import { Link } from 'react-router-dom';
import './header.css';

class Header extends React.Component {
    logout() {
        window.sessionStorage.removeItem('jwtToken');
        localStorage.setItem('logout', Date.now());
    }

    render() {
        const {isAuth} = this.props;
        return (
            <div>
                {isAuth ?
                    <nav className="navbar navbar-expand">
                        <ul className="navbar nav mr-atuo">
                            <li className="nav-item">
                                <Link to="/">home</Link>
                            </li>
                        </ul>
                        <span className="navbar-text"><Link to="/login" onClick={this.logout}> log out</Link></span>
                    </nav>
                    :
                    <span></span>}
            </div>
        )
    }
}

export default Header;