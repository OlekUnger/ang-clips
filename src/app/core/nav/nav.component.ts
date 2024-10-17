import { Component, inject } from '@angular/core';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss'
})
export class NavComponent {
  public modal = inject(ModalService)

  public openModal(event: Event) {
    event.preventDefault()
    this.modal.toggle('auth')
  }
}
