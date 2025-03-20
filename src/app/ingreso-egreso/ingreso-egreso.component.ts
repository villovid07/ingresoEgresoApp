import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { Subscription } from 'rxjs';
import { isLoading, stopLoading } from '../shared/ui.actions';

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: [],
})
export class IngresoEgresoComponent {
  ingresoForm!: FormGroup;
  tipo: string = 'ingreso';
  cargando: boolean = false;
  uiSubscription!: Subscription;

  constructor(private fb: FormBuilder, private ingresoEgresoService: IngresoEgresoService, private store: Store<AppState>) {}

  ngOnInit(): void {

    this.uiSubscription = this.store.select('ui').subscribe((ui) => {
      this.cargando = ui.isLoading;
    });

    this.ingresoForm = this.fb.group({
      descripcion: ['', Validators.required],
      monto: ['', Validators.required], //add more constratin to this field
    });
  }

  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }

  guardar() {
    
    if (this.ingresoForm.invalid) {
      return;
    }
    this.store.dispatch(isLoading());
    const { descripcion, monto} = this.ingresoForm.value;
    const ingresoEgreso = new IngresoEgreso(
      descripcion,
      monto,
      this.tipo
    );
    this.ingresoEgresoService.crearIngresoEgreso(ingresoEgreso).then((docRef) => {
      Swal.fire('Registro creado', `${descripcion} creado correctamente`, 'success');
      this.ingresoForm.reset()
      this.store.dispatch(stopLoading());
    })
    .catch((error) => {
      this.store.dispatch(stopLoading());
      Swal.fire('Error', `${error.message}`, 'error');
    });
  }
}
