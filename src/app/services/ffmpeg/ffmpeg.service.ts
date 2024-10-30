import {Injectable, signal} from '@angular/core';
import {createFFmpeg, fetchFile} from "@ffmpeg/ffmpeg";

@Injectable({
    providedIn: 'root'
})
export class FfmpegService {
    public isReady = signal(false)
    public isRunning = signal(false)
    #ffmpeg = createFFmpeg({log: false})

    constructor() {
    }

    async init() {
        if(this.isReady()) return

        await this.#ffmpeg.load()
        this.isReady.set(true)
    }

    async getScreenShots(file: File | null) {
        if(!file) return []
        this.isRunning.set(true)

        const data = await fetchFile(file)
        this.#ffmpeg.FS('writeFile', file.name, data)



        const nums = [1,2,3]
        const commands: string[] = []

        nums.forEach(i => {
            commands.push(
                // input
                '-i', file.name, // to grab a specific file from our file system
                // output options
                '-ss', `00:00:0${i}`, // configures current timestamp, take screenshot at this time
                '-frames:v', '1', // configures how many frames focus on
                '-filter:v', // modify original source of an input
                'scale=510:-1', //or 510:300
                // output
                `output_0${i}.png` // name of screenshot
            )
        })
        await this.#ffmpeg.run(...commands)

        const screenshots: string[] = []

        nums.forEach(i => {
            // read file
            const screenshotFile = this.#ffmpeg.FS('readFile', `output_0${i}.png`)
            console.log('SCREENSHOT',screenshotFile)
            // turn it into binary blob
            const screenshotBlob = new Blob([screenshotFile.buffer], {type: 'image/png'})
            // create url which browser can read
            const screenshotUrl = URL.createObjectURL(screenshotBlob)
            screenshots.push(screenshotUrl)
        })
        this.isRunning.set(false)

        return screenshots
    }

    async blobFromUrl(url: string) {
        const response = await fetch(url)
        const blob = await response.blob()

        return blob
    }
}
