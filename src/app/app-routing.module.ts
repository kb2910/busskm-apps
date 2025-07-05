import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthComponentComponent } from './auth-component/auth-component.component';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./map/map.module').then( m => m.MapPageModule)
  },
  {
    path: '',
    component: AuthComponentComponent
  },
  {
    path: 'auth',
    component: AuthComponentComponent
  },
  {
    path: 'map',
    loadChildren: () => import('./map/map.module').then( m => m.MapPageModule)
  }

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
