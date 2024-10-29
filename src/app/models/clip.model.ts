import { Timestamp } from '@angular/fire/firestore';

export interface IClip {
  id?: string
  uid: string
  displayName: string
  title: string
  fileName: string
  clipUrl: string
  screenshotUrl?: string
  screenshotFileName?: string
  timestamp: Timestamp
}

export class ClipModel implements IClip {
  id?: string
  uid!: string
  displayName!: string
  title!: string
  fileName!: string
  clipUrl!: string
  screenshotUrl?: string
  screenshotFileName?: string
  timestamp!: Timestamp

  constructor(data?: IClip) {
    if(data) this.fromDto(data)
  }

  public fromDto(data: IClip) {
    this.id = data.id
    this.uid = data.uid
    this.displayName = data.displayName
    this.title = data.title
    this.fileName = data.fileName
    this.clipUrl = data.clipUrl
    this.screenshotUrl = data.screenshotUrl
    this.screenshotFileName = data.screenshotFileName
    this.timestamp = data.timestamp
  }

  public toDto(): IClip {
    return {
      id: this.id,
      uid: this.uid,
      displayName: this.displayName,
      title: this.title,
      fileName: this.fileName,
      clipUrl: this.clipUrl,
      screenshotUrl: this.screenshotUrl,
      screenshotFileName: this.screenshotFileName,
      timestamp: this.timestamp
    }
  }
}
