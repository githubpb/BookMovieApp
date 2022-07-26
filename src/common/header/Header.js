import React, { Component } from 'react';
import './Header.css';
import Button from '@material-ui/core/Button';
import Modal from 'react-modal';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import PropTypes from 'prop-types';
import FormHelperText from '@material-ui/core/FormHelperText';
import { Link } from 'react-router-dom';
import myIcon from "../../assets/logo.svg"


import "./Header.css"


const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
};

const TabContainer = function (props) {
    return (
        <Typography component="div" style={{ padding: 0, textAlign: 'center' }}>
            {props.children}
        </Typography>
    )
}

TabContainer.propTypes = {
    children: PropTypes.node.isRequired
}

class Header extends Component {

    constructor(){
        super()
        this.state = {
            username: "",
            usernameRequired: "showEmpty",
            
            userLoginPassword: "",
            userLoginPasswordRequired: "showEmpty",

            firstName: "",
            firstNameRequired: "showEmpty",

            lastName: "",
            lastNameRequired: "showEmpty",

            userEmail: "",
            userEmailRequired: "showEmpty",

            userRegisterPassword: "",
            userRegisterPasswordRequired: "showEmpty",

            contact: "",
            contactRequired: "showEmpty",

            registrationSuccess: false,
            loggedIn: sessionStorage.getItem("access-token") == null ? false : true
        }
    }

    openModal = () => {
        this.setState({
            isOpenModal: true,
            isLoginvalue: 0,

            username: "",
            usernameRequired: "showEmpty",
            
            userLoginPassword: "",
            userLoginPasswordRequired: "showEmpty",

            firstName: "",
            firstNameRequired: "showEmpty",

            lastName: "",
            lastNameRequired: "showEmpty",

            userEmail: "",
            userEmailRequired: "showEmpty",

            userRegisterPassword: "",
            userRegisterPasswordRequired: "showEmpty",

            contact: "",
            contactRequired: "showEmpty",
        });
    }

    closeModal = () => {
        this.setState({ isOpenModal: false });
    }

    tabChangeHandler = (event, isLoginvalue) => {
        this.setState({ isLoginvalue });
    }

    loginClickHandler = () =>{
        this.state.username === "" ? this.setState({ usernameRequired: "showData" }) : this.setState({ usernameRequired: "showEmpty" });
        this.state.userLoginPassword === "" ? this.setState({ userLoginPasswordRequired: "showData" }) : this.setState({ userLoginPasswordRequired: "showEmpty" });

        let dataLogin = null;
        let xhrLogin = new XMLHttpRequest();
        let that = this;
        xhrLogin.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                sessionStorage.setItem("uuid", JSON.parse(this.responseText).id);
                sessionStorage.setItem("access-token", xhrLogin.getResponseHeader("access-token"));

                that.setState({
                    loggedIn: true
                });

                that.closeModal();
            }
        });

        xhrLogin.open("POST", '/api/v1/' + "auth/login");
        xhrLogin.setRequestHeader("Authorization", "Basic " + window.btoa(this.state.username + ":" + this.state.userLoginPassword));
        xhrLogin.setRequestHeader("Content-Type", "application/json");
        xhrLogin.setRequestHeader("Cache-Control", "no-cache");
        xhrLogin.send(dataLogin);
    }

    changeUserName = (e) => {
        this.setState({ username: e.target.value });
    }

    changeInputLoginPassword = (e) => {
        this.setState({ userLoginPassword: e.target.value });
    }

    registerClick = () => {
        this.state.firstName === "" ? this.setState({ firstNameRequired: "showData" }) : this.setState({ firstNameRequired: "showEmpty" });
        this.state.lastName === "" ? this.setState({ lastNameRequired: "showData" }) : this.setState({ lastNameRequired: "showEmpty" });
        this.state.userEmail === "" ? this.setState({ userEmailRequired: "showData" }) : this.setState({ userEmailRequired: "showEmpty" });
        this.state.userRegisterPassword === "" ? this.setState({ userRegisterPasswordRequired: "showData" }) : this.setState({ userRegisterPasswordRequired: "showEmpty" });
        this.state.contact === "" ? this.setState({ contactRequired: "showData" }) : this.setState({ contactRequired: "showEmpty" });

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        
        var raw = JSON.stringify({
            "email_address": this.state.userEmail,
            "first_name": this.state.firstName,
            "last_name": this.state.lastName,
            "mobile_number": this.state.contact,
            "password": this.state.userRegisterPassword
        });

        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          redirect: 'follow'
        };
        
        fetch("/api/v1/signup", requestOptions)
          .then(response => 
            {
                response.text()
                if(response.status === 201) {
                    this.setState({
                        registrationSuccess: true
                    })
                }
            })
          .then(result => console.log(result))
          .catch(error => console.log('error', error));
    }

    changeFirstName = (e) => {
        this.setState({ firstName: e.target.value });
    }

    changeLastName = (e) => {
        this.setState({ lastName: e.target.value });
    }

    changeInputEmail = (e) => {
        this.setState({ userEmail: e.target.value });
    }

    changeUserRegisterPassword = (e) => {
        this.setState({ userRegisterPassword: e.target.value });
    }

    changeInputContact = (e) => {
        this.setState({ contact: e.target.value });
    }

    logoutHandler = (e) => {
        sessionStorage.removeItem("uuid");
        sessionStorage.removeItem("access-token");

        this.setState({
            loggedIn: false
        });
    }
    
    render() {
        return (
            <div>
                <div className="header-style">
                    <img className="logo-icon-style" src={myIcon}> 
                    </img>
                {!this.state.loggedIn ?
                        <div className="login-logout-button">
                            <Button variant="contained" color="default" onClick={this.openModal}>
                                Login
                            </Button>
                        </div>
                        :
                        <div className="login-logout-button">
                            <Button variant="contained" color="default" onClick={this.logoutHandler}>
                                Logout
                            </Button>
                        </div>
                    }
                    {this.props.showBookShowButton === "true" && !this.state.loggedIn
                        ? <div className="book-show-button">
                            <Button variant="contained" color="primary" onClick={this.openModal}>
                                Book Show
                            </Button>
                        </div>
                        : ""
                    }

                    {this.props.showBookShowButton === "true" && this.state.loggedIn
                        ? <div className="book-show-button">
                            <Link to={"/bookshow/" + this.props.id}>
                                <Button variant="contained" color="primary">
                                    Book Show
                                </Button>
                            </Link>
                        </div>
                        : ""
                    }

                    <Modal
                        ariaHideApp={false}
                        isOpen={this.state.isOpenModal}
                        contentLabel="Login"
                        onRequestClose={this.closeModal}
                        style={customStyles}
                    >
                        <Tabs className="tabs" value={this.state.isLoginvalue} onChange={this.tabChangeHandler}>
                            <Tab label="Login" />
                            <Tab label="Register" />
                        </Tabs>

                        {this.state.isLoginvalue === 0 &&
                            <TabContainer>
                                <FormControl required>
                                    <InputLabel htmlFor="username">Username</InputLabel>
                                    <Input id="username" type="text" username={this.state.username} onChange={this.changeUserName} />
                                    <FormHelperText className={this.state.usernameRequired}>
                                        <span className="red">required</span>
                                    </FormHelperText>
                                </FormControl>
                                <br /><br />
                                <FormControl required>
                                    <InputLabel htmlFor="loginPassword">Password</InputLabel>
                                    <Input id="loginPassword" type="password" loginpassword={this.state.userLoginPassword} onChange={this.changeInputLoginPassword} />
                                    <FormHelperText className={this.state.userLoginPasswordRequired}>
                                        <span className="red">required</span>
                                    </FormHelperText>
                                </FormControl>
                                <br /><br />
                                {this.state.loggedIn === true &&
                                    <FormControl>
                                        <span className="successText">
                                            Login Successful!
                                        </span>
                                    </FormControl>
                                }
                                <br /><br />
                                <Button variant="contained" color="primary" onClick={this.loginClickHandler}>LOGIN</Button>
                            </TabContainer>
                        }

                        {this.state.isLoginvalue === 1 &&
                            <TabContainer>
                                <FormControl required>
                                    <InputLabel htmlFor="firstname">First Name</InputLabel>
                                    <Input id="firstname" type="text" firstname={this.state.firstName} onChange={this.changeFirstName} />
                                    <FormHelperText className={this.state.firstNameRequired}>
                                        <span className="red">required</span>
                                    </FormHelperText>
                                </FormControl>
                                <br /><br />
                                <FormControl required>
                                    <InputLabel htmlFor="lastname">Last Name</InputLabel>
                                    <Input id="lastname" type="text" lastname={this.state.lastName} onChange={this.changeLastName} />
                                    <FormHelperText className={this.state.lastNameRequired}>
                                        <span className="red">required</span>
                                    </FormHelperText>
                                </FormControl>
                                <br /><br />
                                <FormControl required>
                                    <InputLabel htmlFor="email">Email</InputLabel>
                                    <Input id="email" type="text" email={this.state.userEmail} onChange={this.changeInputEmail} />
                                    <FormHelperText className={this.state.userEmailRequired}>
                                        <span className="red">required</span>
                                    </FormHelperText>
                                </FormControl>
                                <br /><br />
                                <FormControl required>
                                    <InputLabel htmlFor="registerPassword">Password</InputLabel>
                                    <Input id="registerPassword" type="password" registerpassword={this.state.registerPasswordRequired} onChange={this.changeUserRegisterPassword} />
                                    <FormHelperText className={this.state.userRegisterPasswordRequired}>
                                        <span className="red">required</span>
                                    </FormHelperText>
                                </FormControl>
                                <br /><br />
                                <FormControl required>
                                    <InputLabel htmlFor="contact">Contact No.</InputLabel>
                                    <Input id="contact" type="text" contact={this.state.contact} onChange={this.changeInputContact} />
                                    <FormHelperText className={this.state.contactRequired}>
                                        <span className="red">required</span>
                                    </FormHelperText>
                                </FormControl>
                                <br /><br />
                                {this.state.registrationSuccess === true &&
                                    <FormControl>
                                        <span className="successText">
                                            Registration Successful. Please Login!
                                        </span>
                                    </FormControl>
                                }
                                <br /><br />
                                <Button variant="contained" color="primary" onClick={this.registerClick}>REGISTER</Button>
                            </TabContainer>
                        }
                    </Modal>

                </div>
            </div>
        )
    }
}

export default Header;