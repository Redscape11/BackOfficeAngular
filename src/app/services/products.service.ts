import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  url;

  constructor(public http: HttpClient) {
    this.url = "http://localhost:8000";  
  }

  getProducts(){
    return this.http.get(this.url + "/infoproducts/");
  }
  setPromotion(id, discount) {
    return this.http.get(this.url + "/modifyDiscount/" + id + "/" + discount + "/");
  }
  addQuantity(id, quantity){
    return this.http.get(this.url + "/incrementStock/" + id + "/" + quantity + "/");
  }
  removeQuantity(id, quantity) {
    return this.http.get(this.url + "/decrementStock/" + id + "/" + quantity + "/");
  }
  getProductCategories(category){
    return this.http.get(this.url + "/" + category + "/");
  }
  postTransaction(trans) {
    return this.http.post(this.url + "/transactions/", trans);
  }
  getTransaction() {
    return this.http.get(this.url + "/transactions/");
  }
  getTransactionCategory(category) {
    console.log(category)
    return this.http.get(this.url + "/transactions/" + category + "/");
  }
}
