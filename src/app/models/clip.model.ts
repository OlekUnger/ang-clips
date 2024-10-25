export interface IClip {
  uid: string
  displayName: string
  title: string
  fileName: string
}

export default class ClipModel implements IClip {
  uid!: string
  displayName!: string
  title!: string
  fileName!: string
}
