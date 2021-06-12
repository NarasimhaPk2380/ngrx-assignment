import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { CardsLayoutComponent } from './cards-layout.component';
import { Store } from '@ngrx/store';
import { deleteFromCart } from '@buyonline/shared/data-access/state';

describe('CardsLayoutComponent', () => {
  let component: CardsLayoutComponent;
  let fixture: ComponentFixture<CardsLayoutComponent>;
  const storeMock = {
    dispatch: jasmine.createSpy('dispatch'),
  };
  const mockRouter = {
    navigate: jasmine.createSpy('navigate'),
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CardsLayoutComponent],
      imports: [RouterTestingModule],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: Store, useValue: storeMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardsLayoutComponent);
    component = fixture.componentInstance;
    TestBed.inject(Store);
    component.cardsList = [
      { id: '1', volumeInfo: { title: 'abc' } },
      { id: '2', volumeInfo: { title: 'xyz' } },
    ];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display n cards in the list when booksList length is n', () => {
    let titleList = fixture.debugElement.queryAll(By.css('.title'));
    titleList = titleList.map((item) => {
      return item?.nativeElement?.textContent;
    });
    expect(titleList).toEqual(['abc', 'xyz']);
  });

  it('should show delete button when showDelete is true', () => {
    component.showDelete = 'true';
    fixture.detectChanges();
    let deleteBtnsList = fixture.debugElement.queryAll(By.css('#deleteBtnId'));
    deleteBtnsList = deleteBtnsList.map((item) => {
      return item?.nativeElement?.textContent;
    });
    expect(deleteBtnsList.length).toBe(2);
  });
  it('should hide delete button when showDelete is false', () => {
    component.showDelete = 'false';
    fixture.detectChanges();
    let deleteBtnsList = fixture.debugElement.queryAll(By.css('#deleteBtnId'));
    deleteBtnsList = deleteBtnsList.map((item) => {
      return item?.nativeElement?.textContent;
    });
    expect(deleteBtnsList.length).toBe(0);
  });

  it('should delete cart items on clicking particularId', () => {
    component.showDelete = 'true';
    fixture.detectChanges();
    const deleteBtnsList = fixture.debugElement.queryAll(
      By.css('#deleteBtnId')
    );
    deleteBtnsList[0].nativeElement.click();
    const itemContainerlist = fixture.debugElement.queryAll(
      By.css('.item-container')
    );
    itemContainerlist[0].nativeElement.click();
    const bookId = itemContainerlist[0].nativeElement.getAttribute('id');
    expect(storeMock.dispatch).toHaveBeenCalledWith(deleteFromCart({ bookId }));
  });

  it('should invoke goToDetailsPage', () => {
    fixture.detectChanges();
    const itemContainerlist = fixture.debugElement.queryAll(
      By.css('.item-container')
    );
    itemContainerlist[0].nativeElement.click();
    const id = itemContainerlist[0].nativeElement.getAttribute('id');
    // console.log(id);
    expect(mockRouter.navigate).toHaveBeenCalledWith([`/cart-details/${id}`]);
  });
});
