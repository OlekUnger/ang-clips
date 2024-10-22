import { Component, input } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-input',
  standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        NgxMaskDirective
    ],
  providers: [provideNgxMask()],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss'
})
export class InputComponent {
  public control = input.required<FormControl>()
  public type = input('text')
  public placeholder = input('')
  public mask = input('')
}
