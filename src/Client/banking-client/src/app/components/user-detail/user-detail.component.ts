import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { NgApexchartsModule } from "ng-apexcharts";
import { ApexChart, ApexStroke, ApexTitleSubtitle } from "ng-apexcharts";
import { AuthModel } from "../../shared/models/auth.model";
import { AccountsService } from "../../shared/services/accounts/accounts.service";
import { AccountModel } from "../../shared/models/account.model";

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

  loginHistory = [
    { location: "New York, USA", timestamp: new Date(2024, 0, 15, 14, 30) },
    { location: "New York, USA", timestamp: new Date(2024, 0, 14, 9, 15) },
    { location: "Boston, USA", timestamp: new Date(2024, 0, 13, 18, 45) },
    { location: "Chicago, USA", timestamp: new Date(2024, 0, 12, 11, 20) },
    { location: "Miami, USA", timestamp: new Date(2024, 0, 11, 16, 10) }
  ];

  chartOptions = {
    series: [{
      name: "Balance",
      data: [30000, 40000, 35000, 50000, 49000, 60000, 70000, 91000]
    }],
    chart: {
      type: "line" as ApexChart["type"],
      height: 250,
      toolbar: {
        show: false
      }
    },
    stroke: {
      curve: "smooth" as ApexStroke["curve"],
      width: 3
    },
    colors: ["#2563eb"],
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"]
    },
    dataLabels: {
      enabled: false
    },
    title: {
      text: "Balance History",
      align: "left" as ApexTitleSubtitle["align"],
      style: {
        fontSize: "16px",
        fontWeight: 600
      }
    }
  };

  constructor(private fb: FormBuilder, private accountsService: AccountsService) {
    this.profileForm = this.fb.group({
      fullName: ["", [Validators.required, Validators.minLength(2)]],
      dob: ["", Validators.required],
      gender: ["", Validators.required]
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
      const email = authModel.email;
      console.log('User ID:', userId);
      console.log('Email:', email);

      this.getAccountDetails(userId);
    }
  }

  getAccountDetails(userId: string): void {
    this.accountsService.getAccountByUserId(userId).subscribe({
      next: (account: AccountModel) => {
        this.accountDetails = account;
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
