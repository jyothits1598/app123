import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, FormArray, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { RestApiService } from 'src/app/services/rest-api.service';
import { StoreService } from 'src/app/services/store.service';
import { ThirdFormsComponent } from 'src/app/views/add-store-forms/third-forms/third-forms.component';
import { AlertService } from 'src/app/services/alert.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-store-menu-categories-create',
  templateUrl: './store-menu-categories-create.component.html',
  styleUrls: ['./store-menu-categories-create.component.scss']
})
export class StoreMenuCategoriesCreateComponent implements OnInit, OnDestroy {
  categoryId: number = null;

  routerSubs: Subscription;

  isLoading: boolean = false;
  saveBtnLoading: boolean = false;

  menuIdMap: Array<{ name: string, id: number }> = [];

  createCatForm: FormGroup = new FormGroup({
    categoryName: new FormControl('', Validators.required),
    menus: new FormArray([], [this.minChecksValidator()])
  })

  constructor(
    private modalService: NgbModal,
    private restApiService: RestApiService,
    private storeService: StoreService,
    private alertService: AlertService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.routerSubs = this.route.params.subscribe(params => {
      //creating a new category
      if (params['id'] === undefined) {
        this.fetchInitialData();
        return;
      };

      //update existing category
      this.categoryId = +params['id'];
      // if category is not a number
      if (!this.categoryId) {
        this.router.navigate(['./not-found'], { relativeTo: this.route });
      }
      this.fetchInitialData();
    })
  }


  navigateBack() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  minChecksValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      let sum = 0;
      (<FormArray>control).controls.forEach(ctrl => {
        if (ctrl.value) sum += 1;
      });
      return sum ? null : { 'MinimumSelection': "Please select atleast one menu" };
    };
  }

  ngOnInit(): void {
  }

  menusForm() {
    return (<FormArray>this.createCatForm.controls.menus).controls;
  }

  fetchInitialData() {
    this.isLoading = true;
    this.restApiService.getData('store/category/menu/' + this.storeService.activeStore
      , (resp) => {
        if (resp.success && resp.data) {
          this.isLoading = false;
          resp.data.forEach(menu => {
            this.menuIdMap.push({ id: menu.menu_id, name: menu.menu_name });
            (<FormArray>this.createCatForm.controls.menus).push(new FormControl(false));
          });

          //if we have a valid categoryId fetch category data
          if (this.categoryId) {
            this.isLoading = true;
            this.restApiService.getData(`store/category/get/${this.storeService.activeStore}/${this.categoryId}`
              , (resp) => {
                this.isLoading = false;
                if (resp.success && resp.data.length > 0) {
                  let menuCat = this.storeService.ReadStoreMenuCategory(resp.data[0]);
                  this.createCatForm.controls.categoryName.setValue(menuCat.name);
                  menuCat.menus.forEach(activeMenu => {
                    let index: number = this.menuIdMap.findIndex(menu => activeMenu.id == menu.id);
                    if (index != -1) (<FormArray>this.createCatForm.controls.menus).controls[index].setValue(true);
                  });
                }
              }
              , err => this.isLoading = false)
          }
        }
      },
      error=> this.isLoading = false)
  }

  saveData() {
    //check if entered data is valid
    if (this.createCatForm.invalid) {
      this.createCatForm.markAllAsTouched();
      return;
    }

    //construct data before sending to backend backend
    var data: any = {};
    data.category_name = this.createCatForm.value.categoryName;
    if (this.categoryId) data.category_id = this.categoryId;
    let checkValues: Array<boolean> = this.createCatForm.controls.menus.value;
    let selectedMenus: Array<{ "menu_id": number }> = [];
    for (let i = 0; i < checkValues.length; i++) {
      //if any checkbox is true
      if (checkValues[i]) {
        //pull id from menu-to-id map
        selectedMenus.push({ "menu_id": this.menuIdMap[i].id })
      }
    }
    data.menu = selectedMenus;

    this.saveBtnLoading = true;
    this.restApiService.postAPI(`store/category/add/${this.storeService.activeStore}`
      , data
      , (resp) => {
        if (resp.success) {
          this.saveBtnLoading = false;
          this.alertService.showNotification(`Category was successfully ${this.categoryId ? "Updated" : "Created"}`);
          this.navigateBack();
        }
      }
      , (errResp) => {
        this.saveBtnLoading = false;
        this.alertService.showNotification("There was a problem, please try again.")
      }
    )
  }

  deleteData() {

    if (!this.categoryId) return;

    let data: any = {};
    data.category_id = this.categoryId;
    data.category_name = this.createCatForm.value.categoryName;
    data.active_flag = 0;

    if (this.categoryId) data.category_id = this.categoryId;
    this.restApiService.postAPI(`store/category/add/${this.storeService.activeStore}`
      , data
      , (resp) => {
        if (resp.success) {
          this.alertService.showNotification('Category successfully deleted.');
          this.navigateBack();
        }
      }
      , (err) => {
        this.alertService.showNotification('There was an error while deleting the category, please try again.');
      })
  }

  openVerticallyCentered(content) {
    this.modalService.open(content, { centered: true });
  }

  pagebackPopup(back) {
    this.modalService.open(back, { centered: true, size: 'sm' });
  }

  ngOnDestroy(): void {
    this.routerSubs.unsubscribe();
  }

  // debug() {
  //   // .setValue(true);
  // }

}
