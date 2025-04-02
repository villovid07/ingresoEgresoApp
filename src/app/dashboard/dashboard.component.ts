import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { filter, Subscription } from 'rxjs';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import { setItems } from '../ingreso-egreso/ingreso-egreso.actions';
import { IngresoEgreso } from '../models/ingreso-egreso.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
  ]
})
export class DashboardComponent {

  userSubs!:Subscription;
  subscriptionIngreso! : Subscription;

  constructor( private store: Store<AppState>, private ingresoEgreso: IngresoEgresoService){

  }

  ngOnInit(){
// Suggested code may be subject to a license. Learn more: ~LicenseLog:1034898383.
    this.userSubs = this.store.select('user').pipe( filter( auth => auth.user != null)).subscribe( ({user}) => {
      this.subscriptionIngreso = this.ingresoEgreso.initIngresosEgresosListener(user? user.uid:'').subscribe((ingresosEgresosFB:IngresoEgreso[]) => {
        this.store.dispatch(setItems({items: ingresosEgresosFB}))
      });
    })
  }

  ngOnDestroy(){
    this.userSubs.unsubscribe();
    this.subscriptionIngreso.unsubscribe();
  }

}
