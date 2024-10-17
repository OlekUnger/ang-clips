import { Injectable, signal } from '@angular/core';

interface IModal {
  id: string
  element: HTMLDialogElement
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modals = signal<IModal[]>([])

  constructor() { }

  public register(id: string, element: HTMLDialogElement): void {
    this.modals.set([...this.modals(), {id, element}])
  }
  public toggle(id: string): void {
    const modal = this.modals().find(i => i.id == id)
    if(!modal) return
    if(modal.element.open) {
      modal.element.close()
    } else {
      modal.element.showModal()
    }
  }
}
