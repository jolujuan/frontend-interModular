import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeGameComponent } from './home-game.component';

describe('HomeGameComponent', () => {
  let component: HomeGameComponent;
  let fixture: ComponentFixture<HomeGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeGameComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HomeGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
