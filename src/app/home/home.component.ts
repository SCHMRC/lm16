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
  draftAccepted: Order[] = [];
  listModifiche: Order[] = [];
  ordineInviato: Order[] = []
  date: Date;
  dataAccettata: string;


  constructor(private userService: UserService, private orderService: OrderService, private graphicService: GraphicService) {
    this.date = new Date();
    this.show = false;
  }

  ngOnInit(): void {
    this.dataAccettata = `${("0" + this.date.getDate()).slice(-2)}/${("0" + (this.date.getMonth() + 1)).slice(-2)}/${this.date.getFullYear()}`;

    this.userService.getAuthenticated().subscribe((value) => {
      (value) ? this.show = true : this.show = false;
    })

    if (this.show) {

      this.userService.getSubject().subscribe((user) => {
        let predicatedraftAccepted = (param: Order) => { return param.draftAccepted == true && param.datadraftAccepted == this.dataAccettata };
        let predicateModifiche = (param: Order) => { return param.modifiche == true && param.draftAccepted == false }
        let predicateOrdineInviato = (param: Order) => { return param.dataInvio !== '' && !!param.dataInvio}
        let param: string
        if (user.utente == 'grafico') {
          this.graphicService.getsubjectRappresentanteID().subscribe(user=>{
          this.orderService.getAllOrder(user).then((snapshot) => {
            let k = snapshot.key;
            let v: any[] = snapshot.val();
            Object.entries(v).forEach(([key, value]) => {
              this.order.push(new Order(value['data'], key, value['nome'], value['pezzi'], value['progetto'], value['externalWork'], value['external'], value['completed'], value['draft'], value['draftAccepted'], value['modifiche'], value['datadraftAccepted'], value['dataInvio']))
            })
            this.draftAccepted = this.order.filter(predicatedraftAccepted)
            this.listModifiche = this.order.filter(predicateModifiche)
            this.ordineInviato = this.order.filter(predicateOrdineInviato)

          })

        })}
        else {
          this.orderService.getAllOrder(user.uId).then((snapshot) => {
            let k = snapshot.key;
            let v = snapshot.val();
            Object.entries(v).forEach(([key, value]) => {
              this.order.push(new Order(value['data'], key, value['nome'], value['pezzi'], value['progetto'], value['externalWork'], value['external'], value['completed'], value['draft'], value['draftAccepted'], value['modifiche'], value['datadraftAccepted'], value['dataInvio']))
            })
            this.draftAccepted = this.order.filter(predicatedraftAccepted)
            this.listModifiche = this.order.filter(predicateModifiche)
            this.ordineInviato = this.order.filter(predicateOrdineInviato)
          })}
      })






    }

  }
}
