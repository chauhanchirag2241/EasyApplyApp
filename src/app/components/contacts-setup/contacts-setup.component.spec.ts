import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactsSetupComponent } from './contacts-setup.component';

describe('ContactsSetupComponent', () => {
  let component: ContactsSetupComponent;
  let fixture: ComponentFixture<ContactsSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContactsSetupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactsSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
