import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { Parts } from 'src/app/services/parts';
import { Part } from './../../../services/part';
import { FormGroup, FormControl, FormGroupName, FormBuilder, FormArray } from '@angular/forms';
import * as Rx from 'rxjs';
import { OrderService } from 'src/app/services/order.service';
//tslint:disable
interface misura {
  id: number;
  base: number;
  altezza: number;
}

@Component({
  selector: 'app-ducato-maxi',
  templateUrl: './ducato-maxi.component.html',
  styleUrls: ['./ducato-maxi.component.scss']
})
export class DucatoMaxiComponent implements OnInit {
  i: number[] = [];
  elements: number[] = [];
  idElements: string[] = [];
  numero: number;
  parti: Part[] = [];
  formParent: FormGroup;
  part: Part[] = [];

  parts: Parts;

  constructor(private orderService: OrderService, private fb: FormBuilder) {
    this.formParent = this.fb.group({
      'child' : this.fb.array([this.initChild(-1)])
    })

    this.formParent.valueChanges.subscribe(data=>{
      this.orderService.setDescrizioniVeicoli(data.child);

    })
    this.parts = new Parts();
    for (let k = 0; k < 16; k++) {
      this.i.push(k + 1);
    }
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

  ngOnInit(): void {}


  test(evento) {
    const control = this.formParent.controls['child'] as FormArray; // ASSERTION asserzione IMPORTANTE
    this.elements = [];
    this.idElements = [];
    let id: string[] = [];
    let numero: string = evento.target.id;

    id = numero.split('-');
    (this.parts[id[1]]) ? this.parts[id[1]] = false : this.parts[id[1]] = true;
    this.i.forEach(element => {
      if (this.parts[element]) {
        let stringa = `id-${element}`;
        this.idElements.push(stringa);
      }
    });

    let k = 0;

    Object.entries(this.formParent.value['child']).forEach(([key,value])=>{
      if(value['id']==numero){
        k = Number(key);
      }
    })

    if (this.parts[id[1]]){
      control.push(this.initChild(evento.target.id));
    }else {
      control.removeAt(k);

    }


  }

}
