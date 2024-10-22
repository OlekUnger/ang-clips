import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertComponent } from '../../shared/alert/alert.component';
import { InputComponent } from '../../shared/input/input.component';

interface IRegisterForm  {
  age: FormControl<number>
  name: FormControl<string>
  email: FormControl<string>
  password: FormControl<string>
  confirmPassword: FormControl<string>
  phoneNumber: FormControl<string>
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, InputComponent, AlertComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  public showAlert = signal(false)
  public alertMsg = signal('Please wait! Your account is being created')
  public alertColor = signal('blue')

  public fb = inject(FormBuilder)
  public form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    age: [18, [Validators.required, Validators.min(18), Validators.max(120)]],
    password: ['', [Validators.required, Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm)]],
    confirmPassword: ['', [Validators.required]],
    phoneNumber: ['', [Validators.required, Validators.minLength(14), Validators.maxLength(14)]],
  })

  public register() {
    this.showAlert.set(true)
    this.alertMsg.set('Please wait! Your account is being created')
    this.alertColor.set('blue')
  }
}
