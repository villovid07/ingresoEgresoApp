import 'firebase/firestore';
import { Injectable } from '@angular/core';
import { addDoc, Firestore, onSnapshot } from '@angular/fire/firestore';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { collection, doc } from '@angular/fire/firestore';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class IngresoEgresoService {

  constructor(private fireStore: Firestore, private authService: AuthService) { }

  crearIngresoEgreso ( ingresoEgreso: IngresoEgreso){
    const colRef = collection(this.fireStore,`${this.authService.user.uid}/ingresos-egresos`, 'items');
    return addDoc(colRef, {
     ...ingresoEgreso
    });
  }

  initIngresosEgresosListener( uid: string){
    const docref = collection(this.fireStore, `${uid}/ingresos-egresos/items`);
    onSnapshot(docref, (snapshot) => {
      if (!snapshot.empty) {
        console.log(snapshot.docs)
      } else {
        console.log('no document found');
      }
    });
  }
}
