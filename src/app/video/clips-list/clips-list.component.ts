import {Component, inject, input, OnDestroy, OnInit} from '@angular/core';
import {ClipService} from "../../services/clip/clip.service";
import {RouterLink} from "@angular/router";
import {DatePipe} from "@angular/common";
import {FbTimestampPipe} from "../../shared/pipes/fb-timestamp.pipe";

@Component({
  selector: 'app-clips-list',
  standalone: true,
  imports: [RouterLink, FbTimestampPipe],
  templateUrl: './clips-list.component.html',
  styleUrl: './clips-list.component.scss'
})
export class ClipsListComponent implements OnInit, OnDestroy {
  public clipService = inject(ClipService)
  public scrollable = input(true)

  constructor() {
    this.clipService.getClips()
  }

  ngOnInit() {
    if(this.scrollable())
      window.addEventListener('scroll', this.handleScroll)
  }

  handleScroll = () => {
    const {scrollTop, offsetHeight} = document.documentElement
    const {innerHeight} = window
    const bottomOfWindow: boolean = Math.round(scrollTop) + innerHeight > offsetHeight - 150

    if(bottomOfWindow) {
      this.clipService.getClips()
    }
  }

  ngOnDestroy() {
    if(this.scrollable())
      window.removeEventListener('scroll', this.handleScroll)
    this.clipService.pageClips.set([])
  }
}
