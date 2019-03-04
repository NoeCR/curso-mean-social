import { Component, OnInit, EventEmitter, DoCheck , Output, ViewChild, ElementRef  } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import { Publication } from '../../models/publication';
import { UserService } from '../../services/user.service';
import { PublicationService } from '../../services/publication.service';
import { GLOBAL } from '../../services/global';
import { UploadService } from '../../services/upload.service';


@Component({
    selector: 'sidebar',
    templateUrl: './sidebar.component.html',
    providers: [UserService, PublicationService, UploadService] 
})

export class SidebarComponent implements OnInit,  DoCheck{

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
        private _uploadService: UploadService,
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
    ngDoCheck(): void {
        this.getCounters(); 
        this.stats = this._userService.getStats();         
    }
        
    onSubmit(form){
        this._publicationService.addPublication(this.publication).subscribe(
            response => {
                if(response.publication){
                    this.status = 'success';
                    console.log(this.filesToUpload);
                    if(this.filesToUpload != undefined){
                        this._uploadService.makeFilesRequest(
                            this.url + 'upload-image-pub/' + response.publication._id, 
                            [],                         
                            this.filesToUpload, 
                            this.token,
                            'file')
                            .subscribe(
                                response =>{
                                    this.publication.file = response.pubUpdate.file;
                                    this.inputFile.nativeElement.value = "";  
                                    this.sendPublication();
                                },
                                error => {
                                    console.log(<any>error);
                                    this.status = 'error';
                                }
                            );
                    }
                    form.reset();                    
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
    sendPublication(event = null){
        this.sended.emit({send: 'true'});
    }

    public filesToUpload: Array<File>;
    fileChangesEvent(fileInput: any){
        this.filesToUpload = <Array<File>>fileInput.target.files;
    }
    @ViewChild('fileInput')
    inputFile: ElementRef;

    getCounters(){
        this._userService.getCounters().subscribe(
            response => {
                localStorage.setItem('stats', JSON.stringify(response));                             
            }, 
            error => {
                this.status = 'error';
                console.log(<any>error);
            }
        );
    }
}