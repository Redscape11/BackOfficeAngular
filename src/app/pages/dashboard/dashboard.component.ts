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

    
    public hoursChartType: ChartType;
    public hoursChartOptions: any;
    public hoursChartResponsive: any[];
    public hoursChartLegendItems: LegendItem[];

    public transactions :any;

  constructor(public productsService: ProductsService) {

  }

  ngOnInit() {
     
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
    }
 
}
