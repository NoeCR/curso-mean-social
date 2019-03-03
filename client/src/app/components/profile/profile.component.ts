import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import { Follow } from '../../models/follow';
import { UserService } from '../../services/user.service';
import { FollowService } from '../../services/follow.service';
import { GLOBAL } from '../../services/global';


@Component({
    selector: 'profile',
    templateUrl: './profile.component.html',
    providers: [UserService, FollowService] 
})

export class ProfileComponent implements OnInit {

    public title: string;
    public identity;
    public token;
    public status: string;
    public url: string;
    public stats;
    public user: User;
    public followed;
    public following;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _followService: FollowService
    ){
            this.identity = this._userService.getIdentity();
            this.token = this._userService.getToken();
            this.stats = this._userService.getStats();
            this.url = GLOBAL.url;
            this.title = 'Perfil';
            this.followed = false;
            this.following = false;
    }

    ngOnInit(){
        console.log('Componente sidebar cargado'); 
        this.loadPage();  
    }

    loadPage(){
        this._route.params.subscribe(params => {
            let id = params['id'];            
            this.getUser(id);
            this.getCounters(id);
        });
    }
    getUser(id){
        this._userService.getUser(id).subscribe(
            response => {
                if(response.userDB){
                    console.log(response.value);
                    this.user = response.userDB;
                    if(response.value.following){
                        this.following = true;
                    }else{
                        this.following = false;
                    }
                    if(response.value.followed){
                        this.followed = true;
                    }else{
                        this.followed = false;
                    }
                }else{
                    this.status = 'error';
                }
            }, 
            error => {
                console.log(<any>error);
                this._router.navigate(['/perfil', this.identity._id]);
            }
        );
    }
    getCounters(id){
        this._userService.getCounters(id).subscribe(
            response => {
                console.log(response);
                this.stats = response;
            }, 
            error => {
                console.log(<any>error);
            }
        );
    }
    followUser(followed){
        var follow = new Follow('',this.identity._id, followed);
        this._followService.addFollow(follow).subscribe(
            response =>{
                this.following = true;
            },
            error => {
                console.log(<any>error);
            }
        );
    }
    unfollow(followed){
        this._followService.removeFollow(followed).subscribe(
            response =>{
                this.following = false;
            },
            error => {
                console.log(<any>error);
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
}