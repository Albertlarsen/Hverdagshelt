import React from 'react';
import {
  Navbar,
  Nav,
  NavItem,
  NavDropdown,
  MenuItem
} from 'react-bootstrap';
import css from './NavbarMenu.css';
import { PageHeader } from '../PageHeader/PageHeader';
import jwt from 'jsonwebtoken';
import { User } from '../../classTypes';
import { UserService } from '../../services';
import Glyphicon from 'react-bootstrap/es/Glyphicon';

let userService = new UserService();


let loginButton;
let hverdagsHelt;

export class NavbarMenu extends React.Component {

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);

    this.state = {
      isOpen: false
    };

  }


  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render() {
    if (window.localStorage.getItem('userToken') === '') {
      loginButton = <NavItem eventKey={1} href="/#login">Login</NavItem>;
    } else {
      loginButton = <NavItem eventKey={1} href="/#login" onClick={() => this.logout()}> Log out</NavItem>;
    }//end condition

    return (
        <Navbar collapseOnSelect fluid>
          <Navbar.Header>
            <Navbar.Brand>
              <a href={'/#/wizardForm'}>Hverdagshelt</a>
            </Navbar.Brand>
            <Navbar.Toggle/>
          </Navbar.Header>

      <Nav>
          <NavItem href={'/#/'}><Glyphicon glyph="glyphicon glyphicon-th-list"/> Velg kommune</NavItem>
          <NavItem href={'/#/wizardForm'}><Glyphicon glyph="glyphicon glyphicon-plus"/> Legg til sak</NavItem>
          <NavItem href={'/#/'}><Glyphicon glyph="glyphicon glyphicon-road"/> Eventer</NavItem>
          <NavItem href={'/#/'}><Glyphicon glyph="glyphicon glyphicon-stats"/> Statistikk</NavItem>
          <NavItem href={'/#/'}><Glyphicon glyph="glyphicon glyphicon-question-sign"/> Hjelp</NavItem>
      </Nav>

          <Navbar.Collapse>
            <Nav pullRight>
              <NavDropdown title={'Min side'} id='1'>
                <MenuItem eventKey={2} href="/#min_side/mine_saker">Mine saker</MenuItem>
                <MenuItem eventKey={1} href="/#min_side/kontooversikt">Kontooversikt </MenuItem>
                <MenuItem eventKey={1} href="/#min_side/kommuner">Kommuner</MenuItem>
                <MenuItem eventKey={1} href="/#min_side/varselinstillinger">Varselinstillinger</MenuItem>
              </NavDropdown>
              {loginButton}
            </Nav>
          </Navbar.Collapse>

  </Navbar>
  )
    ;
  }//end method

  logout = () => {
    window.localStorage.setItem('userToken', '');
    loginButton = <NavItem eventKey={1} href="/#login">Login</NavItem>;
  };//end method
}
