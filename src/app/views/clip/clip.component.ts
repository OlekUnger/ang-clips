import {Component, ElementRef, inject, OnInit, signal, viewChild} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {ClipsListComponent} from "../../video/clips-list/clips-list.component";
import videojs from "video.js";
import {ClipModel} from "../../models/clip.model";
import {FbTimestampPipe} from "../../shared/pipes/fb-timestamp.pipe";

@Component({
    selector: 'app-clip',
    standalone: true,
    imports: [RouterLink, ClipsListComponent, FbTimestampPipe],
    templateUrl: './clip.component.html',
    styleUrl: './clip.component.scss'
})
export class ClipComponent implements OnInit {
    public route = inject(ActivatedRoute)
    public id = signal('')
    public target = viewChild.required<ElementRef<HTMLVideoElement>>('videoPlayer')
    public clip = signal<ClipModel | null>(null)

    ngOnInit() {
        const player = videojs(this.target().nativeElement)
        this.route.data.subscribe(res => {
            this.clip.set(res['clip'])
            player.src({
                src: this.clip()?.clipUrl,
                type: 'video/mp4'
            })
        })

    }
}
