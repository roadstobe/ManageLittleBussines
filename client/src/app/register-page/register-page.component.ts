import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {AuthService} from "../shared/services/auth.service";
import {Subscription} from "rxjs";
import {MaterialService} from "../shared/classes/material.service";

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent implements OnInit, OnDestroy {

  form: FormGroup;
  aSub: Subscription;

  constructor(
    private router: Router,
    private auth: AuthService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.email, Validators.required]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)])
    })


  }

  onSubmit() {
    if(this.form.invalid){
      return;
    }

    this.form.disable();
    this.aSub = this.auth.register(this.form.value).subscribe(()=>{
      this.router.navigate(['/login'], {
        queryParams:{
          registered: true
        }
      })
    }, err=>{
      this.form.enable();
      MaterialService.toast(err.error.message)
    })
  }


  ngOnDestroy() {
    if(this.aSub){
      this.aSub.unsubscribe();
    }
  }
}
