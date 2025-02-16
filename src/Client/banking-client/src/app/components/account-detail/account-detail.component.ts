import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { NgApexchartsModule } from "ng-apexcharts";
import { ApexChart, ApexStroke, ApexTitleSubtitle } from "ng-apexcharts";
import { AuthModel } from "../../shared/models/auth.model";
import { AccountsService } from "../../shared/services/accounts/accounts.service";
import { AccountModel } from "../../shared/models/account.model";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-account-detail',
  templateUrl: './account-detail.component.html',
  styleUrl: './account-detail.component.scss',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule, ReactiveFormsModule]
})
export class AccountDetailComponent  implements OnInit{
  @ViewChild("fileInput") fileInput!: ElementRef;
  accountForm: FormGroup;

  profileForm: FormGroup;
  twoFactorControl = new FormControl(false);
  profileImage: string | null = null;
  maskedPhone = "***-***-4567";
  maskedEmail = "j***@example.com";

  accountDetails: AccountModel | null = null;

  loginHistory = [
    { location: "New York, USA", timestamp: new Date(2024, 0, 15, 14, 30) },
    { location: "New York, USA", timestamp: new Date(2024, 0, 14, 9, 15) },
    { location: "Boston, USA", timestamp: new Date(2024, 0, 13, 18, 45) },
    { location: "Chicago, USA", timestamp: new Date(2024, 0, 12, 11, 20) },
    { location: "Miami, USA", timestamp: new Date(2024, 0, 11, 16, 10) }
  ];
 
  constructor(private fb: FormBuilder, private accountsService: AccountsService,private route: ActivatedRoute) {
    this.accountForm = this.fb.group({
      accountNumber: [{ value: '', disabled: true }, Validators.required],
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {
    const accountId = this.route.snapshot.paramMap.get('accountId');  
    if (accountId) {
      this.getAccountDetails(accountId);
    }
  }

  getAccountDetails(accountId: string): void {
    this.accountsService.getAccountById(Number(accountId)).subscribe({
      next: (account: AccountModel) => {
        this.accountForm.patchValue(account); // Cập nhật thông tin tài khoản vào form
        this.accountDetails = account; 
      },
      error: (err) => {
        console.error('Error fetching account details:', err);
      }
    });
  }

  onSubmit(): void {
    if (this.accountForm.valid) {
      // Xử lý khi form hợp lệ
      console.log('Form Submitted:', this.accountForm.value);
    }
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
