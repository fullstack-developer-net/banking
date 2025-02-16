import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { NgApexchartsModule } from "ng-apexcharts";
import { ApexChart, ApexStroke, ApexTitleSubtitle } from "ng-apexcharts";
import { AuthModel } from "../../shared/models/auth.model";
import { AccountsService } from "../../shared/services/accounts/accounts.service";
import { AccountModel } from "../../shared/models/account.model";
import { userUpdate } from "src/app/shared/models/user-update.model";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";

@Component({
  selector: "app-user-detail",
  templateUrl: "./user-detail.component.html",
  styleUrls: ["./user-detail.component.scss"],
  standalone: true,
  imports: [CommonModule, NgApexchartsModule, ReactiveFormsModule]
})
export class UserDetailComponent implements OnInit {
  @ViewChild("fileInput") fileInput!: ElementRef;

  profileForm: FormGroup;
  twoFactorControl = new FormControl(false);
  profileImage: string | null = null;
  maskedPhone = "***-***-4567";
  maskedEmail = "j***@example.com";

  accountDetails: AccountModel | null = null;


  constructor(private fb: FormBuilder, private accountsService: AccountsService, private snackBar: MatSnackBar, private router: Router) {
    this.profileForm = this.fb.group({
      fullName: ["", [Validators.required, Validators.minLength(2)]],
      dob: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    const authData = localStorage.getItem('auth');
    if (authData) {
      const authModel: AuthModel = JSON.parse(authData);
      this.profileForm.patchValue({
        fullName: authModel.fullName,
      });
      
      const userId = authModel.userId;
      this.getAccountDetails(userId);
    }
  }

  onSubmit(): void {
    const authData = localStorage.getItem('auth');
    const authModel: AuthModel = JSON.parse(authData);
    const updatedUser: userUpdate = {
      UserId: authModel.userId,
      fullName: this.profileForm.value.fullName,
      Email: this.profileForm.value.email,
    };
    console.log("email",this.profileForm.value.email);
    this.accountsService.updateUser(updatedUser).subscribe({
      next: () => {
        console.log('User updated successfully!');
      },
      error: (err) => {
        console.error('Error updating user:', err);
      }
    });

}
  getAccountDetails(userId: string): void {
    this.accountsService.getAccountByUserId(userId).subscribe({
      next: (account: AccountModel) => {
        this.accountDetails = account;
        console.log("acc",this.accountDetails);
      },
      error: (err) => {
        console.error('Error fetching account details:', err);
      }
    });
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.profileImage = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  editProfile(): void {
    console.log("Edit profile clicked");
  }

  openNotificationPreferences(): void {
    console.log("Notification preferences clicked");
  }

  contactSupport(): void {
    console.log("Contact support clicked");
  }

  downloadDetails(): void {
    console.log("Download details clicked");
  }
}
