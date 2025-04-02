import 'firebase/firestore';
import { Injectable } from '@angular/core';
import { addDoc, Firestore, onSnapshot } from '@angular/fire/firestore';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { collection, doc } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IngresoEgresoService {

  constructor(private fireStore: Firestore, private authService: AuthService) { }

  crearIngresoEgreso(ingresoEgreso: IngresoEgreso) {
    const colRef = collection(this.fireStore, `${this.authService.user.uid}/ingresos-egresos`, 'items');
    const data = {
      descripcion: ingresoEgreso.descripcion, 
      monto: ingresoEgreso.monto, 
      tipo: ingresoEgreso.tipo
    }  
    return addDoc(colRef, {
      ...data
    });
  }

  initIngresosEgresosListener(uid: string):Observable<IngresoEgreso[]> {
    return new Observable((observer) => {
      const docref = collection(this.fireStore, `${uid}/ingresos-egresos/items`);
      const unsubscribe = onSnapshot(docref, (snapshot) => {
        if (!snapshot.empty) {
          const datos = snapshot.docs.map(doc => {
            return new IngresoEgreso(
              doc.data()['descripcion'],
              doc.data()['monto'],
              doc.data()['tipo'],
              doc.id
            )
          })
          
          observer.next(datos);
        } else {
          observer.next([]);
        }
      }, error => {
        observer.error(error);
      });

      return () => unsubscribe()
    });
  }
}
