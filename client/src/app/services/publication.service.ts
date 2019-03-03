import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';

@Injectable()
export class PublicationService{
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
    addPublication(publication): Observable<any>{
        let params = JSON.stringify(publication);

        return this._http.post(this.url + 'publication', params, {headers: this.headers});
    }
    getPublications(page = 1): Observable<any>{
        return this._http.get(this.url + 'publications/' + page, {headers: this.headers});
    }
    getPublicationsUser(id: any, page = 1): Observable<any>{
        return this._http.get(this.url + 'publications-user/' + id +'/' + page, {headers: this.headers});
    }
    removePublication(id: any): Observable<any>{
        return this._http.delete(this.url + 'publication/' + id, {headers: this.headers});
    }
}