import { Component, OnInit, inject } from '@angular/core';
import { ApiBaseService } from 'src/app/services/base-api/api-base.service';
import urlConfig from 'src/app/config/url.config.json'
import { NavController } from '@ionic/angular';
import { ToastService } from 'src/app/services/toast/toast.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-selected-categories-list',
  templateUrl: './selected-categories-list.component.html',
  styleUrls: ['./selected-categories-list.component.scss'],
})
export class SelectedCategoriesListComponent  implements OnInit {
  apiService:any
  projectsList:any = { data: [], count: 0 }
  selectedCategory:any = ''
  page:any = 1
  limit:any = 10
  search:any = ''
  stateData:any = ''

  constructor(private navCtrl: NavController, private toastService: ToastService, private activatedRoute: ActivatedRoute, private router: Router) {
    this.apiService = inject(ApiBaseService)
    activatedRoute.params.subscribe((param:any)=>{
      this.selectedCategory = param['category']
    })
    this.stateData = this.router.getCurrentNavigation()?.extras.state
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.page = 1;
    this.projectsList = { data: [], count: 0 }
    this.getCategoriesProjectList()
  }

  getCategoriesProjectList(){
    let url = `${urlConfig.project.projectCategories}${this.selectedCategory}?page=${this.page}&limit=${this.limit}&search=${this.search}`
    this.apiService.get(url).subscribe((res:any)=>{
      let response = res.result
      this.projectsList.data = this.projectsList.data.concat(response.data);
      this.projectsList.count = response.count
    },(error:any)=>{
      this.toastService.presentToast(error.error.message,"danger")
    })
  }

  handleInput(event: any) {
    this.search = event.target.value;
    this.page = 1;
    this.projectsList = { data: [], count: 0 };
    this.getCategoriesProjectList();
  }


  loadMore() {
    this.page = this.page + 1;
    this.getCategoriesProjectList();
  }

  navigateToTemplatePage(data:any){
    this.router.navigate(['project-details'], { state: { ...data, referenceFrom: "library" }});
  }

  goBack() {
    this.navCtrl.back();
  }

}