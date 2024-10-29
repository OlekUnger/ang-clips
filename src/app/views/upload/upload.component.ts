import { NgClass, PercentPipe } from '@angular/common';
import { Component, inject, OnDestroy, signal } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { serverTimestamp, Timestamp } from '@angular/fire/firestore';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { fileExtension } from '../../core/utils/regexp';
import { IClip } from '../../models/clip.model';
import { ClipService } from '../../services/clip/clip.service';
import { AlertComponent } from '../../shared/alert/alert.component';
import { EventBlockerDirective } from '../../shared/directives/event-blocker.directive';
import { InputComponent } from '../../shared/input/input.component';
import { Storage, ref, uploadBytesResumable, fromTask, getDownloadURL, UploadTask } from '@angular/fire/storage'
import { v4 as uuid } from 'uuid'
import {FfmpegService} from "../../services/ffmpeg/ffmpeg.service";
import {combineLatestWith, forkJoin} from "rxjs";

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgClass,
    PercentPipe,
    InputComponent,
    AlertComponent,EventBlockerDirective,
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
  #router = inject(Router)
  ffmpegService = inject(FfmpegService)
  showAlert = signal(false)
  alertMsg = signal('Please wait! Your clip is being uploaded.')
  alertColor = signal('blue')
  inSubmission = signal(false)
  percentage = signal(0)
  showPercentage = signal(false)
  screenshots = signal<string[]>([])
  selectedScreenshot = signal('')
  clipTask?: UploadTask
  screenshotTask?: UploadTask

  public form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
  })

  constructor() {
    this.ffmpegService.init()
  }

  public async storeFile($event:Event) {
    if(this.ffmpegService.isRunning()) return

    this.isDragOver.set(false)
    this.file.set(($event as DragEvent).dataTransfer?.files.item(0) ?? null)

    if(this.file()?.type !== 'video/mp4') return

    this.screenshots.set(await this.ffmpegService.getScreenShots(this.file()))
    this.selectedScreenshot.set(this.screenshots()[0])
    this.form.controls.title.setValue(this.file()?.name.replace(fileExtension, '') ?? '')
    this.nextStep.set(true)

    // console.log(this.file())
  }

  async uploadFile() {
    this.showAlert.set(true)
    this.alertColor.set('blue')
    this.alertMsg.set('Please wait! Your clip is being uploaded.')
    this.inSubmission.set(true)
    this.showPercentage.set(true)

    const clipFileName = uuid()
    const clipPath = `clips/${clipFileName}.mp4`
    const clipRef = ref(this.#storage, clipPath)
    this.clipTask = uploadBytesResumable(clipRef, this.file() as File)

    const screenshotBlob = await this.ffmpegService.blobFromUrl(this.selectedScreenshot())
    const screenshotPath = `screenshots/${clipFileName}.png`
    const screenshotRef = ref(this.#storage, screenshotPath)
    this.screenshotTask = uploadBytesResumable(screenshotRef, screenshotBlob)

    fromTask(this.clipTask).pipe(
        combineLatestWith(fromTask(this.screenshotTask))
    ).subscribe({
      next: ([clipSnapshot, screenshotSnapshot]: any[]) => {
        this.form.disable()
        const bytesUploaded = clipSnapshot.bytesTransferred + screenshotSnapshot.bytesTransferred
        const totalBytes = clipSnapshot.totalBytes + screenshotSnapshot.totalBytes

        this.percentage.set(bytesUploaded / totalBytes)
      },

    })
    forkJoin(fromTask(this.clipTask, this.screenshotTask)).subscribe({
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
        const screenshotUrl = await getDownloadURL(screenshotRef)

        const clip: IClip = {
          uid: this.#auth.currentUser?.uid as string,
          displayName: this.#auth.currentUser?.displayName as string,
          title: this.form.controls.title.value,
          fileName: `${clipFileName}.mp4`,
          clipUrl,
          screenshotUrl,
          screenshotFileName: `${clipFileName}.png`,
          timestamp: serverTimestamp() as Timestamp
        }
        await this.#clipService.create(clip).then(res => {
          this.alertColor.set('green')
          this.alertMsg.set('Success! Your clip is now ready to share with the world.')
          this.showPercentage.set(false)
          this.inSubmission.set(false)

          setTimeout(() => {
            this.#router.navigate(['clip', res.id])
          }, 1000)
        })
      }
    })
  }

  ngOnDestroy() {
    this.clipTask?.cancel()
  }
}
