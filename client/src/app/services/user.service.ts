import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { User } from '../models/user';
import { GLOBAL } from './global';



@Injectable()
export class UserService{
    public url:string;
    public identity;
    public token;
    public stats;
    public headers;

    constructor(public _http: HttpClient ){
        this.url = GLOBAL.url;
        this.headers = this.getHeaders();
    }

    getHeaders(){
        let headers =  new HttpHeaders().set('Content-Type', 'application/json')
                                        .set('authorization', this.getToken());
        return headers;
    }
    register(user: User): Observable<any>{
        let params = JSON.stringify(user);
        let headers = new HttpHeaders().set('Content-Type', 'application/json');

        return this._http.post(this.url + 'register', params, {headers});
    }

    signup(user: User, gettoken = null): Observable<any>{
        if(gettoken != null){
            user = Object.assign(user, {gettoken});
        }
        let params = JSON.stringify(user);
        let headers = new HttpHeaders().set('Content-Type', 'application/json');

        return this._http.post(this.url + 'login', params, {headers});
    }

    getIdentity(){
        let identity = JSON.parse(localStorage.getItem('identity'));
        if(identity != 'undefined'){
            this.identity = identity;
        }else{
            this.identity = null;
        }
        return this.identity;
    }

    getToken(){
        let token = JSON.parse(localStorage.getItem('token'));
        if(token != 'undefined'){
            this.token = token;
        }else{
            this.token = null;
        }
        return this.token;
    }

    getCounters(userId = null): Observable<any>{
        let headers =  new HttpHeaders().set('Content-Type', 'application/json')
                                        .set('authorization', this.getToken());
        if(userId != null){
            return this._http.get(this.url + 'counters/' + userId, {headers});
        }else{
            return this._http.get(this.url + 'counters' , {headers});
        }
    }

    getStats(){
        let stats = JSON.parse(localStorage.getItem('stats'));
        if(stats != undefined){
            this.stats = stats;
        }else{
            this.stats = null;
        }
        return this.stats;
    }

    updateUser(user: User): Observable<any>{
        let params = JSON.stringify(user);
        let headers =  new HttpHeaders().set('Content-Type', 'application/json')
                                        .set('authorization', this.getToken());
        return this._http.put(this.url + 'update-user', params, {headers});
    }

    getUsers(page = 1): Observable<any>{
        return this._http.get(this.url + 'users/' + page, {headers: this.headers});
    }

    getUser(id): Observable<any>{
        return this._http.get(this.url + 'user/' + id, {headers: this.headers});
    }
}