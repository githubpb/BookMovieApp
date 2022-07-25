import * as React from 'react';
import myIcon from "../../assets/logo.svg"
import Button from '@material-ui/core/Button'
import { Link } from 'react-router-dom';

import "./Header.css"

export default function Header() {

     let navigate = useNavigation();
     const routeChange = () =>{
       let path = `bookshow/1234`;
       navigate(path);
     }

    return (
        <div className="header-style">
            <img className="logo-icon-style" src={myIcon}>
            </img>
            <Button className="login-logout-button" variant="contained" >Login</Button>
            <Link to="/bookshow/1234">
            <Button className="book-show-button"  color="primary" variant="contained">Book Show</Button>
            </Link>
            
        </div>
    )
}