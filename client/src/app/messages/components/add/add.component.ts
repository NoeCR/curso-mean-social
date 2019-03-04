import { Component, OnInit, DoCheck } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FollowService } from '../../../services/follow.service';
import { Message } from '../../../models/message';
import { MessageService } from '../../../services/message.service';
import { UserService } from '../../../services/user.service';

@Component({
    selector: 'add',
    templateUrl: './add.component.html',
    providers: [FollowService, MessageService, UserService]
})
export class AddComponent implements OnInit {

    public title: string;
    public message: Message;
    public identity;
    public token;
    public url: string;
    public status;
    public follows;

    constructor(
        private _rute: ActivatedRoute,
        private _router: Router,
        private _followService: FollowService,
        private _messageService: MessageService,
        private _userService: UserService
    ){
            this.title = 'Enviar mensaje';
            this.identity = this._userService.getIdentity();
            this.token = this._userService.getToken(); 
            this.message = new Message("","", false,"", this.identity._id, "");            
    }

    ngOnInit(){
        console.log('Componente add cargado');
        this.getMyFollows();
    }

    onSubmit(form){
        this._messageService.addMessage(this.message).subscribe(
            response => {
                if(response.messageStored){
                    this.status = {
                        cssClass: 'success',
                        message: 'Mensaje enviado correctamente'
                    }
                    form.reset();
                }
            },
            error =>{
                this.status = {
                    cssClass: 'danger',
                    message: 'Se ha producido un error: ' + error
                }
            });
    }

    getMyFollows(){
        this._followService.getMyFollows().subscribe(            
            response => {
                this.follows = (response.usersDB) ? response.usersDB : null;
            },
            error => {
                this.status = {
                    cssClass: 'danger',
                    message: 'Se ha producido un error: ' + error
                }
            }
        );
    }
}