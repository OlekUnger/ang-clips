import { Component, inject, input, viewChild, AfterViewInit, ElementRef, OnDestroy } from '@angular/core';
import { ModalService } from '../../services/modal/modal.service';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent implements AfterViewInit, OnDestroy {
  public modal: ModalService = inject(ModalService)
  public id = input.required<string>()
  public dialog = viewChild.required<ElementRef<HTMLDialogElement>>('baseDialog')

  ngAfterViewInit() {
    this.modal.register(this.id(), this.dialog().nativeElement)
  }
  ngOnDestroy() {
    this.modal.unregister(this.id())
  }
}
