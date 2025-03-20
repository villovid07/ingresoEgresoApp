import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { filter, Subscription } from 'rxjs';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
  ]
})
export class DashboardComponent {

  userSubs!:Subscription;

  constructor( private store: Store<AppState>, private ingresoEgreso: IngresoEgresoService){

  }

  ngOnInit(){
// Suggested code may be subject to a license. Learn more: ~LicenseLog:1034898383.
    this.userSubs = this.store.select('user').pipe( filter( auth => auth.user != null)).subscribe( ({user}) => {
      this.ingresoEgreso.initIngresosEgresosListener(user? user.uid:'');
    })
  }

  ngOnDestroy(){
    this.userSubs.unsubscribe();
  }

}
