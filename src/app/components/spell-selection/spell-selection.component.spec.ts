import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpellSelectionComponent } from './spell-selection.component';

describe('SpellSelectionComponent', () => {
  let component: SpellSelectionComponent;
  let fixture: ComponentFixture<SpellSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpellSelectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SpellSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
