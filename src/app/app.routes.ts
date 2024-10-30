import { AuthGuard, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import {ActivatedRoute, ActivatedRouteSnapshot, ResolveFn, Routes} from '@angular/router';
import { AboutComponent } from './views/about/about.component';
import { ClipComponent } from './views/clip/clip.component';
import { HomeComponent } from './views/home/home.component';
import { ManageComponent } from './views/manage/manage.component';
import { NotFoundComponent } from './views/not-found/not-found.component';
import { UploadComponent } from './views/upload/upload.component';
import {ClipModel} from "./models/clip.model";
import {ClipService} from "./services/clip/clip.service";
import {inject} from "@angular/core";

const redirectUnauthorizedToHome = () => redirectUnauthorizedTo('/')
const clipResolver: ResolveFn<ClipModel | null> = (route: ActivatedRouteSnapshot) => {
  return inject(ClipService).resolve(route.paramMap.get('id')!)
}

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'about',
    component: AboutComponent,
    title: 'About',
  },
  {
    path: 'manage',
    component: ManageComponent,
    title: 'Manage',
    data: {authOnly: true, authGuardPipe: redirectUnauthorizedToHome},
    canActivate: [AuthGuard]
  },
  {
    path: 'upload',
    component: UploadComponent,
    title: 'Upload',
    data: {authOnly: true, authGuardPipe: redirectUnauthorizedToHome},
    canActivate: [AuthGuard]
  },
  {
    path: 'clip/:id',
    component: ClipComponent,
    data: {authOnly: true, authGuardPipe: redirectUnauthorizedToHome},
    canActivate: [AuthGuard],
    resolve: {clip: clipResolver}
  },
  {
    path: '**',
    component: NotFoundComponent,
    title: '404'
  }
];
