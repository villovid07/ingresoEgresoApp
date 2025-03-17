import { Injectable, inject } from '@angular/core';
import 'firebase/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { collection, doc, Firestore, setDoc } from '@angular/fire/firestore';
import { map, Subscription } from 'rxjs';
import { Usuario } from '../models/usuario.model';
import { AppState } from '../app.reducer';
import { Store } from '@ngrx/store';
import { setUser, unSetUser } from '../auth/auth.actions';
import { getDoc, onSnapshot, Unsubscribe } from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userSubscrition!: Unsubscribe;
  constructor(
    private auth: AngularFireAuth,
    private firestore: Firestore,
    private store: Store<AppState>
  ) {}

  crearUsuario(nombre: string, email: string, password: string) {
    return this.auth
      .createUserWithEmailAndPassword(email, password)
      .then(({ user }) => {
        const newUser = new Usuario(
          user ? user?.uid : '',
          nombre,
          user?.email ? user.email : ''
        );
        const collectionRef = collection(this.firestore, user ? user.uid : '');
        const docRef = doc(this.firestore, user ? user.uid : '', 'user');
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
      if (user) {
        const docref = doc(this.firestore, `${user.uid}/user`);
        this.userSubscrition = onSnapshot(docref, (doc) => {
          if (doc.exists()) {
            const user = Usuario.fromFirestore(doc.data());
            this.store.dispatch(setUser({ user }));
          } else {
            console.log('no document found');
          }
        });
      } else {
        this.userSubscrition();
        this.store.dispatch(unSetUser());
      }
    });
  }

  isAuth() {
    return this.auth.authState.pipe(map((fbUser) => fbUser != null));
  }
}
