import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DucatoMaxiComponent } from './ducato-maxi.component';

describe('DucatoMaxiComponent', () => {
  let component: DucatoMaxiComponent;
  let fixture: ComponentFixture<DucatoMaxiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DucatoMaxiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DucatoMaxiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
