import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettledTransactionsComponent } from './settled-transactions.component';

describe('SettledTransactionsComponent', () => {
  let component: SettledTransactionsComponent;
  let fixture: ComponentFixture<SettledTransactionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettledTransactionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettledTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
