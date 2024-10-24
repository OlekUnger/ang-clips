import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { ModalService } from '../../services/modal/modal.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [AsyncPipe, RouterLink, RouterLinkActive],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss'
})
export class NavComponent {
  public modal = inject(ModalService)
  public authService = inject(AuthService)


  public openModal(event: Event) {
    event.preventDefault()
    this.modal.toggle('auth')
  }

  public async logout(e?: Event) {
    e?.preventDefault()
    await this.authService.logout()
  }
}
