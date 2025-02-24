import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent {

  loginForm!: FormGroup;

  constructor(private fb: FormBuilder,private authService: AuthService, private router:Router){
      this.loginForm= this.fb.group({
        email:['', [Validators.required, Validators.email]],
        password:['', Validators.required]
      })
  }

  login(){
    if(this.loginForm.invalid){
      return;
    }else {
      Swal.fire({
        title: "Espere por favor",
        didOpen: () => {
          Swal.showLoading();
        }
      });
      const{ email, password } = this.loginForm.value;
      this.authService.loginUsuario(email, password).then((credenciales)=>{
        this.router.navigate(['/']);
        Swal.close();
      }).catch((error)=>{
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.message
        });
      });
    }
  }

}
