import { Routes } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { ListproductsComponent } from '../list-products/list-products.component';
import { ProductdetailComponent } from '../product-detail/product-detail.component';


export const HomeRoutes: Routes = [
    { path: 'dashboard',      component: DashboardComponent },
    { path: 'detailproduct',          component: ProductdetailComponent },
    { path: 'listproducts',          component: ListproductsComponent },
    
];
