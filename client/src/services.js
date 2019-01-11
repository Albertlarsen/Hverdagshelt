// @flow
import axios from 'axios';
import {User, Issue, Category, Company, Event, Type, County} from "./classTypes";

axios.interceptors.response.use(response => response.data);



export class UserService {

    addUser(newUser: User): Promise<Response> {
        return axios.post('/add_user', newUser);
    }//end method

    getUserLogin(email: string): Promise<string[]>{
        return axios.get('/verify_user/' + email);
    }//end method

    getUser(mail: string): Promise<User>{
        return axios.get('/user/get_user/' +  mail);
    }//end method

    login(userMail: Object<JSON>): Promise<void>{
        return axios.post('/login/', userMail);
    }//end method

}//end class

export class MyPage{



}

export function getAllCounties(usermail:string): Promise<County[]> {
    return axios.get('/getAllCountiesMinusUsers/'+ usermail);
}

export function getUsersCounties(usermail: string): Promise<County[]>{
    return axios.get('/getSubscribedCounties/'+ usermail);
}

export function deleteSubscription(usermail: string){
    return axios.delete('/deleteAllSubscribedCounties/'+ usermail);
}

export function addSubscription(json: Object){
    return axios.post('/addSubscription', json);
}


