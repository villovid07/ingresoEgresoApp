import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: [],
})
export class IngresoEgresoComponent {
  ingresoForm!: FormGroup;
  tipo: string = 'ingreso';

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.ingresoForm = this.fb.group({
      descripcion: ['', Validators.required],
      monto: ['', Validators.required], //add more constratin to this field
    });
  }

  guardar() {
    if (this.ingresoForm.invalid) {
      return;
    }
    console.log(this.ingresoForm.valid);
    console.log(this.ingresoForm.value);
    console.log(this.tipo);
  }
}
