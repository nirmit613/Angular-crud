import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from '../sevices/api.service';
import { NgToastService } from 'ng-angular-popup';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../models/user.model';

@Component({
  selector: 'app-create-registration',
  templateUrl: './create-registration.component.html',
  styleUrls: ['./create-registration.component.scss'],
})
export class CreateRegistrationComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private toastService: NgToastService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      mobile: [''],
      weight: [''],
      height: [''],
      bmi: [''],
      bmiResult: [''],
      gender: [''],
      requireTrainer: [''],
      package: [''],
      important: [''],
      haveGymBefore: [''],
      enquiryDate: [''],
    });

    this.registrationForm.controls['height'].valueChanges.subscribe((res) => {
      this.calculateBmi(res);
    });

    this.activatedRoute.params.subscribe((res) => {
      this.userIdToUpdate = res['id'];
      this.api.getRegisteredUserId(this.userIdToUpdate).subscribe((res) => {
        this.isUpdate = true;
        this.fillFormToUpdate(res);
      });
    });
  }
  public isUpdate: boolean = false;
  public userIdToUpdate!: number;
  public packages: string[] = ['Monthly', 'Quarterly', 'Yearly'];
  public Genders: string[] = ['Male', 'Female'];
  public importantList: string[] = [
    'Toxic fat reduction',
    'Energy and Endurance',
    'Building Lean muscle',
    'Healthier Digestive System',
    'Sugar Craving Body',
    'Fitness',
  ];

  public registrationForm!: FormGroup;
  public submit() {
    this.api.postRegistration(this.registrationForm.value).subscribe((res) => {
      this.toastService.success({
        detail: 'Success',
        summary: 'Enquiry added',
        duration: 4000,
      });
      this.registrationForm.reset();
    });
  }
  public update() {
    this.api
      .updateRegisterUser(this.registrationForm.value, this.userIdToUpdate)
      .subscribe((res) => {
        this.toastService.success({
          detail: 'Success',
          summary: 'Enquiry Updated',
          duration: 4000,
        });
        this.registrationForm.reset();
        this.router.navigate(['list']);
      });
  }

  public calculateBmi(heightValue: number) {
    const weight = this.registrationForm.value.weight;
    const height = heightValue;
    const bmi = weight / (height * height);
    this.registrationForm.controls['bmi'].patchValue(bmi);
    switch (true) {
      case bmi < 18.5:
        this.registrationForm.controls['bmiResult'].patchValue('UnderWeight');
        break;
      case bmi > 18.5 && bmi < 25:
        this.registrationForm.controls['bmiResult'].patchValue('Normal');
        break;
      case bmi >= 25 && bmi < 30:
        this.registrationForm.controls['bmiResult'].patchValue('OverWeight');
        break;

      default:
        this.registrationForm.controls['bmiResult'].patchValue('Obese');
        break;
    }
  }
  public fillFormToUpdate(user: User) {
    this.registrationForm.patchValue({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      mobile: user.mobile,
      weight: user.weight,
      height: user.height,
      bmi: user.bmi,
      bmiResult: user.bmiResult,
      gender: user.gender,
      requireTrainer: user.requireTrainer,
      package: user.package,
      important: user.important,
      haveGymBefore: user.haveGymBefore,
      enquiryDate: user.enquiryDate,
    });
  }
}
