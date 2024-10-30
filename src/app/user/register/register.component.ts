import {Component, inject, signal} from '@angular/core';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {password} from '../../core/utils/regexp';
import {AuthService} from '../../services/auth/auth.service';
import {AlertComponent} from '../../shared/alert/alert.component';
import {InputComponent} from '../../shared/input/input.component';
import {EmailTaken, Match} from './validators';

interface IRegisterForm {
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
		public inSubmission = signal(false)
		public authService = inject(AuthService)
		public emailTaken = inject(EmailTaken)


		public fb = inject(FormBuilder)
		public form = this.fb.nonNullable.group({
				name: ['', [Validators.required, Validators.minLength(2)]],
				email: ['', [Validators.required, Validators.email], [this.emailTaken.validate]],
				age: [18, [Validators.required, Validators.min(18), Validators.max(120)]],
				password: ['', [Validators.required, Validators.pattern(password)]],
				confirmPassword: ['', [Validators.required]],
				phoneNumber: ['', [Validators.required, Validators.minLength(14), Validators.maxLength(14)]],
		}, {validators: [Match('password', 'confirmPassword')]})

		public async register() {
				this.showAlert.set(true)
				this.alertMsg.set('Please wait! Your account is being created')
				this.alertColor.set('blue')
				this.inSubmission.set(true)

				try {
						await this.authService.register(this.form.getRawValue())
				} catch (e) {
						this.alertMsg.set('An unexpected error occured! Please try again later.')
						this.alertColor.set('red')
						this.inSubmission.set(false)
						console.error(e)
						return
				}
				this.alertMsg.set('Success! Your account has been created.')
				this.alertColor.set('green')
		}
}
