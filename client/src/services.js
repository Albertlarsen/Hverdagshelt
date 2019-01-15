// @flow
import axios from 'axios';
import { User, Issue, Category, Category2, Category3, Company, Event, Type, County } from './classTypes';

axios.interceptors.response.use(response => response.data);


export class UserService {

  addUser(newUser: User): Promise<Response> {
    return axios.post('/add_user', newUser);
  }//end method

  getUserLogin(email: string): Promise<string[]> {
    return axios.get('/verify_user/' + email);
  }//end method

  getUser(mail: string): Promise<User> {

    return axios.get('/user/get_user/' + mail);
  }//end method

  login(userMail: Object<JSON>): Promise<void> {
    return axios.post('/login/', userMail);
  }//end method

  getMyIssues(userMail: string): Promise<JSON> {
    return axios.get('/user/getMyIssues/' + userMail);
  }//end method

  updateUser(user: User): Promise<Response>{
    return axios.put('/user/updateUser', user);
  }

}//end class

export class CategoryService {

  getCategory1(): Promise<Category[]> {
    return axios.get('/get_category1');
  }

  getCategory2(): Promise<Category2[]> {
    return axios.get('/get_category2');
  }

  getCategory3(): Promise<Category3[]> {
    return axios.get('/get_category3');
  }
}

export class CountyService{
  getCounties(): Promise<County[]>{
    return axios.get('/getCounties');
  }
}


export function getAllCounties(usermail: string): Promise<County[]> {
  return axios.get('/getAllCountiesMinusUsers/' + usermail);
}

export function getUsersCounties(usermail: string): Promise<County[]> {
  return axios.get('/getSubscribedCounties/' + usermail);
}

export function deleteSubscription(usermail: string) {
  return axios.delete('/deleteAllSubscribedCounties/' + usermail);
}

export function addSubscription(json: Object) {
  return axios.post('/addSubscription', json);
}

export class MailService {

  sendTextMail(mailObject: Object): Promise<Response> {
    return axios.post('/sendTextMail', mailObject);
  }

  sendResetPasswordMail(to: string): Promise<Response> {
    return axios.post('/sendResetPasswordMail', to);
  }

}