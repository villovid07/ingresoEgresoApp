import { Injectable, inject } from '@angular/core';
import 'firebase/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { collection, doc, Firestore, setDoc } from '@angular/fire/firestore';
import { map } from 'rxjs';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private auth: AngularFireAuth, private firestore: Firestore) {}

  crearUsuario(nombre: string, email: string, password: string) {
    console.log(nombre, email, password);
    return this.auth
      .createUserWithEmailAndPassword(email, password)
      .then(({ user }) => {
        const newUser = new Usuario(
          user ? user?.uid : '',
          nombre,
          user?.email ? user.email : ''
        );
        const collectionRef = collection(this.firestore, 'users');
        const docRef = doc(this.firestore, 'users', user ? user.uid : '');
        return setDoc(docRef, { ...newUser });
      });
  }

  loginUsuario(email: string, password: string) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  logout() {
    return this.auth.signOut();
  }

  initAuthListener() {
    this.auth.authState.subscribe((user) => {
      console.log(user?.email);
      console.log(user?.uid);
    });
  }

  isAuth() {
    return this.auth.authState.pipe(map((fbUser) => fbUser != null));
  }
}
