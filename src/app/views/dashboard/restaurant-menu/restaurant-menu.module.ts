import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestaurantMenuComponent } from './restaurant-menu.component';
import { Routes, RouterModule } from '@angular/router';
import { RestaurantMenuOverviewComponent } from './restaurant-menu-overview/restaurant-menu-overview.component';
import { RestaurantMenuMenusComponent } from './restaurant-menu-menus/restaurant-menu-menus.component';

const routes: Routes = [
  {
    path: '',
    component: RestaurantMenuComponent,
    children: [
      {
        path: 'overview',
        component: RestaurantMenuOverviewComponent
      },
      {
        path: 'menus',
        component: RestaurantMenuMenusComponent
      },
      {
        path: '**',
        redirectTo: 'overview',
        pathMatch: 'full'
      }
    ]
  },
]
const restaurantMenuRouting = RouterModule.forChild(routes);

@NgModule({
  declarations: [RestaurantMenuComponent, RestaurantMenuOverviewComponent, RestaurantMenuMenusComponent],
  imports: [
    CommonModule,
    restaurantMenuRouting
  ]
})
export class RestaurantMenuModule { }
