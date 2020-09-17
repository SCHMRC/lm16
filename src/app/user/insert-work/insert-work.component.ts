import { Component, OnInit, NgZone, ViewChild, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, AbstractControl, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatInput } from '@angular/material/input';
import { AuthService } from 'src/app/services/auth.service';
import { OrderService } from 'src/app/services/order.service';
import { StorageService } from 'src/app/services/storage.service';
import { User } from 'src/app/services/user';
import { UserService } from 'src/app/services/user.service';
import { TIPO, SPESSORE, FORMATI, ORIENTAMENTO, EXTERNALWORK, FORMA, TIPOVEICOLO} from './../../services/material-list';
import { take } from 'rxjs/operators';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import * as Rx from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import {Project} from './../../services/project';
import { Order } from 'src/app/services/order';
import * as id from 'shortid';
import { Part } from 'src/app/services/part';
//tslint:disable

@Component({
  selector: 'app-insert-work',
  templateUrl: './insert-work.component.html',
  styleUrls: ['./insert-work.component.scss']
})
export class InsertWorkComponent implements OnInit {
  tipoVeicolo: string[] = [];
  dragDropConfig = {
    showList: true,
    showProgress: true
  };
  isEditable = false;
  erroMsg: any;
  tipo: string[] = [];
  spessore: number[] = [];
  project: Project[] = [];
  user: User;
  order: Order;
  orderId: string;
  subject: Rx.BehaviorSubject<any> = new Rx.BehaviorSubject(null);
  showModal: Rx.BehaviorSubject<boolean> = new Rx.BehaviorSubject(false);
  @ViewChild('autosize') autosize: CdkTextareaAutosize;
  key: number;
  forma: any[] = [];
  miostile: Object;
  imageUrl: string[][] = [];
  reset: boolean = false;
  externalWork: string[] = []
  draft: any[] = ['vuoto'];
  listaForm: FormGroup[] = [];
  formatiStampa: string[];
  orientamento: string[];



  formGroup: FormGroup; //<-Parent form
  formList: FormGroup[] = [];
  pezzi = 1;


  get formArray(): AbstractControl | null { return this.formGroup.get('formArray'); }

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private orderService: OrderService,
    private _ngZone: NgZone,
    private toastr: ToastrService) {
    this.tipo = TIPO;
    this.spessore = SPESSORE;
    this.miostile = {
      width: '200px',
      height: '200px',
      border: 'solid 1px black',
    }


  }

  ngOnInit(): void {
    this.tipoVeicolo = TIPOVEICOLO;
    this.externalWork = EXTERNALWORK;
    this.forma = FORMA;
    this.formatiStampa = FORMATI;
    this.orientamento = ORIENTAMENTO;

    this.orderId = id.generate();
    this.userService.setOrderId(this.orderId);

    this.subject.next(this.setLista(this.pezzi))
    this.subject.subscribe((data) => { this.formList = data })

    this.formGroup = this.setOrder();
  }


  onSubmit() {
    this.project = [];
    let descrizioneVeicolo: Part[] = [];
    let count = 0;
    this.formList.forEach(element => {
      let urlL: string[] = [];
      (this.imageUrl[count]) ? urlL = this.imageUrl[count] : urlL = [null]

      this.orderService.getDescrizioneVeicoli().subscribe(descrizione =>{
        if(descrizione !== null){
          descrizione.forEach(element => {
            if (Number(element.id) !== -1) {
              descrizioneVeicolo.push(element)
            }
          });
        }

        this.project.push(
          {
            image: urlL,
            projectNumber: count++,
            luminosa: element['value']['luminosa'],
            palo: element['value']['palo'],
            forma: element['value']['forma'],
            tipoVeicolo: element['value']['tipoVeicolo'],
            descrizioneVeicolo: descrizioneVeicolo,
            materiale: element['value']['materiale'],
            orientamento: element['value']['orientamento'],
            plastificato: element['value']['plastificato'],
            formati: element['value']['formati'],
            spessore: element['value']['spessore'],
            laminazione: element['value']['laminazione'],
            calpestabile: element['value']['calpestabile'],
            colore: element['value']['colore'],
            opalino: element['value']['opalino'],
            pieghe: element['value']['pieghe'],
            occhielli: element['value']['occhielli'],
            base: element['value']['base'],
            altezza: element['value']['altezza'],
            lato: element['value']['lato'],
            diametro: element['value']['diametro'],
            copie: element['value']['copie'],
            bifacciale: element['value']['bifacciale'],
            note: element['value']['note']
          })

      });

      this.order = new Order(
        moment().calendar('DD MM YY'),
        this.userService.getOrderId().getValue(),
        this.formGroup['value']['nome'],
        this.formGroup['value']['elementi_progetto'],
        this.project,
        this.formGroup['value']['externalWork'],
        false,
        false,
        this.draft,
        false,
        false,
        '',
        ''
      )

      this.userService.setProject(this.project);

      this.userService.getSubject().subscribe((user) => {
        this.orderService.insertOrder(user, this.order)
        this.orderService.control(user.uId)
      })

      this.userService.updateListOrder(this.order)
      this.showSuccess()
      })

  }


  public isChange(event: MatInput) {
    this.orderService.setReset$(true)
    this.imageUrl= []
    this.pezzi = event['target']['value'];
    this.subject.next(this.setLista(this.pezzi))
    this.subject.subscribe((data) => {
      this.formList = data
    })
  }

  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable.pipe(take(1))
      .subscribe(() => this.autosize.resizeToFitContent(true));
  }

  private setOrder(): FormGroup {
    return this.formBuilder.group({
      nome: new FormControl('', Validators.required),
      elementi_progetto: new FormControl(1, [Validators.required, Validators.min(1), Validators.max(15)]),
      externalWork: new FormControl('interno')
    })

  }


  private setLista(param: number): FormGroup[] {
    const form: FormGroup[] = [];
    for (let i = 0; i < this.pezzi; i++) {
      form[i] =
        new FormGroup({
          luminosa: new FormControl(),
          calpestabile: new FormControl(),
          palo: new FormControl(),
          materiale: new FormControl(''),
          orientamento: new FormControl(''),
          plastificato: new FormControl(),
          formati: new FormControl(''),
          copie: new FormControl(''),
          tipoVeicolo: new FormControl('',[]),
          descrizioneVeicolo: new FormControl(''),
          forma: new FormControl(),
          spessore: new FormControl(),
          colore: new FormControl(),
          opalino: new FormControl(),
          pieghe: new FormControl(),
          occhielli: new FormControl(),
          laminazione: new FormControl(),
          base: new FormControl(''),
          altezza: new FormControl(''),
          lato: new FormControl(''),
          diametro: new FormControl(''),
          bifacciale: new FormControl(),
          note: new FormControl()
        })
    }
    return form

  }

  setOut(event, numero) {
    this.imageUrl[numero]= event
  }

  showSuccess() {
    this.toastr.success('Ordine aggiunto, in caso di eventuali dubbi verrai ricontattato!', 'Ben Fatto!');
  }

  resetValue(){
    this.formGroup = this.setOrder();
    this.project = [];
    this.order = null;
    this.pezzi = 1;
    this.orderId = id.generate();
    this.userService.setOrderId(this.orderId);
  }

}
