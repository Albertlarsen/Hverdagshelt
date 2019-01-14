// @flow

import ReactDOM from 'react-dom';
import * as React from 'react';
import { Component } from 'react';
import {User} from "../../classTypes";
import {Grid, Row, Col} from 'react-bootstrap';
import {UserService} from "../../services";
import { Alert } from "react-bootstrap"
let jwt = require("jsonwebtoken");


let userService = new UserService();
const bcrypt = require('bcrypt-nodejs');

interface State {
    error: boolean;
    email: string;
    password: string;
    storedPassword: string;
}//end interface

interface Props{}

export class Login extends Component<Props,State>{
    state = {
      error: false,
        email: '',
        password: '',
        storedPassword: '',
    };

    handleChangeEmail = (event: SyntheticEvent<HTMLButtonElement>) => {
        this.setState({
            email: event.target.value,
        })
    };

    handleChangePassword = (event: SyntheticEvent<HTMLButtonElement>) => {
      this.setState({
          password: event.target.value,
      })
    };


    render(){

      let alert_login;
      if(this.state.error){
        alert_login = (
          <Alert bsStyle="danger">
            <h6>Brukernavn eller passord er feil. Prøv igjen!</h6>
          </Alert>)
      } else {
        alert_login = (
          <p></p>
        )
      }
        return(
            <Grid>
                <div className="container text-md-center">
                    <br/>
                    <h2>Login</h2>
                    <br/>
                    <br/>
                    <br/>
                    <form>
                        <Row>
                            <Col>
                                <input placeholder='Email'
                                   type="text"
                                   value={this.state.email}
                                   onChange={this.handleChangeEmail}/>
                            </Col>
                            <Col>
                                <input placeholder='Passord'
                                    type="text"
                                    value={this.state.password}
                                    onChange={this.handleChangePassword}/>
                            </Col>
                        </Row>
                        <Row>
                            <br/>
                            <br/>
                        </Row>
                        <Row>
                            <Col>
                                <button type="button" className="btn btn-dark float-left" onClick={this.save}>
                                Login
                            </button>
                                <button type="button" className="btn btn-dark float-left" onClick={this.sjekk}>
                                    Sjekk
                                </button>
                            </Col>
                            <Col> </Col>
                        </Row>
                        {alert_login}
                    </form>
                </div>
            </Grid>
        )
    }//end method


    save = () =>{
        //console.log(this.state.email);
        userService.getUserLogin(this.state.email).then(response => {
          console.log(response)
            this.setState({
                storedPassword: response[0].password,
            });
            console.log('2')
            bcrypt.compare(this.state.password, response[0].password, (err,res) => {
              console.log('3')
               if(res){
                    userService.login({ userMail : response[0].mail, typeId : response[0].typeName}).then(r => {
                        let token = r.jwt;
                       console.log('hello');
                        window.localStorage.setItem('userToken', token)
                    }).catch((error:Error) => Alert.danger(error.message));
               } else {
                 this.setState({
                   error: true
                 })
               }
            });
        }).catch((error:Error) => {
          console.log(error)
          this.setState({
            error: true
          })
        })
    };//end method

    sjekk = () => {
        let decoded = jwt.verify(window.localStorage.getItem('userToken'), "shhhhhverysecret");
        console.log(decoded.email + '\n' + 'type: ' + decoded.typeId);
        userService.getUser(decoded.email)
            .then(e => {
                console.log(e);
            })
    }

}//end class
