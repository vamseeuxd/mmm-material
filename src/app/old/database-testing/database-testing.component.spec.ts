import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatabaseTestingComponent } from './database-testing.component';

describe('TableListComponent', () => {
  let component: DatabaseTestingComponent;
  let fixture: ComponentFixture<DatabaseTestingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatabaseTestingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatabaseTestingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
