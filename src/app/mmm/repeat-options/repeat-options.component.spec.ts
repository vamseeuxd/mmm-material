import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepeatOptionsComponent } from './repeat-options.component';

describe('RepeatOptionsComponent', () => {
  let component: RepeatOptionsComponent;
  let fixture: ComponentFixture<RepeatOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepeatOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepeatOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
