import React, { useContext, useRef, useState } from 'react';
import './Navbar.css';
import logo from '../Assets/logo.png'
import cart_icon from '../Assets/cart_icon.png'
import { Link } from 'react-router-dom';
import { ShopContext } from '../../Context/ShopContext';
import nav_dropdown from '../Assets/nav_dropdown.png'



const Navbar = () => {

    const [menu, setmenu] = useState("shop");
    const { getTotalCartItems } = useContext(ShopContext);
    const menuRef = useRef();

    const dropdownToggle = () => {
        if (menuRef.current) {
            menuRef.current.classList.toggle('nav-menu-visible');
        }
    }


    return (
        <div className='navbar'>
            <div className="nav-logo">
                <img src={logo} alt="" />
                <p>FForte</p>
            </div>
            <img className='nav-dropdown' onClick={dropdownToggle} src={nav_dropdown} alt="" />
            <ul ref={menuRef} className='nav-menu'>
                <li onClick={() => { setmenu("shop") }} ><Link style={{ textDecoration: 'none' }} to='/'> Shop </Link>{menu === "shop" ? <hr /> : <></>}</li>
                <li onClick={() => { setmenu("mens") }} ><Link style={{ textDecoration: 'none' }} to='/mens'> Men </Link>{menu === "mens" ? <hr /> : <></>}</li>
                <li onClick={() => { setmenu("womens") }} ><Link style={{ textDecoration: 'none' }} to='/womens'> Women </Link> {menu === "womens" ? <hr /> : <></>}</li>
                <li onClick={() => { setmenu("kids") }} ><Link style={{ textDecoration: 'none' }} to='/kids'> Kids </Link>{menu === "kids" ? <hr /> : <></>}</li>
            </ul>
            <div className="nav-login-cart">
                {localStorage.getItem('auth-token')
                    ? <button onClick={() => { localStorage.removeItem('auth-token'); window.location.replace('/') }}>LogOut</button>
                    : <Link to='/login'> <button>Login</button> </Link>}
                <Link to='/cart'>  <img src={cart_icon} alt="" /> </Link>
                <div className='nav-cart-count'>{getTotalCartItems()}</div>
            </div>
        </div>
    );
};

export default Navbar;
