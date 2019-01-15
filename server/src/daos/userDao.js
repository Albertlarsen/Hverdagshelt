// @flow

import { Dao } from '../dao';

const bcrypt = require('bcrypt-nodejs'); //to hash password

export class UserDao extends Dao {

  addUser(json: Object, hashed: string, callback: Function) {
    let val = [json.mail, json.firstName, json.lastName, hashed, json.typeName, json.phone, json.countyId];
    super.query(
      'insert into user (mail, firstName, lastName, password, typeName, phone, points, countyId, active) values(?, ?, ?, ?, ?, ?, 0, ?, 1)',
      val,
      callback);
  }//end method

  getUserLogin(userMail: string, callback: Function) {
    super.query('select mail, password, typeName from user where mail=? ', [userMail], callback);
  }//end method

  getUser(userMail: string, callback: Function) {
    super.query('SELECT countyId, active, mail, firstName, lastName, password, typeName, phone, points, name AS \'county\' FROM user NATURAL JOIN county where mail=? ', [userMail], callback);
  }//end method}

  getIssuesForOneUser(userMail: string, callback: Function) {
    super.query('select categoryId, issues.active, issueId, userMail, latitude, longitude, text, pic, ' +
      'date, statusName, countyId, name as \'category\', priority from issues ' +
      'natural join category where userMail=\'per@usermail.com\' and active=1', [userMail], callback);
  }//end method

  resetPassword(json: Object, hashed: string, callback: Function) {
    let val = [hashed, json];
    console.log('maildao',val);
    super.query(
      ' UPDATE user SET password=? WHERE user.mail=?',
      val,
      callback);

  }//end method

  updateUser(json: Object , callback: Function) {
    let val = [json.firstName, json.lastName, json.phone, json.countyId, json.mail];
    super.query(
      'UPDATE user SET firstName =?, lastName=?, phone=?, countyId=? WHERE user.mail =?',
      val,
      callback);
  }

}
