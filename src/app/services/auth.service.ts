import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  constructor(private auth:AngularFireAuth) { }

  crearUsuario(nombre:string, email:string, password:string){
    console.log(nombre,email, password)
    return this.auth.createUserWithEmailAndPassword(email, password)
  }

  loginUsuario(email:string, password:string){
    return this.auth.signInWithEmailAndPassword(email, password)
  }

  logout(){
    return this.auth.signOut();
  }

  initAuthListener(){
    this.auth.authState.subscribe(user=>{
      console.log(user?.email);
      console.log(user?.uid);
    })
  }
}
