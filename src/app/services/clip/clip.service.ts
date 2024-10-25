import { inject, Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  Firestore,
  getDocs,
  query,
  updateDoc,
  where
} from '@angular/fire/firestore';
import { Storage, ref, deleteObject } from '@angular/fire/storage';
import { ClipModel, IClip } from '../../models/clip.model';

@Injectable({
  providedIn: 'root'
})
export class ClipService {
  #firestore = inject(Firestore)
  #clipsCollection = collection(this.#firestore, 'clips')
  #auth = inject(Auth)
  storage = inject(Storage)
  constructor() { }

  public async create(data: IClip) {
    return await addDoc(this.#clipsCollection, data)
  }

  public async get(): Promise<ClipModel[]> {
    const q = query(
      this.#clipsCollection,
      where('uid', '==', this.#auth.currentUser?.uid)
    )
    return await getDocs(q).then(res => {
      const model: ClipModel[] = []
      res.forEach(doc => {
        model.push(new ClipModel({...doc.data() as IClip, id: doc.id}))
      })
      return model

    })
  }
  public async update(id: string, title: string): Promise<any> {
    const clipRef = doc(this.#firestore, 'clips', id)
    return await updateDoc(clipRef, {title})
  }
  public async delete (clip: IClip) {
    const fileRef = ref(this.storage, `clips/${clip.fileName}`)
    await deleteObject(fileRef)

    const docRef = doc(this.#firestore, 'clips', clip.id as string)
    await deleteDoc(docRef)
  }

  // public get(): Observable<ClipModel[]> {
  //   const q = query(
  //     this.#clipsCollection,
  //     where('uid', '==', this.#auth.currentUser?.uid)
  //   )
  //   return fromPromise(getDocs(q).then(res => {
  //     const model: ClipModel[] = []
  //     res.forEach(doc => {
  //       model.push(new ClipModel({...doc.data() as IClip, id: doc.id}))
  //     })
  //     return model
  //
  //   }))
  // }
}
