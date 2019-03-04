import { Component, OnInit, DoCheck } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from './services/user.service';
import { GLOBAL } from './services/global';
import * as $ from 'jquery';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UserService]
})
export class AppComponent implements OnInit, DoCheck{
  public title: string;
  public indentity;
  public url: string;

  constructor( private _userService: UserService, private _route: ActivatedRoute, private _router: Router ){
    this.title  = 'NG Social';
    this.url = GLOBAL.url;
  }

  ngOnInit(){
    this.indentity = this._userService.getIdentity();
    console.log(this.indentity);
  }

  ngDoCheck(): void {
    this.indentity = this._userService.getIdentity();    
  }

  logout(){
    localStorage.clear();
    this.indentity = null;
    this._router.navigate(['/']);
 }
 showMeModal() {
    $( ".dropdown" ).hover(
      function() {
        $('.main-menu').css('overflow', 'visible');
        $('.dropdown').addClass('open');
      }, function() {
        $('.main-menu').css('overflow', 'hidden');
        $('.dropdown').removeClass('open');
      }
    );
  }
}
