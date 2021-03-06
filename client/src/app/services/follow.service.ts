import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';

@Injectable()
export class FollowService{
    public url:string;
    public identity;
    public token;
    public stats;
    public headers;

    constructor(private _http: HttpClient ){
        this.url = GLOBAL.url;
        this.headers = this.getHeaders();
    }

    getHeaders(){
        let headers =  new HttpHeaders().set('Content-Type', 'application/json')
                                        .set('authorization', this.getToken());
        return headers;
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
    getIdentity(){
        let identity = JSON.parse(localStorage.getItem('identity'));
        if(identity != 'undefined'){
            this.identity = identity;
        }else{
            this.identity = null;
        }
        return this.identity;
    }
    addFollow(follow): Observable<any>{
        let params = JSON.stringify(follow);
        return this._http.post(this.url + 'follow', params, {headers: this.headers});
    }
    removeFollow(id): Observable<any>{
        return this._http.delete(this.url + 'unfollow/' + id, {headers: this.headers});
    }
    getFollowing(id, page): Observable<any>{
        var url = this.url + 'following/1';
        if(id != null){
            url = this.url + 'following/' + id + '/' + page;
        }
        return this._http.get(url, {headers: this.headers});
    }
    getFollowers(id, page = 1): Observable<any>{
        var url = this.url + 'followers/1';
        if(id != null){
            url = this.url + 'followers/' + id + '/' + page;
        }
        return this._http.get(url, {headers: this.headers});
    }
    getMyFollows(): Observable<any>{
        return this._http.get(this.url + 'get-follows', {headers: this.headers});
    }
}
