import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { Parts } from 'src/app/services/parts';
import { Part } from './../../../services/part';
import { FormGroup, FormControl, FormGroupName, FormBuilder, FormArray } from '@angular/forms';
import * as Rx from 'rxjs';
import { OrderService } from 'src/app/services/order.service';
//tslint:disable

class Parti {
  1?: boolean = false;
  2?: boolean = false;
  3?: boolean = false;
  4?: boolean = false;
  5?: boolean = false;
  6?: boolean = false;
  7?: boolean = false;
  8?: boolean = false;
  9?: boolean = false;
  10?: boolean = false;
  11?: boolean = false;
  12?: boolean = false;
  13?: boolean = false;
}

@Component({
  selector: 'app-fiorino',
  templateUrl: './fiorino.component.html',
  styleUrls: ['./fiorino.component.scss']
})
export class FiorinoComponent implements OnInit {
  i: number[] = [];
  elements: number[] = [];
  idElements: string[] = [];
  numero: number;
  formParent: FormGroup;
  part: Part[] = [];
  parti: Parti;


  parts: Parts;

  constructor(private orderService: OrderService, private fb: FormBuilder) {
    this.formParent = this.fb.group({
      'child': this.fb.array([this.initChild(-1)])
    })

    this.formParent.valueChanges.subscribe(data => {
      this.orderService.setDescrizioniVeicoli(data.child);

    })
    this.parti = new Parti()
    for (let i = 4; i < 14; i++) {
      this.elements.push(i)
    }
    for (let i = 1; i < 14; i++) {
      this.i.push(i)
    }

  }



  ngOnInit(): void {
  }

  initChild(param) {
    return this.fb.group({
      'id': new FormControl(param),
      'base': new FormControl(),
      'altezza': new FormControl(),
      'contenuto': new FormControl(),
      'materiale': new FormControl(),
    })

  }

  test(evento) {
    const control = this.formParent.controls['child'] as FormArray; // ASSERTION asserzione IMPORTANTE
    this.idElements = [];
    let id: string[] = [];
    console.log(evento.target.id)
    let numero: string = evento.target.id;

    id = numero.split('-');

    (this.parti[id[1]]) ? this.parti[id[1]] = false : this.parti[id[1]] = true;
    this.i.forEach(element => {
      if (this.parti[element]) {
        let stringa = `id-${element}`;
        this.idElements.push(stringa);
      }
    });
    console.log(this.idElements)

    let k = 0;

    Object.entries(this.formParent.value['child']).forEach(([key, value]) => {
      if (value['id'] == numero) {
        k = Number(key);
      }
    })

    if (this.parti[id[1]]) {
      control.push(this.initChild(evento.target.id));
    } else {
      control.removeAt(k);

    }


  }

}
