// @flow

import {Dao} from "../dao";

const bcrypt = require('bcrypt'); //to hash password

export class userDao extends Dao {

    addUser(json: Object, callback: Function) {
        let hashed = '';
        bcrypt.hash(json.password,10,function (error,hash) {
            hashed = hash;
        });


        let val = [json.mail, json.typeName, json.phone, hashed, json.countyId];
        super.query(
            "insert into user (mail, typeName, phone, password, points, countyId, active) values(?, ?, ?, ?, 0, ?, 1)",
            val,
            callback
        );
    }
}