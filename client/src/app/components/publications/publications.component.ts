import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Publication } from '../../models/publication';
import { UserService } from '../../services/user.service';
import { GLOBAL } from '../../services/global';
import { PublicationService } from '../../services/publication.service';
import * as $ from 'jquery';

@Component({
    selector: 'publications',
    templateUrl: './publications.component.html',
    providers: [UserService, PublicationService] 
})

export class PublicationsComponent implements OnInit {

    public title:string;
    public status: string;
    public identity;
    public token;
    public url: string;
    public page: number;
    public total: number;
    public pages: number;
    public publications: Publication[];
    public itemsPerPage: number;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _publicationService: PublicationService
    ){
            this.title = 'Publicaciones';
            this.identity = this._userService.getIdentity();
            this.token = this._userService.getToken();
            this.url = GLOBAL.url;
            this.page = 1;
    }

    @Input() user: string;
    ngOnInit(){
        console.log('Componente Timeline cargado');
        this.getPublications(this.user, this.page);
    }
    getPublications(user, page, adding = false){
        this._publicationService.getPublicationsUser(user, page).subscribe(
            response => {
                if(response.publications){
                    this.total = response.total;
                    this.pages = response.pages;
                    this.itemsPerPage = response.itemsPerPage;
                    if(!adding){
                        this.publications = response.publications;
                    }else{
                        var arrayA = this.publications;
                        var arrayB = response.publications;
                        this.publications = arrayA.concat(arrayB);

                        $("html, body").animate({scrollTop: $("body").prop("scrollHeight")}, 500);
                    }
                    
                    if(page > this.pages){
                        this._router.navigate(['/']);
                    }
                    
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
    public noMore = false;
    viewMore(){
        this.page += 1;
        if(this.page == this.pages){
            this.noMore = true;
        }
        this.getPublications(this.user, this.page, true);
    }
}