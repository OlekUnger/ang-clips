import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Params, RouterLink } from '@angular/router';

@Component({
  selector: 'app-clip',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './clip.component.html',
  styleUrl: './clip.component.scss'
})
export class ClipComponent implements OnInit {
  public route = inject(ActivatedRoute)
  public id = signal('')

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.id.set(params['id'])
    })
  }
}
