import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent {
  nombre: string ="";
  userSubs!: Subscription;
  constructor(private authService: AuthService, private router:Router, private store:Store<AppState>){

  }

  ngOnInit(){
      this.userSubs= this.store.select('user').subscribe(({user})=>{
        this.nombre =user?user.nombre:"";
     }) 
  }
  ngOnDestroy(){
    this.userSubs.unsubscribe();
  }


  logout(){
    this.authService.logout().then((resultado:any)=>{
        this.router.navigate(['/login']);
    }).catch((error)=>{
      console.log(error);
    });
  }

  clickafuera(){
    alert("ahhhhh");
  }

}
