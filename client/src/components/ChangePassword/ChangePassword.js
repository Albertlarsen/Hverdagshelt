import ReactDOM from "react-dom";
import * as React from "react";
import { Component } from "react-simplified";
import { Col, Grid, FormGroup, ControlLabel, FormControl, Button, Form } from "react-bootstrap";
import { UserService, MailService } from "../../services";
import jwt from "jsonwebtoken";
import { User } from "../../classTypes";
import css from './ChangePassword.css';

let userService = new UserService();
let mailService = new MailService();
const bcrypt = require('bcrypt-nodejs');

export class ChangePassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: User,
      oldPassword: '',
      newPassword: '',
      newPassword2: ''
    };
  }

  componentDidMount() {
    userService.getCurrentUser().then(newUser => {
      this.setState({
        user: newUser[0]
      });
    });
  }

  handleOldPassChange(e: Object) {
    this.setState({
      oldPassword: event.target.value
    });
  }

  handleNewPassChange(e: Object) {
    this.setState({
      newPassword: event.target.value
    });
  }

  handleNewPass2Change(e: Object) {
    this.setState({
      newPassword2: event.target.value
    });
  }

  submit() {
    if (this.state.newPassword == this.state.newPassword2) {
      bcrypt.compare(
        this.state.oldPassword,
        this.state.user.password,
        (err, res) => {
          if (res) {
            userService.resetPassword({
              newPassword: this.state.newPassword,
              email: this.state.email
            });
            alert('Passordet ditt er endret');
            console.log(this.state.user.mail);
            mailService.sendTextMail({
              to: this.state.user.mail,
              subject: 'Hverdagshelt - Endring av passord',
              text:
                'Hei ' +
                this.state.user.firstName +
                ', endringen av passordet ditt var vellykket. Om det ikke var deg som forespurte endringen, vennligst ta kontakt med oss'
            });
          } else {
            alert('Feil passord');
          }
        }
      );
    } else {
      alert('Passordene samsvarer ikke');
    }
  }

  render() {
    return (
      <div className="changePassword">
        <Form>
          <FormGroup controlId="formInlineToPassword">
            <ControlLabel>Gammelt passord</ControlLabel>{' '}
            <FormControl
              name="oldPassword"
              onChange={this.handleOldPassChange}
              type="password"
              placeholder="passord"
            />
          </FormGroup>{' '}
          <FormGroup controlId="formInlineToPassword">
            <ControlLabel>Nytt passord</ControlLabel>{' '}
            <FormControl
              name="newPassword"
              onChange={this.handleNewPassChange}
              type="password"
              placeholder="nytt passord"
            />
          </FormGroup>{' '}
          <FormGroup controlId="formInlineToPassword">
            <ControlLabel>Gjenta nytt passord</ControlLabel>{' '}
            <FormControl
              name="newPassword2"
              onChange={this.handleNewPass2Change}
              type="password"
              placeholder="nytt passord"
            />
          </FormGroup>{' '}
          <div align="right">
            <Button onClick={this.submit} bsStyle="primary">
              Lagre nytt passord
            </Button>
          </div>
        </Form>
      </div>
    );
  }
}
