import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  providers: [UserService]
})
export class LoginComponent implements OnInit{
    public title:string;
    public user: User;
    public status: string;
    public identity;
    public token;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService
    ){
            this.title = 'Identificate';
            this.user = new User("", "", "", "", "", "", "ROLE_USER", "");
    }
    ngOnInit(){
        console.log('Componente del login cargado');
    }
 
    onSubmit(form){
        this._userService.signup(this.user).subscribe(
            response => {
                if(response.user){
                    this.identity = response.user;
                    if(!this.identity || !this.identity._id){
                        this.status = 'error';
                    }else{
                        // Persistir datos usuario en LocalStorage
                        localStorage.setItem('identity', JSON.stringify(this.identity));
                        // Conseguir token
                        this.getToken();
                    }                    
                    form.reset();
                    console.log(response.user);
                }else{
                    this.status = 'error';
                }
            }, 
            error => {
                this.status = 'error';
                console.log(<any>error);
            }
        );
    }
    getToken(){
        this._userService.signup(this.user, 'true').subscribe(
            response => {               
                this.token = response.token;
                if(this.token.length <= 0){
                    this.status = 'error';
                }else{
                    // Persistir Token usuario en LocalStorage
                    localStorage.setItem('token', JSON.stringify(this.token));
                    // Consegui los contadores 
                    this.getCounters();                   
                }                      
            }, 
            error => {
                this.status = 'error';
                console.log(<any>error);
            }
        );
    }
    getCounters(){
        this._userService.getCounters().subscribe(
            response => {
                localStorage.setItem('stats', JSON.stringify(response));
                this.status = 'success';
                this._router.navigate(['/']);
            }, 
            error => {
                this.status = 'error';
                console.log(<any>error);
            }
        );
    }
}