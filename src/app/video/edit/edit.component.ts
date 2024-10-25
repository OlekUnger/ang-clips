import { NgClass, PercentPipe } from '@angular/common';
import { Component, effect, inject, input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClipModel } from '../../models/clip.model';
import { ClipService } from '../../services/clip/clip.service';
import { AlertComponent } from '../../shared/alert/alert.component';
import { InputComponent } from '../../shared/input/input.component';
import { ModalComponent } from '../../shared/modal/modal.component';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [
    ModalComponent, ReactiveFormsModule,
    InputComponent, AlertComponent, PercentPipe, NgClass],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent {
  public showAlert = signal(false)
  public alertMsg = signal('Please wait! Updating clip.')
  public alertColor = signal('blue')
  public inSubmission = signal(false)
  public activeClip = input<ClipModel | null>(null)
  public clipService = inject(ClipService)
  public fb = inject(FormBuilder)
  public form = this.fb.nonNullable.group({
    id: [''],
    title: ['', [Validators.required, Validators.minLength(3)]]
  })
  public onUpdate = output<ClipModel>()

  constructor() {
    effect(() => {
      this.form.controls.id.setValue(this.activeClip()?.id ?? '')
      this.form.controls.title.setValue(this.activeClip()?.title ?? '')

      this.inSubmission.set(false)
      this.showAlert.set(false)
    }, {allowSignalWrites: true});
  }

  public async submit() {
    this.inSubmission.set(true)
    this.showAlert.set(true)
    this.alertColor.set('blue')
    const value = this.form.getRawValue()

    try {
      await this.clipService.update(value.id, value.title).then(res => {
        this.inSubmission.set(false)
        this.alertColor.set('green')
        this.alertMsg.set('Success')

        const updatedClip = new ClipModel(this.activeClip()?.toDto())
        if(updatedClip) {
          updatedClip.title = value.title
          this.onUpdate.emit(updatedClip)
        }

      })
    } catch(e) {
      this.inSubmission.set(false)
      this.alertColor.set('red')
      this.alertMsg.set('Something went wrong! Try again later.')
      return
    }


  }

}
