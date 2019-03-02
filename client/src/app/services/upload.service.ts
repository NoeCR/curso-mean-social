import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { User } from '../models/user';
import { GLOBAL } from './global';

@Injectable()
export class UploadService{
    public url:string;
    public identity;
    public token;
    public stats;

    constructor(public _http: HttpClient ){
        this.url = GLOBAL.url;
    }
    makeFilesRequest(url: string, params:Array<string>, files:Array<File>, token: string, name: string): Observable<any>{
        const formData: FormData = new FormData();
        
        for(var i=0; i <files.length; i++){
        formData.append(name, files[i], files[i].name);
        }
        let headers = new HttpHeaders().set('Authorization', token);
        return this._http.post(url, formData, {headers});
    }    
}