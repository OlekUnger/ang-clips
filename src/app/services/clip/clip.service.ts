import { inject, Injectable } from '@angular/core';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';
import { IClip } from '../../models/clip.model';

@Injectable({
  providedIn: 'root'
})
export class ClipService {
  #firestore = inject(Firestore)
  #clipsCollection = collection(this.#firestore, 'clips')
  constructor() { }

  public async create(data: IClip) {
    await addDoc(this.#clipsCollection, data)
  }
}
