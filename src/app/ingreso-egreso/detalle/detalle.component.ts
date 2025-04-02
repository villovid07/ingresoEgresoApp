import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { IngresoEgreso } from 'src/app/models/ingreso-egreso.model';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: [
  ]
})
export class DetalleComponent {
  
  ingresosEgresos: IngresoEgreso[] = [];
  ingresosSubscription!: Subscription;

  constructor( private store : Store<AppState>){
  }

  ngOnInit(){
    this.ingresosSubscription= this.store.select('ingresosEgresos').subscribe( ({items}) => {
      this.ingresosEgresos= items;
    })
  }

  ngOnDestroy(){
    this.ingresosSubscription.unsubscribe();
  }

  borrar(uid:any){
    console.log(uid);
  }

}
