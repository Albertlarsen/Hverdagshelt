// @flow

import express from "express";
import path from "path";
import reload from "reload";
import fs from "fs";
let bodyParser = require('body-parser');
let urlencodedParser = bodyParser.urlencoded({extended: false});
const multer = require("multer");
import { UserDao } from "./daos/userDao";
import categoryController from "./controllers/categoryController.js";
import { CountyDao } from "./daos/countyDao";
import { IssueDao } from "./daos/issueDao";
import userController from "./controllers/userController.js";
import { NotificationSettingsDao } from "./daos/notificationSettingsDao";
import issueController from "./controllers/issueController.js";
import countyController from "./controllers/countyController.js";
import notificationSettingsController from "./controllers/notificationSettingsController";
import statisticsController from "./controllers/statisticsController.js";
import imageRoute from "./controllers/imageRoute.js";
import * as mysql from "mysql2";
import { CategoryDao } from "./daos/catergoryDao";
import mailController from "./controllers/mailController.js";
import { MailDao } from "./daos/mailDao";
import eventController from "./controllers/eventController.js";
import { EventDao } from "./daos/eventDao";
import { EventCategoryDao } from "./daos/eventCategoryDao";
import { StatisticsDao } from "./daos/statisticsDao";
import eventCategoryController from "./controllers/eventCategoryController.js";
import {EmployeeDao} from "./daos/employeeDao";
import employeeController from "./controllers/employeeController"


type Request = express$Request;
type Response = express$Response;

const public_path = path.join(__dirname, "/../../client/public");

let app = express();

app.use(express.static(public_path));
app.use(express.json()); // For parsing application/json

// connect to database
let pool = mysql.createPool({
  connectionLimit: 10,
  // INSERT YOUR DATABASE
});

let userDao = new UserDao(pool);
let countyDao = new CountyDao(pool);
let issueDao = new IssueDao(pool);
let categoryDao = new CategoryDao(pool);
let mailDao = new MailDao(pool);
let notificationSettingsDao = new NotificationSettingsDao(pool);
let employeeDao = new EmployeeDao(pool);
let eventDao = new EventDao(pool);
let eventCategoryDao = new EventCategoryDao(pool);
let statisticsDao = new StatisticsDao(pool);

//fire controllers
issueController(app, issueDao);
categoryController(app, categoryDao);
eventController(app, eventDao);
userController(app, userDao);
countyController(app, countyDao);
categoryController(app, categoryDao);
mailController(app, userDao);
notificationSettingsController(app, notificationSettingsDao);
employeeController(app, employeeDao)
eventCategoryController(app, eventCategoryDao);
statisticsController(app, statisticsDao);
imageRoute(app);

// Hot reload application when not in production environment
if (process.env.NODE_ENV !== "production") {
  let reloadServer = reload(app);
  fs.watch(public_path, () => reloadServer.reload());
}

// The listen promise can be used to wait for the web server to start (for instance in your tests)
export let listen = new Promise<void>((resolve, reject) => {
  app.listen(3000, error => {
    console.log(error);
    if (error) reject(error.message);
    console.log("Server started");
    resolve();
  });
});
