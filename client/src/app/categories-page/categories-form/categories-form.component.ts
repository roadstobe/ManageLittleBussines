import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {fakeAsync} from "@angular/core/testing";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {CategoriesService} from "../../shared/services/categories.service";
import {switchMap} from "rxjs/operators";
import {Observable, of} from "rxjs";
import {MaterialService} from "../../shared/classes/material.service";
import {Category, Message} from "../../shared/interfaces";

@Component({
  selector: 'app-categories-form',
  templateUrl: './categories-form.component.html',
  styleUrls: ['./categories-form.component.scss']
})
export class CategoriesFormComponent implements OnInit {

  @ViewChild('input') inputRef: ElementRef;

  isNew = true;
  form: FormGroup;
  image: File;
  imagePreview: any = '';
  category;

  constructor(
    private route: ActivatedRoute,
    private categoriesService: CategoriesService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null, [Validators.required])
    })

    this.form.disable();
    this.route.params
      .pipe(
        switchMap(
          (params: Params)=>{
            if(params['id']){
              this.isNew = false;
              return this.categoriesService.getById(params['id'])
            }else{
              return of(null)
            }
          }
        )
      )
      .subscribe((category : Category) =>{
        if(category){
          this.category = category
          this.form.patchValue({
            name: category.name
          })
          MaterialService.updateTextInputs();
          this.imagePreview = category.imageSrc;
        }
        this.form.enable();
      }, err=>{
        MaterialService.toast(err.error.message)
      })
  }

  submit() {
    if(this.form.invalid){
      return
    }

    console.log(this.category);
    let obs$:Observable<Category>;
    this.form.disable();
    if(this.isNew){
      obs$ = this.categoriesService.create(this.form.value.name, this.image)
    }else{
      obs$ = this.categoriesService.update(this.category._id, this.form.value.name, this.image)
    }

    obs$.subscribe(
      (category: Category)=>{
        this.form.enable();
        MaterialService.toast('Change saved');
        this.category = category;
    }, err=>{
      MaterialService.toast(err.error.message);
      this.form.enable()
    })
  }

  triggerClick() {
    this.inputRef.nativeElement.click();
  }

  onFileUpload(event: any) {
    const file = event.target.files[0];
    this.image = file;

    const reader = new FileReader();

    reader.onload = () =>{
       this.imagePreview = reader.result;
    }

    reader.readAsDataURL(file);
  }

  deleteCategory() {
    const decision = window.confirm(`Delete ${this.category.name}`);

    if(decision){
      this.categoriesService.delete(this.category._id)
        .subscribe(
          (response: Message) => {
            MaterialService.toast(response.message)
          },
          err => {
            MaterialService.toast(err.error.message)
          },
          ()=>{
            this.router.navigate(['/categories'])
          }
        )
    }
  }
}
