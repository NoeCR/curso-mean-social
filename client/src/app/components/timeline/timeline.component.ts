import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Publication } from '../../models/publication';
import { UserService } from '../../services/user.service';
import { GLOBAL } from '../../services/global';
import { PublicationService } from '../../services/publication.service';
import * as $ from 'jquery';

@Component({
    selector: 'timeline',
    templateUrl: './timeline.component.html',
    providers: [UserService, PublicationService] 
})

export class TimelineComponent implements OnInit {

    public title:string;
    public status;
    public identity;
    public token;
    public url: string;
    public page: number;
    public total: number;
    public pages: number;
    public publications: Publication[];
    public itemsPerPage: number;
    public showImage;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _publicationService: PublicationService
    ){
            this.title = 'Timeline';
            this.identity = this._userService.getIdentity();
            this.token = this._userService.getToken();
            this.url = GLOBAL.url;
            this.page = 1;
    }

    ngOnInit(){
        console.log('Componente Timeline cargado');
        this.getPublications(this.page);
    }
    getPublications(page, adding = false){
        this._publicationService.getPublications(page).subscribe(
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
        if(this.page == this.pages){
            this.noMore = true;
        }else{
            this.page += 1;
        }
        this.getPublications(this.page, true);
    }
    refresh(event = null){
        this.noMore = false;
        this.getPublications(1);
    }
    showThisImage(id){
        if(this.showImage == id){
            this.showImage = 1
        }else{
            this.showImage = id;
        }        
    }
    removePublication(id){
        //confirm("¿Seguro quieres eliminar esta publicación?");        
        this._publicationService.removePublication(id).subscribe(
            response => {
                this.status = {
                    hpd: 'success',
                    msg: 'Publicación eliminada correctamente'
                }
                this.refresh();
            },
            error => {
                console.log(<any>error);
                this.status = {
                    hpd: 'error',
                    msg: 'No se ha podido eliminar la publicación'
                }
                this.refresh();
            }
        );
    }
}