import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthComponentComponent } from './auth-component/auth-component.component';
import { MapComponent } from './components/map/map.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
 
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
    component: MapComponent
  },
  {
    path: 'home',
    component: HomeComponent
  }, 


];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
