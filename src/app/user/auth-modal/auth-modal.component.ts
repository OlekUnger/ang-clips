import { Component } from '@angular/core';
import { ModalComponent } from '../../shared/modal/modal.component';
import { TabComponent } from '../../shared/tab/tab.component';
import { TabsContainerComponent } from '../../shared/tabs-container/tabs-container.component';

@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [ModalComponent, TabsContainerComponent, TabComponent],
  templateUrl: './auth-modal.component.html',
  styleUrl: './auth-modal.component.scss'
})
export class AuthModalComponent {

}
