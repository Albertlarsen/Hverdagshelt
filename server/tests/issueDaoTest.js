//import mysql from "mysql2";

let mysql = require("mysql");
import runsqlfile from './runSqlFile';
import {IssueDao} from "../src/daos/issueDao";
import {UserDao} from "../src/daos/userDao";
import {CountyDao} from "../src/daos/countyDao";


// GitLab CI Pool
let pool = mysql.createPool({
  connectionLimit: 2,
  host: "mysql.stud.iie.ntnu.no",
  user: "aadneny",
  password: "W9d7XVXV",
  database: "aadneny",
  debug: false,
  multipleStatements: true
});

let issueDao = new IssueDao(pool);
let userDao = new UserDao(pool);
let countyDao = new CountyDao(pool);

beforeAll(done => {
  runsqlfile("tests/sqlFiles/createTables.sql", pool, () => {
    runsqlfile("tests/sqlFiles/createTestData.sql", pool, done);
  });
});

afterAll(() => {
  pool.end();
});


//ISSUE-TESTING
//-----------------------------------------------------------------
test("check if  issue is exist", done => {
  function callback(status, data) {
    console.log(
      "Test callback: status=" + status + ", data=" + JSON.stringify(data)
    );
    expect(data[0].userMail).toBe("ola@usermail.com");
    done();
  }
  issueDao.getOneIssue(1, callback);
});


test("Add a issue to database", done => {
  function callback(status, data) {
    console.log(
      "Test callback: status=" + status + ", data=" + JSON.stringify(data)
    );
    expect(data.affectedRows).toBeGreaterThanOrEqual(1);
    done();
  }


  let post = {
    userMail: 'ola@usermail.com',
    latitude: 23.234,
    longitude: 40.91,
    address: 'test adresse',
    text: 'TEST',
    pic: 'TEST',
    date: 'TEST',
    statusName: 'In progress',
    categoryId: 1,
    categoryLevel: 1,
    countyId: 2,
    active: 1
  };

  issueDao.addIssue(post, callback);

});


test("check if ola added an issue", done => {
  function callback(status, data) {
    console.log(
      "Test callback: status=" + status + ", data=" + JSON.stringify(data)
    );
    expect(data[0].userMail).toBe("ola@usermail.com");
    expect(data[0].latitude).toBe(23.234);
    expect(data[0].longitude).toBe(40.91);
    expect(data[0].address).toBe('test adresse');
    expect(data[0].text).toBe('TEST');
    expect(data[0].pic).toBe('TEST');
    expect(data[0].date).toBe('TEST');
    expect(data[0].statusName).toBe('In progress');
    expect(data[0].categoryId).toBe(1);
    expect(data[0].categoryLevel).toBe(1);
    expect(data[0].countyId).toBe(2);
    expect(data[0].active).toBe(1);

    done();
  }
  issueDao.getOneIssue(3, callback);
});


test("check if one of olas issues have county in Trondheim", done => {
  function callback(status, data) {
    console.log(
      "Test callback: status=" + status + ", data=" + JSON.stringify(data)
    );
    expect(data[0].userMail).toBe("ola@usermail.com");
    expect(data[0].latitude).toBe(23.234);
    expect(data[0].longitude).toBe(40.91);
    expect(data[0].address).toBe('test adresse');
    expect(data[0].text).toBe('TEST');
    expect(data[0].pic).toBe('TEST');
    expect(data[0].date).toBe('TEST');
    expect(data[0].statusName).toBe('In progress');
    expect(data[0].categoryId).toBe(1);
    expect(data[0].categoryLevel).toBe(1);
    expect(data[0].countyId).toBe(2);
    expect(data[0].active).toBe(1);
    expect(data[0].active).toBe(1);
    expect(data[0].name).toBe('Trondheim');
    done();
  }
  issueDao.getIssueAndCounty(3, callback);
});


test("check get all issues from one user", done => {
  function callback(status, data) {
    console.log(
      "Test callback: status=" + status + ", data=" + JSON.stringify(data)
    );
    expect(data.length).toBe(2);
    expect(data[0].issueId).toBe(1);
    expect(data[1].issueId).toBe(3);
    expect(data[0].text).toBe('en tekst');
    expect(data[1].text).toBe('TEST');

    done();
  }
  issueDao.getUserIssue('ola@usermail.com', callback);
});


test("check all issues a company have", done => {
  function callback(status, data) {
    console.log(
      "Test callback: status=" + status + ", data=" + JSON.stringify(data)
    );
    expect(data.length).toBe(1);
    expect(data[0].issueId).toBe(1);

    done();
  }
  issueDao.getCompanyIssue('company1@company.com', callback);
});


test("check all issues with one category", done => {
  function callback(status, data) {
    console.log(
      "Test callback: status=" + status + ", data=" + JSON.stringify(data)
    );
    expect(data.length).toBe(3);
    done();
  }
  issueDao.getCategoryIssue(1, callback);
});




//USER-TESTING
//-----------------------------------------------------------------

test("Add a user nina@usermail.com to database", done => {
  function callback(status, data) {
    console.log(
      "Test callback: status=" + status + ", data=" + JSON.stringify(data)
    );
    expect(data.affectedRows).toBeGreaterThanOrEqual(1);
    done();
  }

  let post = {
    mail: 'nina@usermail.com',
    firstName: 'TEST ',
    lastName: 'TEST ',
    typeName: 'Private-user',
    phone: 'TEST ',
    points: 0,
    countyId: 1,
    active: 1
  };

  userDao.addUser(post,'hashedpassword..', callback);
});

//Kan legge inn getUserLogin men er veldig lik som getUser

test("check if nina@usermail.com is added as user", done => {
  function callback(status, data) {
    console.log(
      "Test callback: status=" + status + ", data=" + JSON.stringify(data)
    );
    expect(data[0].mail).toBe('nina@usermail.com');
    expect(data[0].county).toBe('Oslo');
    done();
  }
  userDao.getUser('nina@usermail.com', callback);
});



test("check get all issues from one user", done => {
  function callback(status, data) {
    console.log(
      "Test callback: status=" + status + ", data=" + JSON.stringify(data)
    );
    expect(data.length).toBe(0);
    done();
  }
  userDao.getIssuesForOneUser('nina@usermail.com', callback);
});



test("check resetPassword", done => {
  function callback(status, data) {
    console.log(
      "Test callback: status=" + status + ", data=" + JSON.stringify(data)
    );
    expect(data.affectedRows).toBeGreaterThanOrEqual(1);
  }
  function callback2(status, data) {
    console.log(
      "Test callback: status=" + status + ", data=" + JSON.stringify(data)
    );
    expect(data[0].password).toBe('passord123');

    done();
  }
  userDao.resetPassword('nina@usermail.com','passord123', callback);
  userDao.getUser('nina@usermail.com', callback2);
});

test("check update user", done => {
  function callback(status, data) {
    console.log(
      "Test callback: status=" + status + ", data=" + JSON.stringify(data)
    );
    expect(data.affectedRows).toBeGreaterThanOrEqual(1);

  }

  function callback2(status, data) {
    console.log(
      "Test callback: status=" + status + ", data=" + JSON.stringify(data)
    );
    expect(data[0].firstName).toBe('Nina');
    expect(data[0].lastName).toBe('Larsen');
    expect(data[0].phone).toBe('90192384');

    done();
  }

  let post = {
    firstName: 'Nina',
    lastName: 'Larsen',
    phone: '90192384',
    countyId: 2,
    mail: 'nina@usermail.com',
  };

  userDao.updateUser(post, callback);
  userDao.getUser('nina@usermail.com', callback2);
});

//Finner ikke getCompany hvor er den eller skal den legges til?
test("check add company", done => {
  function callback(status, data) {
    console.log(
      "Test callback: status=" + status + ", data=" + JSON.stringify(data)
    );
    expect(data.affectedRows).toBeGreaterThanOrEqual(1);
    done();
  }

  let post = {
    companyMail: 'hverdagshelt@company.com',
    companyName: 'Hverdagshelt',
    firstName: 'Thea',
    lastName: 'Pettersen',
    adresse: 'adresseveien 65',
    postnr: 1234,
    phone:'19283028',
    description:'dette er en beskrivelse',
    orgNumber:2345678,
  };

  userDao.addCompany(post,'detteErEtPassord', callback);
});





//COUNTY-TESTING
//-----------------------------------------------------------------


test("check get all counties", done => {
  function callback(status, data) {
    console.log(
      "Test callback: status=" + status + ", data=" + JSON.stringify(data)
    );
    expect(data.length).toBe(3);
    done();
  }
  countyDao.getAllCounties(callback);
});


test("check add subscription counties", done => {
  function callback(status, data) {
    console.log(
      "Test callback: status=" + status + ", data=" + JSON.stringify(data)
    );
    expect(data.affectedRows).toBeGreaterThanOrEqual(1);
  }

  function callback2(status, data) {
    console.log(
      "Test callback: status=" + status + ", data=" + JSON.stringify(data)
    );
    expect(data[0].countyId).toBe(2);

    expect(data[0].name).toBe('Trondheim');
    done();
  }

  let post = {
  userMail: 'kari@usermail.com',
  countyId: 2,
  };

  countyDao.addSubscription(post, callback);
  countyDao.getSubscribedCounties('kari@usermail.com',callback2);
});



test("check get all counties where the user that the user dos not subscribe to", done => {
  function callback(status, data) {
    console.log(
      "Test callback: status=" + status + ", data=" + JSON.stringify(data)
    );
    expect(data.length).toBe(2);
    expect(data[0].name).toBe('Oslo');
    expect(data[1].name).toBe('Kristiansand');
    done();
  }

  countyDao.getAllCountiesMinusUsers('kari@usermail.com',callback);
});



test("check delete all subscribed counties for one user", done => {
  function callback(status, data) {
    console.log(
      "Test callback: status=" + status + ", data=" + JSON.stringify(data)
    );
    expect(data.affectedRows).toBeGreaterThanOrEqual(1);
  }

  function callback2(status, data) {
    console.log(
      "Test callback: status=" + status + ", data=" + JSON.stringify(data)
    );
    expect(data.length).toBe(0);
    done();
  }

  countyDao.deleteAllSubscribedCounties('kari@usermail.com',callback);
  countyDao.getSubscribedCounties('kari@usermail.com',callback2);
});



test("check add countysubscription for companies", done => {
  function callback(status, data) {
    console.log(
      "Test callback: status=" + status + ", data=" + JSON.stringify(data)
    );
    expect(data.affectedRows).toBeGreaterThanOrEqual(1);
    done();
  }

  let post = {
    companyMail: 'company1@company.com',
    countyId: 1,
  };
  countyDao.addCompanySubscription(post,callback);
});

//CATEGORY-TESTING
//-----------------------------------------------------------------




//EVENT-TESTING
//-----------------------------------------------------------------
