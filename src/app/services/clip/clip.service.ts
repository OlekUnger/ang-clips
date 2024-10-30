import {inject, Injectable, signal} from '@angular/core';
import {Auth} from '@angular/fire/auth';
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    Firestore,
    getDocs,
    query,
    updateDoc,
    where,
    orderBy,
    limit,
    startAfter,
    QueryConstraint, getDoc
} from '@angular/fire/firestore';
import {Storage, ref, deleteObject} from '@angular/fire/storage';
import {ClipModel, IClip} from '../../models/clip.model';
import {Router} from "@angular/router";

@Injectable({
    providedIn: 'root'
})
export class ClipService {
    #firestore = inject(Firestore)
    #clipsCollection = collection(this.#firestore, 'clips')
    #auth = inject(Auth)
    storage = inject(Storage)
    router = inject(Router)
    pageClips = signal<ClipModel[]>([])
    /** последний запрошенный клип */
    lastDoc: any = null
    pendingRequest: boolean = false

    constructor() {
    }

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

    public async delete(clip: IClip) {
        const fileRef = ref(this.storage, `clips/${clip.fileName}`)
        await deleteObject(fileRef)

        const docRef = doc(this.#firestore, 'clips', clip.id as string)
        await deleteDoc(docRef)

        const screenshotRef = ref(this.storage, `screenshots/${clip.screenshotFileName}`)
        await deleteObject(screenshotRef)
    }

    public async getClips() {
        if(this.pendingRequest) return
        this.pendingRequest = true
        const queryParams: QueryConstraint[] = [
            orderBy('timestamp', 'desc'),
            limit(6),

        ]
        if(this.pageClips().length) {
            queryParams.push(
                startAfter(this.lastDoc)
            )
        }
        const q = query(this.#clipsCollection, ...queryParams)
        const snapshots = await getDocs(q)
        this.pendingRequest = false

        if(!snapshots.docs.length) return
        this.lastDoc = snapshots.docs[snapshots.docs.length - 1]

        snapshots.docs.forEach(doc => {
            this.pageClips.set([
                ...this.pageClips(),
                new ClipModel({...doc.data() as IClip, id: doc.id})
            ])
        })
    }

    async resolve(id: string): Promise<ClipModel | null> {
        const clip = await getDoc(doc(this.#firestore, 'clips', id))
        if(!clip.exists()) {
            this.router.navigate(['/'])
            return null
        }
        return new ClipModel({...clip.data() as IClip, id})
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
