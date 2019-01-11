// @flow

import ReactDOM from 'react-dom';
import * as React from 'react';
import {Component} from 'react-simplified';
import {HashRouter, Route, NavLink} from 'react-router-dom';
import {Alert} from './widgets';
import {NavbarMenu} from "./components/NavbarMenu/NavbarMenu";
import {Login} from "./views/login/login";
import {MinSide} from "./views/MinSide/MinSide";
import {ChooseCategory} from "./components/ChooseCategory/ChooseCategory";

// Reload application when not in production environment
if (process.env.NODE_ENV !== 'production') {
    let script = document.createElement('script');
    script.src = '/reload/reload.js';
    if (document.body) document.body.appendChild(script);
}

import createHashHistory from 'history/createHashHistory';
const history = createHashHistory(); // Use history.push(...) to programmatically change path, for instance after successfully saving a student


const root = document.getElementById('root');
if (root)
    ReactDOM.render(
        <HashRouter>
            <div>
                <NavbarMenu/>
                <Alert/>
                <Route path="/login" component={Login} />
                <Route path="/min_side" component={MinSide} />
            </div>
        </HashRouter>,
        root
    );
