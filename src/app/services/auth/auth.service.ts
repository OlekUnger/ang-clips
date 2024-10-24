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
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { delay, filter, map, switchMap } from 'rxjs';
import  UserModel  from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public router = inject(Router)
  public route = inject(ActivatedRoute)
  #auth = inject(Auth)  // or #auth = inject(Auth)
  #firestore = inject(Firestore)
  public authState$ = authState(this.#auth)
  public authStateWithDelay$ = authState(this.#auth).pipe(delay(1000))
  public redirect: boolean = false

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(event => {
        let currentRoute = this.route
        while(currentRoute.firstChild) {
          currentRoute = currentRoute.firstChild
        }
        return currentRoute
      }),
      switchMap(route => route.data)
    ).subscribe(data => {
        this.redirect = data['authOnly'] ?? false
      })
  }
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
    if(this.redirect)
      await this.router.navigateByUrl('/')
  }
}
