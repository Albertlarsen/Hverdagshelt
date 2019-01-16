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
    return (
      <Navbar collapseOnSelect fluid>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="/#/forside">Hverdagshelt</a>
          </Navbar.Brand>
          <Navbar.Toggle/>
        </Navbar.Header>

        <Navbar.Collapse>
          <Nav pullRight>
            <NavDropdown title={'Min side'} id='1'>
              <MenuItem eventKey={2} href="/#min_side/mine_saker">Mine saker</MenuItem>
              <MenuItem eventKey={1} href="/#min_side/kontooversikt">Kontooversikt </MenuItem>
              <MenuItem eventKey={1} href="/#min_side/kommuner">Kommuner</MenuItem>
              <MenuItem eventKey={1} href="/#min_side/varselinstillinger">Varselinstillinger</MenuItem>
            </NavDropdown>
            <NavItem eventKey={1} href="/#login">Login</NavItem>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}


/*



 */