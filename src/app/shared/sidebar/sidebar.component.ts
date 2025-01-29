import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent {

  constructor(private authService: AuthService, private router:Router){

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
