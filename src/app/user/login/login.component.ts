import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService} from '../../services/auth/auth.service';
import { AlertComponent } from '../../shared/alert/alert.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, AlertComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  public credentials = {
    email: '',
    password: ''
  }
  public authService = inject(AuthService)
  public showAlert = signal(false)
  public alertMsg = signal('Please wait! We are logging you in.')
  public alertColor = signal('blue')
  public inSubmission = signal(false)

  public async login() {
    this.showAlert.set(true)
    this.alertMsg.set('Please wait! We are logging you in.')
    this.alertColor.set('blue')
    this.inSubmission.set(true)
    try {
      await this.authService.login(this.credentials)
    } catch (e) {
      this.alertMsg.set('An unexpected error occured! Please try again later.')
      this.alertColor.set('red')
      this.inSubmission.set(false)
      console.error(e)
      return
    }
    this.alertMsg.set('Success! Your are now logged in.')
    this.alertColor.set('green')
  }
}
