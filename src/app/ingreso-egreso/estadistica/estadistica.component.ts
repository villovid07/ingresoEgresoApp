import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { IngresoEgreso } from 'src/app/models/ingreso-egreso.model';
import { ChartConfiguration } from 'chart.js';
import { AppStateWithIngreso } from '../ingreso-egreso.reducer';

@Component({
  selector: 'app-estadistica',
  templateUrl: './estadistica.component.html',
  styles: [
  ]
})
export class EstadisticaComponent {
  ingresos:number= 0;
  egresos:number= 0; 

  totalIngresos:number =0;
  totalEgresos:number=0;


  // Doughnut
  public doughnutChartLabels: string[] = [ 'Ingresos', 'Egresos'];
  public doughnutChartDatasets: ChartConfiguration<'doughnut'>['data']['datasets'] = [
      { data: [] },
  ];

  public doughnutChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: false
  };

  constructor(private store: Store<AppStateWithIngreso>){}

  ngOnInit(){
    this.store.select('ingresosEgresos').subscribe(({items})=>{
      this.generarEstadistica(items);
    })
  }
  generarEstadistica(items: IngresoEgreso[]){
    this.totalIngresos=0;
    this.totalEgresos=0;
    this.ingresos=0;
    this.egresos=0;
    for(const item of items){
      if( item.tipo === 'ingreso'){
        this.totalIngresos+= item.monto;
        this.ingresos++;
      }else {
        this.totalEgresos+= item.monto;
        this.egresos++;
      }
    }

    this.doughnutChartDatasets=[{ data: [this.totalIngresos, this.totalEgresos] }]

  }

}
