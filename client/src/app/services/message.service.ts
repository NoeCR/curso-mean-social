import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';

@Injectable()
export class MessageService{
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
    addMessage(message): Observable<any>{
        let params = JSON.stringify(message);
        return this._http.post(this.url + 'message', params, {headers: this.headers});
    }
    getMessages(page = 1): Observable<any>{
        return this._http.get(this.url + 'messages/' + page, {headers: this.headers});
    }
    getEmitMessages(page = 1): Observable<any>{
        return this._http.get(this.url + 'emit-messages/' + page, {headers: this.headers});
    }

}