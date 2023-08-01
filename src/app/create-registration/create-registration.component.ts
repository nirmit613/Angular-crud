import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from '../sevices/api.service';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-create-registration',
  templateUrl: './create-registration.component.html',
  styleUrls: ['./create-registration.component.scss'],
})
export class CreateRegistrationComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private toastService: NgToastService
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
      requirTrainer: [''],
      package: [''],
      important: [''],
      haveGymBefore: [''],
      enquiryDate: [''],
    });

    this.registrationForm.controls['height'].valueChanges.subscribe((res) => {
      this.calculateBmi(res);
    });
  }

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
        duration: 5000,
      });
      this.registrationForm.reset();
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
}
