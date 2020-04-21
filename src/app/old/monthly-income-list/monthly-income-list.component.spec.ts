import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyIncomeListComponent } from './monthly-income-list.component';

describe('TableListComponent', () => {
  let component: MonthlyIncomeListComponent;
  let fixture: ComponentFixture<MonthlyIncomeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonthlyIncomeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthlyIncomeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
