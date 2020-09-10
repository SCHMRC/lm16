import { Component, OnInit } from '@angular/core';
import { OrderService } from '../services/order.service';
import * as moment from 'moment';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { Order } from '../services/order';
import { GraphicService } from '../services/graphic.service';
//tslint:disable

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  data: any;
  subject: any;
  show: boolean;
  modifiche = '';
  user = '';
  order: Order[] = [];


  constructor(private userService: UserService, private orderService: OrderService, private graphicService: GraphicService) {
    this.show = false;
  }

  ngOnInit(): void {

    this.userService.getAuthenticated().subscribe((value) => {
      (value) ? this.show = true : this.show = false;
    })

    if (this.show) {
      let draftElement: any[] = [];
      this.userService.getSubject().subscribe((user) => {
        let param: string
        if (user.utente == 'grafico') {
          this.graphicService.getsubjectRappresentanteID().subscribe(user=>{
          this.orderService.getAllOrder(user).then((snapshot) => {
            let k = snapshot.key;
            let v = snapshot.val();
            Object.entries(v).forEach(([key, value]) => {
              if (value['modifiche']) {
                this.order.push(new Order(value['data'], key, value['nome'], value['pezzi'], value['progetto'], value['externalWork'], value['external'], value['completed'], value['draft'], value['draftAccepted'], value['modifiche']))
              }
            })
          })

        })}
        else {
          this.orderService.getAllOrder(user.uId).then((snapshot) => {
            let k = snapshot.key;
            let v = snapshot.val();
            Object.entries(v).forEach(([key, value]) => {
              if (value['modifiche']) {
                this.order.push(new Order(value['data'], key, value['nome'], value['pezzi'], value['progetto'], value['externalWork'], value['external'], value['completed'], value['draft'], value['draftAccepted'], value['modifiche']))
              }
            })
          })}
      })






    }

  }
}
