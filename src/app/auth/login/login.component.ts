import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { AuthService } from 'src/app/services/auth.service';
import { isLoading, stopLoading } from 'src/app/shared/ui.actions';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [],
})
export class LoginComponent {
  loginForm!: FormGroup;
  cargando: boolean = false;
  uiSubscription!: Subscription;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.uiSubscription = this.store.select('ui').subscribe((ui) => {
      this.cargando = ui.isLoading;
    });
  }

  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }

  login() {
    if (this.loginForm.invalid) {
      return;
    } else {
      this.store.dispatch(isLoading());
      /*Swal.fire({
        title: 'Espere por favor',
        didOpen: () => {
          Swal.showLoading();
        },
      });*/
      const { email, password } = this.loginForm.value;
      this.authService
        .loginUsuario(email, password)
        .then((credenciales) => {
          this.store.dispatch(stopLoading());
          this.router.navigate(['/']);
          //Swal.close();
        })
        .catch((error) => {
          this.store.dispatch(stopLoading());
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.message,
          });
        });
    }
  }
}
