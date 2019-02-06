//import mysql from "mysql2";

let mysql = require("mysql");
import runsqlfile from './runSqlFile';
import {IssueDao} from "../src/daos/issueDao";
import {UserDao} from "../src/daos/userDao";
import {CountyDao} from "../src/daos/countyDao";
import {CategoryDao} from "../src/daos/catergoryDao";
import {EventDao} from '../src/daos/eventDao';
import {EventCategoryDao} from '../src/daos/eventCategoryDao';
import {MailDao} from '../src/daos/mailDao';
import {NotificationSettingsDao} from '../src/daos/notificationSettingsDao';
import {StatisticsDao} from '../src/daos/statisticsDao'
import {EmployeeDao} from '../src/daos/employeeDao';

// GitLab CI Pool
let pool = mysql.createPool({
  connectionLimit: 1,
  //INSERT YOUR DATABASE
});




beforeAll(done => {
  runsqlfile("tests/sqlFiles/createTables.sql", pool, () => {
    runsqlfile("tests/sqlFiles/createTestData.sql", pool, done());
  });
});

afterAll(() => {
  pool.end();
});




let issueDao = new IssueDao(pool);
let userDao = new UserDao(pool);
let countyDao = new CountyDao(pool);
let categoryDao = new CategoryDao(pool);
let eventCategoryDao = new EventCategoryDao(pool);
let notificationSettingsDao = new NotificationSettingsDao(pool);
let mailDao = new MailDao(pool);
let statisticDao = new StatisticsDao(pool);
let employeeDao = new EmployeeDao(pool);


//ISSUE-TESTING
//-----------------------------------------------------------------




test("check all issues with one category",done => {
  function callback(status, data) {

    console.log(
      "Test callback: status=" + status + ", data=" + JSON.stringify(data)
    );
   expect(data.length).toBe(2);
   done();
  }

  issueDao.getCategoryIssue(1, callback);
});

 test("check get all issue", done => {
  function callback1(status, data) {
    console.log(
      "Test callback: status=" + status + ", data=" + JSON.stringify(data)
    );
    expect(data.length).toBe(2);
    done();

  };
  issueDao.getAllIssues(callback1);
});


test("check if issue exist", done => {
  function callback2(status, data) {
    console.log("Test callback: status=" + status + ", data=" + JSON.stringify(data));
    expect(data[0].issueId).toBe(1);
    expect(data[0].statusName).toBe('In progress');
    expect(data[0].userMail).toBe('ola@usermail.com');
    done();
  }
  issueDao.getOneIssue(1, callback2);
});


test("Add a issue to database", done => {
  function callback(status, data) {
    console.log(
      "Test callback: status=" + status + ", data=" + JSON.stringify(data)
    );
    expect(data.affectedRows).toBeGreaterThanOrEqual(1);
    done()
  }

  let post = {
    "userMail": 'ola@usermail.com',
    "latitude": 23.234,
    "longitude": 40.91,
    "address": 'test adresse',
    "text": 'TEST',
    "pic": 'TEST',
    "date": 'TEST',
    "statusName": 'In progress',
    "categoryId": 1,
    "categoryLevel": 1,
    "countyId": 2,
  };

  issueDao.addIssue(post, callback);

});


test("check if ola added an issue",done=> {
  function callback(status, data) {
    console.log(
      "Test callback: status=" + status + ", data=" + JSON.stringify(data)
    );
    expect(data[0].issueId).toBe(3);
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


test("check if one of olas issues have county in Trondheim",done=> {
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


test("check get all issues from one user", done=> {
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




test("check adding a comment to issue", done => {
  function callback(status,data){
    console.log("Test adding comment to issue. Status: " + status + ". Data: " + JSON.stringify(data));
    expect(data.affectedRows).toBe(1);
    done();
  }
  issueDao.addCommentToIssue(1, 'TEST', '7heaven@companymail.com', callback);
});


test("check getting comments for an issue", done => {
  function callback(status,data) {
    console.log("Test getting comments for issue. Status: " + status + ". Data: " + JSON.stringify(data));
    expect(data.length).toBeGreaterThanOrEqual(1);
    done();
  }
  issueDao.getCompanyComments(1,callback);
});

test("check getting all issues in one county", done => {
  function callback(status,data) {
    console.log("Testing getting issues in one county. Status: " + status + ". Data: " + JSON.stringify(data));

    expect(data.length).toBeGreaterThanOrEqual(0);
    done();
  }
   issueDao.getAllIssuesInCounty(2,1,callback);
});

test("check deleting one issue", done => {
  function callback(status,data) {
    console.log("Testing deleting one issue. Status: " + status + ", Data: " + data);
    expect(data.affectedRows).toBe(1);
    done();
  }
  issueDao.deleteIssue(1,callback);
});




//USER-TESTING
//-----------------------------------------------------------------

 test("Add a user nina@usermail.com to database",done => {
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



  test("check get all issues from one user",done => {
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
    };

    userDao.updateUser('nina@usermail.com', post,callback);
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



  test("check add points to user" ,done =>{
    function callback(status, data) {
      console.log(
        "Test callback: status=" + status + ", data=" + JSON.stringify(data)
      );
      expect(data.affectedRows).toBe(1);
      done();
    }

    let post={
      userMail: 'ola@usermail.com',
      points: 10,
    };

    userDao.updatePoints(post, callback);
  });


  test("check get county employee" , done=>{
    function callback(status, data) {
      console.log(
        "Test callback: status=" + status + ", data=" + JSON.stringify(data)
      );
      expect(data[0].firstName).toBe("Thea");
      expect(data[0].lastName).toBe("Larsen");
      expect(data[0].mail).toBe("thea@usermail.com");
      done();
    }


     userDao.getCountyEmployee(1, callback);
  });

test("check get user login" , done=>{
  function callback(status, data) {
    console.log(
      "Test callback: status=" + status + ", data=" + JSON.stringify(data)
    );
    expect(data[0].password).toBe("123");
    expect(data[0].countyId).toBe(1);
    done();
  }


  userDao.getUserLogin("thea@usermail.com", callback);
});

test("check get home county" , done=>{
  function callback(status, data) {
    console.log(
      "Test callback: status=" + status + ", data=" + JSON.stringify(data)
    );
    expect(data[0].countyId).toBe(1);
    expect(data[0].name).toBe("Oslo");
    done();
  }

  userDao.getHomeCounty("thea@usermail.com", callback);
});


test("check all issues from one company" , done=>{
  function callback(status, data) {
    console.log(
      "Test callback: status=" + status + ", data=" + JSON.stringify(data)
    );
    expect(data.length).toBe(1);
    expect(data[0].issueId).toBe(2);
    expect(data[0].statusName).toBe("Registered");
    done();
  }

  userDao.getCompanyIssues("company2@company.com", callback);
});




//COUNTY-TESTING
//-----------------------------------------------------------------


test("check get all counties", done=> {
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
    expect(data.length).toBe(2);

    expect(data[0].name).toBe('Oslo');
    expect(data[1].name).toBe('Trondheim');
    done();
  }

  let post = {
  countyId: 2,
  };

  countyDao.addSubscription('kari@usermail.com',post, callback);
  countyDao.getSubscribedCounties('kari@usermail.com',callback2);
});



test("check get all counties where the user that the user dos not subscribe to", done => {
  function callback(status, data) {
    console.log(
      "Test callback: status=" + status + ", data=" + JSON.stringify(data)
    );
    expect(data.length).toBe(1);
    expect(data[0].name).toBe('Kristiansand');
    done();
  }

   countyDao.getAllCountiesMinusUsers('kari@usermail.com',callback);
});



test("check delete all subscribed counties for one user", done=> {
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

test("check get all from category1", done=> {
  function callback(status, data) {
    console.log(
      "Test callback: status=" + status + ", data=" + JSON.stringify(data)
    );
    expect(data.length).toBe(2);
    expect(data[0].name).toBe('Strøm');
    expect(data[1].name).toBe('Vann og avløp');
    expect(data[0].priority).toBe(1);
    expect(data[1].priority).toBe(2);
    done();
  }

   categoryDao.getCategory1(callback);
});


test("check get all from category2", done => {
  function callback(status, data) {
    console.log(
      "Test callback: status=" + status + ", data=" + JSON.stringify(data)
    );
    expect(data.length).toBe(2);
    expect(data[0].name).toBe('Strømbrudd');
    expect(data[1].name).toBe('Vannstopp');

    expect(data[0].categoryId).toBe(1);
    expect(data[1].categoryId).toBe(2);
    done();
  }

   categoryDao.getCategory2(callback);
});


test("check add one to category1 and get one from category1", done=> {
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
    expect(data[0].name).toBe('Brann');
    expect(data[0].priority).toBe(1);
    done();
  }

  let post = {
    name: 'Brann',
    priority: 1,
  };

  categoryDao.addCategory1(post,callback);
   categoryDao.getOneCategory1(3, callback2);

});


test("check add one to category2 and get one from category2", done => {
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
    expect(data[0].name).toBe('Brann i skogen');
    expect(data[0].categoryId).toBe(3);
    done();
  }

  let post = {
    categoryId:3,
    name: 'Brann i skogen',
  };

  categoryDao.addCategory2(post,callback);
  categoryDao.getOneCategory2(3, callback2);

});

test("check add categories to a company", done => {
  function callback(status, data) {
    console.log(
      "Test callback: status=" + status + ", data=" + JSON.stringify(data)
    );
    expect(data.affectedRows).toBeGreaterThanOrEqual(1);
    done();
  }

  let post = {
    companyMail:'company1@company.com',
    categoryId: 2,
  };

   categoryDao.addCompanyCategories(post, callback);
});


//EVENTCATEGORYY-TESTING
//-----------------------------------------------------------------
test("check get all eventCategories", done => {
  function callback(status, data) {
    console.log(
      "Test callback: status=" + status + ", data=" + JSON.stringify(data)
    );
    expect(data.length).toBe(1);
    done();
    //expect(data.length).toBeGreaterThanOrEqual(1);
  }

  eventCategoryDao.getEventCategory(callback);
});

let eventDao = new EventDao(pool);
//EVENT-TESTING
//-----------------------------------------------------------------

test("check get 10 newest events", done => {
  function callback(status, data) {
    console.log(
      "Test callback: status=" + status + ", data=" + JSON.stringify(data)
    );
    expect(data.length).toBeLessThanOrEqual(10);
    expect(data.length).toBe(0);
    done();
  }

   eventDao.get10newestEvents(1,callback);
});


test("check add event", done=> {
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
    expect(data.length).toBe(2);
    expect(data[0].title).toBe('Konsert på Solsiden');
    done();
  }
  let post = {
      title:'Konsert på Solsiden',
      text:'kl 18:00-23:00 den 21.01 vil det være trafikk inn og ut av Solsiden',
      latitude:45.12,
      longitude:27.23,
      date:'21.01.2019',
      userMail:'kari@usermail.com',
      countyId:2,
      eventCategoryId:1,

  };
  eventDao.addEvent(post,callback);
  eventDao.get10newestEvents(2,callback2);
});


test("check get event", done => {
  function callback(status, data) {
    console.log(
      "Test callback: status=" + status + ", data=" + JSON.stringify(data)
    );

    expect(data[0].title).toBe("Veiarbeid i midtbyen");
    expect(data[0].userMail).toBe("ola@usermail.com");
    expect(data[0].countyId).toBe(2);
    done();
  }
  eventDao.getEvent(1,callback);
});

test("check get all events in one county", done => {
  function callback(status, data) {
    console.log(
      "Test callback: status=" + status + ", data=" + JSON.stringify(data)
    );

    expect(data.length).toBe(2);
    expect(data[0].eventId).toBe(3);
    expect(data[1].eventId).toBe(1);
    done();
  }
  eventDao.getAllEventsInOneCounty(2,callback);
});


test("check delete one event", done => {
  function callback(status, data) {
    console.log(
      "Test callback: status=" + status + ", data=" + JSON.stringify(data)
    );

  }
  function callback2(status, data) {
    console.log(
      "Test callback: status=" + status + ", data=" + JSON.stringify(data)
    );
    expect(data.length).toBe(1);

    done();
  }
  eventDao.deleteEvent(3,callback);
  eventDao.getAllEventsInOneCounty(2, callback2);
});


test("check update one event", done => {
  function callback(status, data) {
    console.log(
      "Test callback: status=" + status + ", data=" + JSON.stringify(data)
    );
    expect(data.affectedRows).toBe(1);
  }
  function callback2(status, data) {
    console.log(
      "Test callback: status=" + status + ", data=" + JSON.stringify(data)
    );
    expect(data[0].title).toBe("HeiHei");
    expect(data[0].text).toBe("dette er en heihei tekst");
    done();
  }

  let val={
    title: "HeiHei",
    text:"dette er en heihei tekst",
    eventCategoryId:1,
    eventId:2,
  };

  eventDao.updateEvent(val,callback);
  eventDao.getEvent(2, callback2);
});

//NOTIFICATION SETTINGS-TESTING
//-----------------------------------------------------------------


test("check add notificationsettings(pushalert)",done => {
   function callback(status, data) {
    console.log(
      "Test callback: status=" + status + ", data=" + JSON.stringify(data)
    );
    expect(data.affectedRows).toBe(1);
  }

 function callback2(status, data) {
    console.log(
      "Test callback: status=" + status + ", data=" + JSON.stringify(data)
    );
    expect(data.length).toBe(1);
    expect(data[0].categoryId).toBe(1);
    expect(data[0].countyId).toBe(1);
    expect(data[0].name).toBe('Konsert');
    done();
 }

  let post = {
    countyId:1,
    categoryId: 1,
  };

  notificationSettingsDao.addNotificationSettings('ola@usermail.com',post,callback);
  notificationSettingsDao.getNotificationSettings('ola@usermail.com', callback2);
});


test("check add notificationsettings(pushalert) check get simple", done => {
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
    expect(data.length).toBe(2);
    expect(data[1].categoryId).toBe(2);
    expect(data[1].countyId).toBe(2);
    done();
  }


  let post2 = {
    countyId:2,
    categoryId: 2,
  };
  notificationSettingsDao.addNotificationSettings('kari@usermail.com',post2,callback);
   notificationSettingsDao.getNotificationSettingsSimple('kari@usermail.com', callback2);

});



test("check get pushalert with name on county and category", done => {
  function callback(status, data) {
    console.log(
      "Test callback: status=" + status + ", data=" + JSON.stringify(data)
    );

    expect(data[0].categoryId).toBe(1);
    expect(data[0].countyId).toBe(1);
    expect(data[0].categoryName).toBe('Strøm');
    expect(data[0].countyName).toBe('Oslo');
    done();
  }


   notificationSettingsDao.getNotificationSettingsWithNames('kari@usermail.com',callback);
});


test("check delete pushalert",done => {
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

  notificationSettingsDao.deleteNotificationSettings('kari@usermail.com',callback);
  notificationSettingsDao.getNotificationSettingsSimple(2,callback2);
});




test("check add notification", done => {
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
    expect(data.length).toBe(1);
    expect(data[0].registered).toBe(1);
    expect(data[0].inProgress).toBe(1);
    expect(data[0].completed).toBe(0);
    done();
  }


  let post = {
    registered: true,
    inProgress:true,
    completed:false,
  };

  notificationSettingsDao.addIssueNotificationSettings('kari@usermail.com',post,callback);
  notificationSettingsDao.getIssueNotificationSettings('kari@usermail.com',callback2);
});



test("check update notification", done => {
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
    expect(data.length).toBe(1);
    expect(data[0].registered).toBe(1);
    expect(data[0].inProgress).toBe(1);
    expect(data[0].completed).toBe(1);
    done();
  }


  let post = {
    registered: true,
    inProgress:true,
    completed:true,
  };

   notificationSettingsDao.updateIssueNotificationSettings('kari@usermail.com',post,callback);
  notificationSettingsDao.getIssueNotificationSettings('kari@usermail.com',callback2);
});




//MAIL-TESTING
//-----------------------------------------------------------------



test("check reset password", done => {
  function callback(status, data) {
    console.log(
      "Test callback: status=" + status + ", data=" + JSON.stringify(data)
    );
    expect(data.affectedRows).toBeGreaterThanOrEqual(1);
    done();
  }


   mailDao.resetPassword('ola@usermail.com','detteErEtNyttPassord',callback);
});


//Statistic-TESTING
//-----------------------------------------------------------------

test("check get statusName from issues and numbers of each", done => {
  function callback(status, data) {
    console.log(
      "Test callback: status=" + status + ", data=" + JSON.stringify(data)
    );
    expect(data[0].statusName).toBe('Registered');
    expect(data[0].ant).toBe(1);

    done();
  }
   statisticDao.getNumberStatus(1,callback);
});



//Employee-TESTING
//-----------------------------------------------------------------
test("check get statusName from issues and numbers of each", done => {
  function callback(status, data) {
    console.log(
      "Test callback: status=" + status + ", data=" + JSON.stringify(data)
    );
    expect(data.length).toBe(1);
    done();
  }
  employeeDao.getUsersInCountyAdmin(2,callback);
});



test("check get statusName from issues and numbers of each", done => {
  function callback(status, data) {
    console.log(
      "Test callback: status=" + status + ", data=" + JSON.stringify(data)
    );

  }

  function callback2(status, data) {
    console.log(
      "Test callback: status=" + status + ", data=" + JSON.stringify(data)
    );
    expect(data.length).toBe(0);
    done();
  }
  employeeDao.blockUser("thea@usermail.com",callback);
  userDao.getUser("thea@usermail.com", callback2);
});

