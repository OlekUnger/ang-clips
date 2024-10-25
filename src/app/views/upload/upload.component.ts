import { NgClass, PercentPipe } from '@angular/common';
import { Component, inject, OnDestroy, signal } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { fileExtension } from '../../core/utils/regexp';
import { ClipService } from '../../services/clip/clip.service';
import { AlertComponent } from '../../shared/alert/alert.component';
import { EventBlockerDirective } from '../../shared/directives/event-blocker.directive';
import { InputComponent } from '../../shared/input/input.component';
import { Storage, ref, uploadBytesResumable, fromTask, getDownloadURL, UploadTask } from '@angular/fire/storage'
import { v4 as uuid } from 'uuid'

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [
    EventBlockerDirective,
    ReactiveFormsModule,
    NgClass,
    PercentPipe,
    InputComponent,
    AlertComponent
  ],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.scss'
})
export class UploadComponent implements OnDestroy {
  isDragOver = signal(false)
  file = signal<File | null>(null)
  nextStep = signal(false)
  fb = inject(FormBuilder)
  #storage = inject(Storage)
  #auth = inject(Auth)
  #clipService = inject(ClipService)
  showAlert = signal(false)
  alertMsg = signal('Please wait! Your clip is being uploaded.')
  alertColor = signal('blue')
  inSubmission = signal(false)
  percentage = signal(0)
  showPercentage = signal(false)
  clipTask?: UploadTask

  public form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
  })

  public storeFile($event:Event) {
    this.isDragOver.set(false)
    this.file.set(($event as DragEvent).dataTransfer?.files.item(0) ?? null)

    if(this.file()?.type !== 'video/mp4') return
    this.form.controls.title.setValue(this.file()?.name.replace(fileExtension, '') ?? '')
    this.nextStep.set(true)


    // console.log(this.file())
  }

  uploadFile() {
    this.showAlert.set(true)
    this.alertColor.set('blue')
    this.alertMsg.set('Please wait! Your clip is being uploaded.')
    this.inSubmission.set(true)
    this.showPercentage.set(true)

    const clipFileName = uuid()
    const clipPath = `clips/${clipFileName}.mp4`
    const clipRef = ref(this.#storage, clipPath)
    this.clipTask = uploadBytesResumable(clipRef, this.file() as File)

    fromTask(this.clipTask).subscribe({
      next: (res: any) => {
        this.form.disable()
        const progress = res.bytesTransferred / res.totalBytes
        this.percentage.set(progress)
      },
      error: (error: any) => {
        this.form.enable()
        this.alertColor.set('red')
        this.alertMsg.set('Upload failed! Please try again later.')
        this.inSubmission.set(false)
        this.showPercentage.set(false)
        console.error(error)
      },
      complete: async () => {
        const clipUrl = await getDownloadURL(clipRef)
        const clip = {
          uid: this.#auth.currentUser?.uid as string,
          displayName: this.#auth.currentUser?.displayName as string,
          title: this.form.controls.title.value,
          fileName: `${clipFileName}.mp4`,
          clipUrl
        }
        await this.#clipService.create(clip)

        this.alertColor.set('green')
        this.alertMsg.set('Success! Your clip is now ready to share with the world.')
        this.showPercentage.set(false)
        this.inSubmission.set(false)
      }
    })
  }

  ngOnDestroy() {
    this.clipTask?.cancel()
  }
}
