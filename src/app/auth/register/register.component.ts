import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { isLoading, stopLoading } from '../../shared/ui.actions';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [],
})
export class RegisterComponent {
  registroForm!: FormGroup;
  uiSubscription!: Subscription;
  cargando: boolean = false;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    this.registroForm = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    this.uiSubscription = this.store.select('ui').subscribe((ui) => {
      this.cargando = ui.isLoading;
    });
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.uiSubscription.unsubscribe();
  }

  crearUsuario() {
    if (this.registroForm.invalid) {
      return;
    }
    this.store.dispatch(isLoading());
    /*Swal.fire({
      title: "Espere por favor",
      didOpen: () => {
        Swal.showLoading();
      }
    });*/
    const { nombre, correo, password } = this.registroForm.value;
    this.authService
      .crearUsuario(nombre, correo, password)
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
