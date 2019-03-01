import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import { Follow } from '../../models/follow';
import { UserService } from '../../services/user.service';
import { GLOBAL } from '../../services/global';
import { FollowService } from '../../services/follow.service';



@Component({
    selector: 'users',
    templateUrl: './users.component.html',
    providers: [UserService, FollowService] 
})

export class UsersComponent implements OnInit {

    public title: string;
    public identity;
    public token;
    public page: number;
    public next_page: number;
    public prev_page: number;
    public status: string;
    public total: number;
    public pages: number;
    public users: User[];
    public url: string;
    public follows;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _followService: FollowService
    ){
            this.title = 'Gente';           
            this.identity = this._userService.getIdentity();
            this.token = this._userService.getToken();
            this.page = 1;
            this.next_page = 2;
            this.prev_page= 1;
            this.url = GLOBAL.url;
           
    }

    ngOnInit(){
        console.log('Componente edit user cargado');
        this.actualPage();
    }

    actualPage(){
        this._route.params.subscribe(params => {
            let page = +params['page'];
            
            if(page >= 1){
                this.page = page;
                this.next_page = page + 1;
                this.prev_page= page -1;
            }

            this.getUsers(this.page);
        });
    }

    getUsers(page){
        this._userService.getUsers(page).subscribe(
            response => {
                if(!response.usersDB){
                    this.status = 'error';
                }else{
                    this.total = response.total;
                    this.pages = response.pages;
                    this.users = response.usersDB;
                    this.follows = response.users_following;
                    console.log(this.follows);
                    if(page > this.pages){
                        this._router.navigate(['/users', 1]);
                    }
                }
            }, 
            error => {
                console.log(<any>error);
                this.status = 'error';
            }
        );
    }
    public followUserOver;
    mouseEnter(user_id){
        this.followUserOver = user_id;
    }
    mouseLeave(user_id){
        this.followUserOver =0;
    }
    followUser(followed){
        var follow = new Follow('', this.identity._id, followed);
        this._followService.addFollow(follow).subscribe(
            response =>{
                if(!response.follow){
                    this.status = 'error';
                }else{
                    this.status = 'success';
                    this.follows.push(followed);
                }   
            },
            error => {
                console.log(<any>error);
                this.status = 'error';
            }
        );
    }
    unfollowUser(followed){
        this._followService.removeFollow(followed).subscribe(
            response => {
                var search = this.follows.indexOf(followed);
                if(search != -1){
                    this.follows.splice(search,1);
                }
            }, 
            error => {
                console.log(<any>error);
                this.status = 'error';
            }
        );
    }
}