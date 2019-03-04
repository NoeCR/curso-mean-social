import { Component, OnInit, DoCheck } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FollowService } from '../../../services/follow.service';
import { Message } from '../../../models/message';
import { MessageService } from '../../../services/message.service';
import { UserService } from '../../../services/user.service';
import { GLOBAL } from '../../../services/global';


@Component({
    selector: 'sended',
    templateUrl: './sended.component.html',
    providers: [MessageService, UserService]
})
export class SendedComponent implements OnInit {

    public title: string;
    public messages: Message[];
    public identity;
    public token;
    public status;
    public follows;
    public url: string;
    public page: number;
    public pages: number;
    public total: number;
    public next_page: number;
    public prev_page: number;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _messageService: MessageService,
        private _userService: UserService
    ){
            this.title = 'Mensajes enviados';
            this.identity = this._userService.getIdentity();
            this.token = this._userService.getToken(); 
            this.url = GLOBAL.url;
    }

    ngOnInit(){
        this.actualPage();
    }
    actualPage(){
        this._route.params.subscribe(params => {
            let page = (params['page']) ? +params['page'] : 1;

            if(page >= 1){
                this.page = page;
                this.next_page = page + 1;
                this.prev_page= page -1;
            }

            this.getMessages(this.page);
        });
    }
    getMessages(page){
        this._messageService.getEmitMessages(page).subscribe(
            response => {
                if(response.messages){
                    this.status = {
                        cssClass: 'success',
                        message: 'Mensajes recibidos correctamente'
                    }
                    this.messages = response.messages;
                    this.total = response.total;
                    this.pages = response.pages;
                }
            },
            error => {
                this.status = {
                    cssClass: 'danger',
                    message: 'Se ha producido un error: '
                }
            }
        );
    }
}