import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import { Follow } from '../../models/follow';
import { UserService } from '../../services/user.service';
import { GLOBAL } from '../../services/global';
import { FollowService } from '../../services/follow.service';



@Component({
    selector: 'followed',
    templateUrl: './followed.component.html',
    providers: [UserService, FollowService] 
})

export class FollowedComponent implements OnInit {

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
    public following;
    public followers: Array<any>;
    public userPageId;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _followService: FollowService
    ){
            this.title = 'Seguidores';           
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
            let id = params['id'];
            this.userPageId = id;
            if(page >= 1){
                this.page = page;
                this.next_page = page + 1;
                this.prev_page= page -1;
            }

            this.getFollows(id, this.page);
        });
    }

    getFollows(userId, page){
        this._followService.getFollowers(userId, page).subscribe(
            response => {
                console.log(response);
                this.pages = response.pages;
                this.followers = response.followers;
                this.following = response.users_following;
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
        this.followUserOver = 0;
    }
    followUser(followed){
        var follow = new Follow('', this.identity._id, followed);
        this._followService.addFollow(follow).subscribe(
            response =>{
                if(!response.follow){
                    this.status = 'error';
                }else{
                    this.status = 'success';
                    this.following.push(followed);
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
                var search = this.following.indexOf(followed);
                if(search != -1){
                    this.following.splice(search,1);
                }
            }, 
            error => {
                console.log(<any>error);
                this.status = 'error';
            }
        );
    }
}