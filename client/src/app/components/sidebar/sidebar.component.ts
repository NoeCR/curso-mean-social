import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import { Publication } from '../../models/publication';
import { UserService } from '../../services/user.service';
import { PublicationService } from '../../services/publication.service';
import { GLOBAL } from '../../services/global';
//import { PublicationService } from '../../services/publication.service';


@Component({
    selector: 'sidebar',
    templateUrl: './sidebar.component.html',
    providers: [UserService, PublicationService] 
})

export class SidebarComponent implements OnInit {

    public title: string;
    public identity;
    public token;
    public status: string;
    public url: string;
    public stats;
    public publication: Publication;


    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _publicationService: PublicationService
    ){
            this.identity = this._userService.getIdentity();
            this.token = this._userService.getToken();
            this.stats = this._userService.getStats();
            this.url = GLOBAL.url;
            this.publication = new Publication("","","","",this.identity._id);
            this.title = 'Publicar';
    }

    ngOnInit(){
        console.log('Componente sidebar cargado');   
    }
    onSubmit(form){
        console.log(this.publication);
        this._publicationService.addPublication(this.publication).subscribe(
            response => {
                if(response.publication){
                    this.status = 'success';
                    form.reset();
                    this._router.navigate(['/timeline']);
                }else{
                    this.status = 'error';
                }
            },
            error => {
                console.log(<any>error);
                this.status = 'error';
            }
        );
    }

    // Output
    @Output() sended = new EventEmitter();
    sendPublication(event){
        this.sended.emit({send: 'true'});
    }
}