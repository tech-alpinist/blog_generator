import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

import logo from 'assets/logo.png';
import avatar from 'assets/avatar.png'

import "./_style.scss";

export default function Header() {

    const dispatch = useDispatch();
    const { isAuthenticated, user_info } = useSelector((state) => state.auth)

    return (
    <div className="header w-full">
        <div className='container mx-auto px-4 flex justify-between items-center'>
            <div className="header-left">
                <NavLink className="logo" to='/'>
                    <img className='logo_lg' src={logo} alt='logo' />
                </NavLink>
            </div>
            <div className='header-middle'>
                <div className="navbar">
                    <div className="navbar-item">
                        <NavLink to="/templates" activeclassname="active">Home</NavLink>
                    </div>
                    <div className="navbar-item">
                        <NavLink to="/collections">Collections</NavLink>
                    </div>
                    <div className="navbar-item">
                        <NavLink to="/generator">Generators</NavLink>
                    </div>
                    <div className="navbar-item">
                        <NavLink to="/settings">Settings</NavLink>
                    </div>
                </div>
            </div>
            <div className="header-right">
                <div className='header-menu'>
                    <div className="header-menu-item">
                        {
                            isAuthenticated ? (
                                <NavLink to='/' onClick={() => {
                                    dispatch({
                                        type: 'logout'
                                    })
                                }}>Log Out</NavLink>
                            ) : (
                                <NavLink to='/login'>Log In</NavLink>
                            )
                        }
                        
                    </div>
                </div>
                <div className="header-profile">
                    {
                        isAuthenticated && (
                            <div className="avatar">
                                <img className='user_avatar' src={avatar} alt='avatar' />
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    </div>
    );
}
