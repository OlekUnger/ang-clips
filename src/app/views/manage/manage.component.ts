import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import { ClipModel, IClip } from '../../models/clip.model';
import { ClipService } from '../../services/clip/clip.service';
import { ModalService } from '../../services/modal/modal.service';
import { EditComponent } from '../../video/edit/edit.component';

@Component({
  selector: 'app-manage',
  standalone: true,
  imports: [RouterLink, EditComponent],
  templateUrl: './manage.component.html',
  styleUrl: './manage.component.scss'
})
export class ManageComponent implements OnInit {
  public videoOrder = signal('asc')
  public clips = signal<ClipModel[]>([])
  public activeClip = signal<ClipModel | null>(null)
  public orderedClips = computed(() => {
    return this.clips().sort((a, b) => {
      return this.videoOrder() == 'asc'
        ? a.timestamp.toMillis() - b.timestamp.toMillis()
        : b.timestamp.toMillis() - a.timestamp.toMillis()
    })
  })
  public router = inject(Router)
  public route = inject(ActivatedRoute)
  public clipService = inject(ClipService)
  public modalService = inject(ModalService)


  public sort($event: Event) {
    const {value} = $event.target as HTMLSelectElement
    this.router.navigate([], {relativeTo: this.route, queryParams: {sort: value}}).then()
  }

   async ngOnInit() {
    this.route.queryParams.subscribe((params: Params) => {
      this.videoOrder.set(params['sort'] === 'desc' ? 'desc' : 'asc')
    })
     this.clips.set(await this.clipService.get())
  }

  public openModal($event: Event, clip: ClipModel) {
    $event.preventDefault()
    this.activeClip.set(clip)
    this.modalService.toggle('editClip')
  }

  public onUpdate(data: ClipModel) {
    const currentClips = this.clips()
    const ind = currentClips.findIndex(i => i.id == data.id)
    if(ind != -1) {
      currentClips[ind] = data
      this.clips.set(currentClips)
    }
  }

  public deleteClip($event:Event, clip: IClip) {
    $event.preventDefault()
    this.clipService.delete(clip).then(res => {
      const currentClips = this.clips()
      this.clips.set(currentClips.filter(i => i.id !== clip.id))
    })
  }

}
