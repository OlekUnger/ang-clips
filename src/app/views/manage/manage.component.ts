import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-manage',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './manage.component.html',
  styleUrl: './manage.component.scss'
})
export class ManageComponent implements OnInit {
  public router = inject(Router)
  public route = inject(ActivatedRoute)
  public videoOrder = signal('asc')

  public sort($event: Event) {
    const {value} = $event.target as HTMLSelectElement
    this.router.navigate([], {relativeTo: this.route, queryParams: {sort: value}}).then()
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params: Params) => {
      this.videoOrder.set(params['sort'] === 'desc' ? 'desc' : 'asc')
    })
  }
}
