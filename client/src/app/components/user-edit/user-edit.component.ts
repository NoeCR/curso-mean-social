import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { UploadService } from '../../services/upload.service';
import { GLOBAL } from '../../services/global';


@Component({
    selector: 'user-edit',
    templateUrl: './user-edit.component.html',
    providers: [UserService, UploadService] 
})

export class UserEditComponent implements OnInit {

    public title:string;
    public user: User;
    public status: string;
    public identity;
    public token;
    public url: string;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _uploadService: UploadService
    ){
            this.title = 'Editar';
            this.user = this._userService.getIdentity();
            this.identity = this.user;
            this.token = this._userService.getToken();
            this.url = GLOBAL.url;
    }

    ngOnInit(){
        console.log('Componente edit user cargado');
    }

    onSubmit(){
        this._userService.updateUser(this.user).subscribe(
            response => {
                if(!response.user){
                    this.status = 'error';
                }else{
                    this.status = 'success';
                    localStorage.setItem('identity', JSON.stringify(this.user));
                    this.identity = this.user;
                    this._uploadService.makeFilesRequest(this.url + 'upload-image-user', [], this.filesToUpload, this.token, 'image')
                    .subscribe(
                        response => {
                            console.log('Respuesta ', response);
                            this.user.image = response.user.image;
                            localStorage.setItem('identity', JSON.stringify(this.user));
                        },
                        error => {
                            console.log('Error ', error);
                        }
                    );
                }
            }, 
            error => {
                console.log(<any>error);
                this.status = 'error';
            }
        );
    }

    public filesToUpload: Array<File>;
    fileChangeEvent(fileInput: any){
        this.filesToUpload = <Array<File>>fileInput.target.files;
        console.log(this.filesToUpload);
    }
}
