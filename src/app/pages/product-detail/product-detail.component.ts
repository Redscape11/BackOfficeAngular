import { Component, OnInit } from '@angular/core';
import { ProductsService } from 'app/services/products.service';
@Component({
  selector: 'app-productdetail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductdetailComponent implements OnInit {
  products;
  product;
  newPromotion;
  newQuantity;
  salePrice;
  copyDiscount;
  constructor(public productsService: ProductsService) {
    this.products = [];
    this.product = { name: 'Selectioner un produit', price: 0, discount: 0,salePrice :0, quantityInStock: 0 };
    this.salePrice = 0;
    this.copyDiscount=0;
  }

  ngOnInit() {
    this.getProductsAll();
    this.getProductId(1);
    this.onSelectProductId(12);
  }


  getProductsAll() {
    this.productsService.getProducts().subscribe(res => {
      this.products = res;
    },
      (err) => {
        alert('failed loading json data');
      });
  }

  getProductId(tig_id) {
    for (let p of this.products) {
      if (p.tig_id == tig_id) {
        this.product = p;
      }
    }
  }

  addSale(item) {
    this.copyDiscount = item.discount
    // this.salePrice = Math.round(((item.price / 100) * (100 - this.copyDiscount)) * 100) / 100
    this.salePrice = 6;
  }

  onSelectProduct(item) {
    this.getProductId(item.tig_id)
    this.copyDiscount = item.discount
    this.addSale(item)
  }
  onSelectProductId(tigId) {
    this.getProductId(tigId)
  }
  onModifyPromotion(item) {
    if (this.newPromotion) {
      this.copyDiscount= this.newPromotion
      this.productsService.setPromotion(item.tig_id, this.newPromotion).subscribe(res => {
        this.product = res;
      },
        (err) => {
          alert('failed loading json data');
        });
      this.getProductsAll();
    }
  }

  addQuantity(item) {
    if (this.newQuantity) {
      this.productsService.addQuantity(item.tig_id, this.newQuantity).subscribe(res => {
        this.product = res;
      },
        (err) => {
          alert('failed loading json data');
        });
      this.getProductsAll();
    }
  }
  removeQuantity(item) {
    if (this.newQuantity) {
      this.productsService.removeQuantity(item.tig_id, this.newQuantity).subscribe(res => {
        this.product = res;
      },
        (err) => {
          alert('failed loading json data');
        });
      this.getProductsAll();
    }
  }

}
