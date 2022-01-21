import { Component, OnInit } from '@angular/core';
import { LocationStrategy, PlatformLocation, Location } from '@angular/common';
import { LegendItem, ChartType } from '../../features/lbd/lbd-chart/lbd-chart.component';
import * as Chartist from 'chartist';
import { ProductsService } from 'app/services/products.service';
import {ListproductsComponent } from 'app/pages/list-products/list-products.component'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

    emailChartType: ChartType;
    emailChartData: any;
    emailChartLegendItems: LegendItem[];
	
    hoursChartType: ChartType;
    hoursChartOptions: any;
    hoursChartResponsive: any[];
    hoursChartLegendItems: LegendItem[];
	
	activityChartType: ChartType;
    activityChartData: any;
    activityChartOptions: any;
    activityChartResponsive: any[];
    activityChartLegendItems: LegendItem[];
    
    PoissonsQuantity;
    CrustacesQuantity;
    CoquillagesQuantity;
    products;
    categories = [
      { "id": 1, "category": 0,"name":"poissons", "products": null  },
      { "id": 2, "category": 1,"name":"coquillages", "products": null },
      { "id": 3, "category": 2, "name":"crustaces","products": null },
    ];

    public transactions :any;
  constructor(public productsService: ProductsService) {

  }

  ngOnInit() {
	  
	  this.emailChartType = ChartType.Pie;
      this.emailChartLegendItems = [
        { title: 'Poissons', imageClass: 'fa fa-circle text-info' },
        { title: 'Coquillages', imageClass: 'fa fa-circle text-warning' },
        { title: 'Crustacés', imageClass: 'fa fa-circle text-danger' }
      ];
     
      this.hoursChartType = ChartType.Line;
      this.hoursChartOptions = {
        low: -20,
        high: 100,
        showArea: true,
        height: '245px',
        axisX: {
          showGrid: false,
        },
        lineSmooth: Chartist.Interpolation.simple({
          divisor: 3
        }),
        showLine: true,
        showPoint: true,
      };
      this.hoursChartResponsive = [
        ['screen and (max-width: 640px)', {
          axisX: {
            labelInterpolationFnc: function (value) {
              return value[0];
            }
          }
        }]
      ];
      this.hoursChartLegendItems = [
        { title: 'Chiffre daffaires', imageClass: 'fa fa-circle text-info' },
        { title: 'Marge', imageClass: 'fa fa-circle text-warning' },
        { title: 'Cout', imageClass: 'fa fa-circle text-danger' }
      ];
     
      
	  this.activityChartType = ChartType.Bar;
      this.activityChartOptions = {
        seriesBarDistance: 10,
        axisX: {
          showGrid: false
        },
        height: '245px'
      };
      this.activityChartResponsive = [
        ['screen and (max-width: 640px)', {
          seriesBarDistance: 5,
          axisX: {
            labelInterpolationFnc: function (value) {
              return value[0];
            }
          }
        }]
      ];
      this.activityChartLegendItems = [
        { title: 'Poissons', imageClass: 'fa fa-circle text-info' },
        { title: 'Coquillages', imageClass: 'fa fa-circle text-danger' },
        { title: 'Crustaces', imageClass: 'fa fa-circle text-warning' }
      ];
      this.getProducts();
      this.getTransaction();
      this.getTotalQuantityByCategory();
      this.getTotalSalesByCategory();
      this.getTransaction();
    }
    getTransaction() {
      this.productsService.getTransaction().subscribe(res => {
        this.transactions = res;
      },
        (err) => {
          alert('failed loading json data');
        });
    }
    getchiffreAffaires(){
      let labels = [];
      let CA = [];
      let Cout = [];
      let Marge = [];
      let chiffreAffaires = 0
      let today = new Date();
      let todayYear = today.getFullYear();
      for (let i = 0; i < this.transactions.length; i++) {
        let dateExist = false
        let date = new Date(this.transactions[i].created)
        let transacYear = date.getFullYear();
        let transacMonth = date.toLocaleString('default', { month: 'long' })
        if (this.transactions[i].type == "Sale") {
          if (transacYear == todayYear) {
            chiffreAffaires = chiffreAffaires + this.transactions[i].price
            for (let j = 0; j < labels.length; j++) {
              if (labels[j] == transacMonth) {
                CA[j] = CA[j] + this.transactions[i].price
                Marge[j] = Marge[j] + this.transactions[i].price
                dateExist = true;
              }
            }
            if (dateExist == false) {
              Cout[Cout.length] = 0
              CA[CA.length] = this.transactions[i].price;
              labels[labels.length] = transacMonth;
              Marge[Marge.length] = this.transactions[i].price
            }
          }
        }
        else if (this.transactions[i].type == "Purchase"){
          if (transacYear == todayYear) {
            for (let j = 0; j < labels.length; j++) {
              if (labels[j] == transacMonth) {
                Cout[j] = Cout[j] + this.transactions[i].price
                Marge[j] = Marge[j] - this.transactions[i].price
                dateExist = true;
              }
            }
            if (dateExist == false) {
              CA[CA.length] = 0
              Cout[Cout.length] = this.transactions[i].price;
              labels[labels.length] = transacMonth;
              Marge[Marge.length] = (0 - this.transactions[i].price)
            }
          }
        }
      }
      return {
        labels : labels,
        series : [CA,Marge,Cout]
      }
	  getProductsAll() {
      for (let i = 0; i < this.categories.length; i++){
        this.getProductsCategory(this.categories[i].category);
      }
    }
  
    getProductsCategory(cat) {
      this.productsService.getProductCategories(cat).subscribe(res => {
        for (let i = 0; i < this.categories.length; i++)
          if (this.categories[i].category == cat) {
            this.categories[i].products = res;
          }
      },
        (err) => {
          alert('failed loading json data');
        });
    }
    getProducts() {
      this.productsService.getProducts().subscribe(res => {
        this.products = res;
      },
        (err) => {
          alert('failed loading json data');
        });
    }
    getTotalQuantityByCategory(){
      let res =[]
      let poissonQuantity=0
      let coquillageQuantity=0
      let crustacesQuantity=0
      for (let i = 0; i < this.products.length; i++) 
        if (this.products[i].category ==0)
          poissonQuantity+=this.products[i].quantityInStock;
        else if (this.products[i].category ==1)
          coquillageQuantity+=this.products[i].quantityInStock;
        else
        crustacesQuantity+=this.products[i].quantityInStock;
      let total = poissonQuantity+coquillageQuantity+crustacesQuantity
      let poisson = ((poissonQuantity/total)*100).toFixed(2);
      let coquillage = ((coquillageQuantity/total)*100).toFixed(2)
      let crustaces = ((crustacesQuantity/total)*100).toFixed(2)
      
      return {
        labels :[poisson.toString()+'%',coquillage.toString()+'%',crustaces.toString()+'%'],
        series :[poisson,coquillage,crustaces]
      }
    }
    getTotalSalesByCategory(){
      let res =[]
      let poissonSales=0
      let coquillagesSales=0
      let crustacesSales=0
      for (let i = 0; i < this.products.length; i++) 
        if (this.products[i].category ==0)
          poissonSales+=this.products[i].nombre_produit_vendu;
        else if (this.products[i].category ==1)
          coquillagesSales+=this.products[i].nombre_produit_vendu;
        else
        crustacesSales+=this.products[i].nombre_produit_vendu;
      let total = poissonSales+coquillagesSales+crustacesSales
      let poisson = ((poissonSales/total)*100).toFixed(2);
      let coquillage = ((coquillagesSales/total)*100).toFixed(2)
      let crustaces = ((crustacesSales/total)*100).toFixed(2)
      
      return {
        labels :['Nombre de produits vendus'],
        series :[[poissonSales],[coquillagesSales],[crustacesSales]]
      }
    }
    }
 
}
