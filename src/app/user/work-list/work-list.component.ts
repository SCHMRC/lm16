import { Component, OnInit, ViewChild } from '@angular/core';
import { OrderService } from 'src/app/services/order.service';
import { UserService } from 'src/app/services/user.service';
import { Order } from 'src/app/services/order';
import { User } from 'src/app/services/user';
import { GraphicService } from 'src/app/services/graphic.service';
import { StorageService } from 'src/app/services/storage.service';
import { Observable } from 'rxjs';
import { Part } from 'src/app/services/part';
import { Parts } from 'src/app/services/parts';
import { Project } from 'src/app/services/project';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';



//tslint:disable

interface Finder {
  presente: boolean;
  accettata: boolean;
  completa: boolean;
  esterna: boolean;
}

interface Elementiveicolo {
  ido: string;
  idp: any;
  numeroLista: number[];
  parti: Parts;
  descrizioniParti: Part[];
}

interface Veicolo {
  ido: string;
  idp: any;
  tipo: string,
  parts: Parts,
  numeroLista: number[];
  parti: string[];
  descrizioniParti: Part[];
}

interface Ordine{
  order: Order,
  veicolo?: Veicolo
}


@Component({
  selector: 'app-work-list',
  templateUrl: './work-list.component.html',
  styleUrls: ['./work-list.component.scss']
})
export class WorkListComponent implements OnInit {
  ordine: Ordine[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  /**/
  numeroListaId: number[][] = [];
  elementiveicolo: Elementiveicolo[] = []
  part: Part[] = [];
  parts: Parts;
/**/
  displayedColumns: string[] = ['nome'];
  idRappresentante: string;
  elementdata: any[] = [];
  dataSource: MatTableDataSource<Ordine>;
  cols: string[];
  input: string;
  panelOpenState: boolean[] = [false];
  order: Order[] = []
  project: Project[] = [];
  user: User;
  users: User[] = [];
  selectedIDR: string;
  show: boolean = false;
  none: boolean = false;
  date: Date;
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

  onChange() {
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
            switch(param){
              case 'presente': {
                this.elementdata = this.getOrder(data).filter(res => { return res.order.draft[0] !== 'vuoto' && !res.order.external && !res.order.completed && !res.order.draftAccepted })
                this.dataSource = new MatTableDataSource<Ordine>(this.elementdata);
                this.dataSource.paginator = this.paginator;
                this.obs = this.dataSource.connect();
                break
              }
              case 'accettata': {
                this.elementdata = this.getOrder(data).filter(res => { return res.order.draftAccepted && !res.order.external && !res.order.completed });
                this.dataSource = new MatTableDataSource<Ordine>(this.elementdata);
                this.dataSource.paginator = this.paginator;
                this.obs = this.dataSource.connect();
                break}
              case 'completa': {
                this.elementdata = this.getOrder(data).filter(res => { return res.order.completed });
                this.dataSource = new MatTableDataSource<Ordine>(this.elementdata);
                this.dataSource.paginator = this.paginator;
                this.obs = this.dataSource.connect();
                break}
              case 'esterna': {
                this.elementdata = this.getOrder(data).filter(res => { return res.order.external });
                this.dataSource = new MatTableDataSource<Ordine>(this.elementdata);
                this.dataSource.paginator = this.paginator;
                this.obs = this.dataSource.connect();
                break}
              case 'nuovi': {
                this.elementdata = this.getOrder(data).filter(res => { return res.order.draft[0] == 'vuoto' && !res.order.draftAccepted && !res.order.external && !res.order.completed });
                this.dataSource = new MatTableDataSource<Ordine>(this.elementdata);
                this.dataSource.paginator = this.paginator;
                this.obs = this.dataSource.connect();
                break }
            }
          })
  }

  search() {
    this.reset()
    if (this.user.utente == 'grafico') {
      if (this.input != "") {
        this.orderService.getAllOrder$(this.idRappresentante).subscribe(
          (data) => {
            this.elementdata = this.getOrder(data).filter(res => { return res.order.nome.match(this.input) })
            this.dataSource = new MatTableDataSource<Ordine>(this.elementdata);
            this.dataSource.paginator = this.paginator;
            this.obs = this.dataSource.connect();
          })
      }
      else if (this.input == "") { this.init$() }
    }
    else {
      if (this.input != "") {
        this.orderService.getAllOrder$(this.user.uId).subscribe(
          (data) => {
            this.elementdata = this.getOrder(data).filter(res => { return res.order.nome.match(this.input) })
            this.dataSource = new MatTableDataSource<Ordine>(this.elementdata);
            this.dataSource.paginator = this.paginator;
            this.obs = this.dataSource.connect();

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
            this.elementdata = this.getOrder(data)
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
            this.elementdata = this.getOrder(data)
            this.dataSource = new MatTableDataSource<Ordine>(this.elementdata);
            this.dataSource.paginator = this.paginator;
            this.obs = this.dataSource.connect();

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
    this.elementiveicolo = []
    this.elementdata = []
    this.order = []
    this.ordine = []
  }

  /*chiamata importante perchè mi chiude il subscribe con this.rappresentanteID
  e soprattutto crea un nuovo BehaviorSubject inizializzato a null*/
  ngOnDestroy() {
    /* this.graphicService.completesubjectRappresentanteID() */
  }

  searchFromData(){
    this.reset()
    let user: string
    (this.user.utente !== 'grafico') ? user = this.user.uId : user = this.idRappresentante
    let dataSearch = `${("0" + (this.date.getMonth() + 1)).slice(-2)}/${("0" + this.date.getDate()).slice(-2)}/${this.date.getFullYear()}`;
    this.orderService.getAllOrder$(user).subscribe(
      (data) => {
        this.elementdata = this.getOrder(data).filter(res => { return res.order.data == dataSearch });
        this.dataSource = new MatTableDataSource<Ordine>(this.elementdata);
        this.dataSource.paginator = this.paginator;
        this.obs = this.dataSource.connect();
      })

  }

  getOrder(data: any[]): Ordine[]{
    this.show = false;
    let veicolo: Veicolo;
    Object.entries(data).forEach(([key, value]) => {
      let order: Order = new Order(value['data'], value['oid'], value['nome'], value['pezzi'], value['progetto'], value['externalWork'],
        value['external'], value['completed'], value['draft'], value['draftAccepted'], value['modifiche'], value['datadraftAccepted'], value['dataInvio'])


      Object.entries(value['progetto']).forEach((key, valueP) => {
        let k = key[0]
        let element = key[1];
        let idString: string[] = [];


        if (element['materiale'] == 'Veicolo') {
          element['descrizioneVeicolo'].forEach(element => {
            idString.push(element['id'])
          })
          veicolo = this.setVeicolo(element['tipoVeicolo'], element['descrizioneVeicolo'], value['oid'], k, idString)
        }
      })

      if (veicolo !== undefined && veicolo.ido == order.oid) {
        let obj: Ordine;
        obj = {
          order: order,
          veicolo: veicolo,
        }
        this.ordine.push(obj)
      } else {
        this.ordine.push({
          order: order,
        })

      }
    })

    return this.ordine;

  }

  setVeicolo(tipoVeicolo: string, descrizioneVeicolo: Part[], ordineId: string,idProgetto: string ,idString: string[]): Veicolo {
    let parts: Parts = new Parts();
    let veicolo: Veicolo;
    let numeroListaId: number[] = [];
    let lista: any[] = [];
    switch (tipoVeicolo) {
      case 'Fiorino':
        numeroListaId = [];
        for (let i = 4; i <= 13; i++) {
          numeroListaId.push(i)
        }
        lista = []
        idString.forEach(element => {
          lista = element.split('-')
          parts[lista[1]] = true;
        })

        break;
      case 'Furgone Maxi': {
        numeroListaId = [];
        for (let i = 1; i <= 16; i++) {
          numeroListaId.push(i)
        }
        let lista = []
        idString.forEach(element => {
          lista = element.split('-')
          parts[lista[1]] = true;
        })
        break;
      }
    }
    veicolo = {
      ido: ordineId,
      idp: idProgetto,
      parti: idString,
      parts: parts,
      tipo: tipoVeicolo,
      numeroLista: numeroListaId,
      descrizioniParti: descrizioneVeicolo ,
    }

    return veicolo

  }


}
