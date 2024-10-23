import { inject, Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  updateProfile,
  authState,
  signInWithEmailAndPassword,
  signOut
} from '@angular/fire/auth';
import { doc, setDoc, Firestore } from '@angular/fire/firestore';
import { delay } from 'rxjs';
import  UserModel  from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  #auth = inject(Auth)  // or #auth = inject(Auth)
  #firestore = inject(Firestore)
  authState$ = authState(this.#auth)
  authStateWithDelay$ = authState(this.#auth).pipe(delay(1000))

  async register(user: UserModel) {
    const userCred = await createUserWithEmailAndPassword(this.#auth, user.email, user.password)
    /** insert additional information to a database
     *  первый метод просто добавляет пользователя, он не подходит
     *  следущий - добавляет пользователя с uid, присвоенным при регистрации
     */
    // await addDoc(collection(this.#firestore, 'users'), {
    //   name: user.name, email: user.email, age: user.age, phoneNumber: user.phoneNumber
    // })
    await setDoc(doc(this.#firestore, 'users', userCred.user.uid), {
      name: user.name, email: user.email, age: user.age, phoneNumber: user.phoneNumber
    })
    await updateProfile(userCred.user, {
      displayName: user.name
    })
  }

  async login(data: {email: string, password: string}) {
    await signInWithEmailAndPassword(this.#auth, data.email, data.password)
  }

  async logout() {
    await signOut(this.#auth)
  }
}
