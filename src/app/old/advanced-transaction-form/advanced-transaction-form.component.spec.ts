import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedTransactionFormComponent } from './advanced-transaction-form.component';

describe('AdvancedTransactionFormComponent', () => {
  let component: AdvancedTransactionFormComponent;
  let fixture: ComponentFixture<AdvancedTransactionFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvancedTransactionFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancedTransactionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
