import { Component, OnInit } from '@angular/core';
import { User } from '../models/user.model';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../sevices/api.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
})
export class UserDetailComponent implements OnInit {
  public userId!: number;
  public userDetail!: User;
  constructor(
    private activatedRoute: ActivatedRoute,
    private api: ApiService
  ) {}
  ngOnInit(): void {
    this.activatedRoute.params.subscribe((res) => {
      this.userId = res['id'];
      this.fetchUserDetails(this.userId);
    });
  }
  public fetchUserDetails(userId: number) {
    this.api.getRegisteredUserId(userId).subscribe((res) => {
      this.userDetail = res;
      console.log(res);
    });
  }
}
