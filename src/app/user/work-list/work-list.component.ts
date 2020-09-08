import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/services/order.service';
import { UserService } from 'src/app/services/user.service';
import { Order } from 'src/app/services/order';
import { User } from 'src/app/services/user';
import { GraphicService } from 'src/app/services/graphic.service';
import { StorageService } from 'src/app/services/storage.service';
import { Observable } from 'rxjs';



//tslint:disable

interface Finder {
  presente: boolean;
  accettata: boolean;
  completa: boolean;
  esterna: boolean;
}


@Component({
  selector: 'app-work-list',
  templateUrl: './work-list.component.html',
  styleUrls: ['./work-list.component.scss']
})
export class WorkListComponent implements OnInit {
  displayedColumns: string[] = ['nome'];
  idRappresentante: string;
  elementdata: any[] = []
  cols: string[];
  input: string;
  panelOpenState: boolean[] = [false];
  order: Order[] = []
  user: User;
  users: User[] = [];
  selectedIDR: string;
  show: boolean = false;
  none: boolean = false;
  finder: Finder = {
    presente: false,
    accettata: false,
    completa: false,
    esterna: false,
  }
  statechecked: string;
  status = ['presente','accettata','completa','esterna','nuovi'];
  text: object =
    {
      presente: 'Bozza Presente',
      accettata: 'Bozza Accettata'
    }
  obs: Observable<any[]>;
  disable: boolean






  constructor(private orderService: OrderService,
    private userService: UserService,
    private graphicService: GraphicService,
    private storageService: StorageService) {

  }

  ngOnInit(): void {
    this.user = this.userService.getSubject().getValue();
    if (this.user.utente == 'rappresentante') {
      this.init$()

    }

    this.graphicService.getAllUser().subscribe((data) => {
      Object.entries(data).forEach(([key, value]) => {
        if (value['utente'] !== 'grafico') {
          this.users.push(new User(value['name'], value['email'], value['mobile'], value['utente'], value['uId'], value['graficoEmail']))
        }
      })
    });




  }

  ngAfterViewInit(): void {

  }
  prova(param: boolean){
    if (this.disable) {
      this.init$()
    }

  }

  onSubmit() {
    if (this.selectedIDR !== null && this.selectedIDR !== 'None') {
      this.show = false
      this.none = false
      this.elementdata = []
      this.order = []
      this.idRappresentante = this.selectedIDR;
      this.graphicService.setsubjectRappresentanteID(this.idRappresentante);
      this.init$()
    } else if (this.selectedIDR == 'None') {
      this.show = false
      this.none = true
      this.elementdata = []
    }

  }

  onTableSubmit(element) {

  }

  test(param: string){
    this.reset()

    let user: string;
    (this.user.utente !== 'grafico') ? user = this.user.uId : user = this.idRappresentante

    this.orderService.getAllOrder$(user).subscribe(
          (data) => {
            Object.entries(data).forEach(([key, value]) => {
              this.order.push(new Order(value['data'], value['oid'], value['nome'], value['pezzi'], value['progetto'],
                value['externalWork'], value['external'], value['completed'], value['draft'], value['draftAccepted']))
            }
            )
            switch(param){
              case 'presente': { this.elementdata = this.order.filter(res => { return res.draft[0] !== 'vuoto' && !res.external && !res.completed && !res.draftAccepted }); break }
              case 'accettata': { this.elementdata = this.order.filter(res => { return res.draftAccepted && !res.external && !res.completed}); break}
              case 'completa': { this.elementdata = this.order.filter(res => { return res.completed }); break}
              case 'esterna': { this.elementdata = this.order.filter(res => { return res.external }); break}
              case 'nuovi': { this.elementdata = this.order.filter(res => { return res.draft[0] == 'vuoto' && !res.draftAccepted && !res.external && !res.completed }); break }
            }
          })
  }

  search() {
    this.reset()
    if (this.user.utente == 'grafico') {
      if (this.input != "") {
        this.orderService.getAllOrder$(this.idRappresentante).subscribe(
          (data) => {
            Object.entries(data).forEach(([key, value]) => {
              this.order.push(new Order(value['data'], value['oid'], value['nome'], value['pezzi'], value['progetto'],
                value['externalWork'], value['external'], value['completed'], value['draft'], value['draftAccepted']))
            }
            )
            this.elementdata = this.order.filter(res => { return res.nome.match(this.input) })
          })
      }
      else if (this.input == "") { this.init$() }
    }
    else {
      if (this.input != "") {
        this.orderService.getAllOrder$(this.user.uId).subscribe(
          (data) => {
            Object.entries(data).forEach(([key, value]) => {
              this.order.push(new Order(value['data'], value['oid'], value['nome'], value['pezzi'], value['progetto'],
                value['externalWork'], value['external'], value['completed'], value['draft'], value['draftAccepted']))
            }
            )
            this.elementdata = this.order.filter(res => { return res.nome.match(this.input) })
          })
      }
      else if (this.input == "") { this.init$() }
    }

  }

  init$() {
    if (this.user.utente == 'grafico') {
      const subscription = this.orderService.getAllOrder$(this.idRappresentante).subscribe(
        (data) => {
          this.reset()
          if (data === undefined || data == null) {
            this.show = true
          }
          else {
            Object.entries(data).forEach(([key, value]) => {
              this.order.push(new Order(value['data'], value['oid'], value['nome'], value['pezzi'],
                value['progetto'], value['externalWork'], value['external'], value['completed'], value['draft'], value['draftAccepted']))
            })
            this.elementdata = this.order

          }


        }
      )
    }
    else {
      this.orderService.getAllOrder$(this.user.uId).subscribe(
        (data) => {
          this.reset()
          if (data === undefined || data == null) {
            this.show = true
          } else {
            this.show = false;
            Object.entries(data).forEach(([key, value]) => {
              console.log(value['completed'])
              this.order.push(new Order(value['data'], value['oid'], value['nome'], value['pezzi'], value['progetto'], value['externalWork'],
                value['external'], value['completed'], value['draft'], value['draftAccepted']))
            })
            this.elementdata = this.order
          }




        }
      )

    }

  }


  /**/

  removeItem(orderId: string, indexProject: number) {
    this.orderService.removeProject(orderId, indexProject).then(
      (data) => {
        this.init$()
      }
    ).catch(
      (error) => console.log(error)
    );

  }

  removeImg(orderId: string, projectNumber: string, valueImg: string, keyImg: string): Promise<any> {
    let img = valueImg.split('?')
    let imgx = img[0].split('%2F');
    const regex = /%20/gi;
    const regexcomma = /%2C/gi;
    let temp = imgx[3].replace(regex, ' ');
    let image = temp.replace(regexcomma, ',');
    return this.storageService.removeImgFk(this.user.uId, orderId, projectNumber, keyImg).then(
      () => {
        this.storageService.removeOrderImg(this.user.uId, orderId, image)
      }
    )


  }


  removeOrder(orderId: string) {
    const user = this.userService.getSubject().getValue();
    if (user.utente == 'grafico') {
      this.orderService.control(this.idRappresentante)
      this.userService.getListIdProjectFK(this.idRappresentante).then(snapshot => {

        snapshot.forEach(childSnapshot => {
          let childKey = childSnapshot.key;
          let childData = childSnapshot.val();
          if (childData == orderId) {
            this.orderService.removeOrder(childData, childKey, this.idRappresentante);
            this.userService.userListProject(user.uId).subscribe().unsubscribe();
            this.reset()
          }

        });



      });

    }

    else if (user.utente == 'rappresentante') {
      this.orderService.control(user.uId)
      this.userService.getListIdProjectFK(user.uId).then(snapshot => {
        snapshot.forEach(childSnapshot => {
          let childKey = childSnapshot.key;
          let childData = childSnapshot.val();
          if (childData == orderId) {
            this.orderService.removeOrder(childData, childKey, user.uId);
            this.userService.userListProject(user.uId).subscribe().unsubscribe();
            this.reset()
          }
        });
      });
    }
  }

  onFileInput(event, orderId, projectNumber, oldFile, keyImg: string) {
    let newFiles = event.target.files
    this.removeImg(orderId, projectNumber, oldFile, keyImg).then(() => {
      this.storageService.update(this.user.uId, orderId, projectNumber, newFiles)
    })



  }

  reset() {
    this.elementdata = []
    this.order = []
  }

  /*chiamata importante perchè mi chiude il subscribe con this.rappresentanteID
  e soprattutto crea un nuovo BehaviorSubject inizializzato a null*/
  ngOnDestroy() {
    this.graphicService.completesubjectRappresentanteID()
  }


}
