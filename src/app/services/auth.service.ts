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
import { unsetItems } from '../ingreso-egreso/ingreso-egreso.actions';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userSubscrition!: Unsubscribe;
  private _user!:Usuario | null;
  constructor(
    private auth: AngularFireAuth,
    private firestore: Firestore,
    private store: Store<AppState>
  ) {}

  get user(){
    return {...this._user};
  }

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
            this._user = user;
            this.store.dispatch(setUser({ user }));

          } else {
            console.log('no document found');
          }
        });
      } else {
        this._user = null;
        if(this.userSubscrition){
          this.userSubscrition();
        }
        this.store.dispatch(unSetUser());
        this.store.dispatch(unsetItems());
      }
    });
  }

  isAuth() {
    return this.auth.authState.pipe(map((fbUser) => fbUser != null));
  }
}
