import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule} from '@angular/forms';

import { LbdModule } from '../../features/lbd/lbd.module';
import { HomeRoutes } from './home.routing';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { ListproductsComponent } from '../list-products/list-products.component';
import { ProductdetailComponent } from '../product-detail/product-detail.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(HomeRoutes),
    FormsModule,
    LbdModule,
  ],
  declarations: [
    DashboardComponent,
    ProductdetailComponent,
    ListproductsComponent,
  ]
})
export class HomeModule {}
