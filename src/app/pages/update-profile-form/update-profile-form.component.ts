import { Component, OnInit, EventEmitter, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SnackbarService } from '../../services/snackbar/snackbar.service';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../services/user/user.service';
import { MessageResponse } from '../../models/reponses/MessageResponse';
import { ErrorResponse } from '../../models/reponses/ErrorResponse';
import { Country } from '../../models/location/country';
import { City } from '../../models/location/city';
import { SuccessResponse } from '../../models/reponses/SuccessResponse';

@Component({
  selector: 'app-update-profile-form',
  standalone: true,
  imports: [CommonModule, MatInputModule, MatFormFieldModule, MatIconModule, MatSelectModule, MatButtonModule, FormsModule, ReactiveFormsModule, MatDialogModule],
  templateUrl: './update-profile-form.component.html',
  styleUrl: './update-profile-form.component.scss'
})
export class UpdateProfileFormComponent implements OnInit {
  reponseMessage:string = '';
  fileName = '';
  file!: File;

  countries:Country[] = [];
  cities:City[] = [];

  onUpdateProfile = new EventEmitter();

  updateLocationForm:any = FormGroup;
  updatePhotoForm:any = FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any, 
    public userService: UserService, 
    private formBuilder: FormBuilder,
    public snackbarService: SnackbarService,
    public dialogRef: MatDialogRef<UpdateProfileFormComponent>
  ) {}

  ngOnInit(): void {
    this.updatePhotoForm = this.formBuilder.group({
      photo: new FormControl("", [Validators.required])
    });
    this.updateLocationForm = this.formBuilder.group({
      country: new FormControl("",[Validators.required]),
      city: new FormControl("",[Validators.required])
    });
    this.updateLocationForm.patchValue(this.dialogData.data);
    this.getCountriesData();
  }

  getCountriesData() {
    this.userService.getAllCountries().subscribe({
      next: (response: SuccessResponse<Country[]>) => {
        this.countries = response.data;
      },
      error: (error: ErrorResponse) => {
        this.dialogRef.close;
        if (error.error.error.message) {
          this.reponseMessage = error.error.error.message;
        } else {
          this.reponseMessage = "Unexpected error occurred";
        }
        this.snackbarService.openSnackBar(this.reponseMessage, "error");
      }
    });
  }

  getCitiesData() {
    this.userService.getCitiesByCountry(this.updateLocationForm.value.country.iso2).subscribe({
      next: (response: SuccessResponse<City[]>) => {
        this.cities = response.data;
      },
      error: (error: ErrorResponse) => {
        this.dialogRef.close;
        if (error.error.error.message) {
          this.reponseMessage = error.error.error.message;
        } else {
          this.reponseMessage = "Unexpected error occurred";
        }
        this.snackbarService.openSnackBar(this.reponseMessage, "error");
      }
    });
  }

  handleLocationUpdating() {
    if (this.updateLocationForm.valid && this.updateLocationForm.dirty) {
      const location = JSON.stringify({
        country: this.updateLocationForm.value.country.name,
        city: this.updateLocationForm.value.city
      })
      this.userService.updateLocation(location).subscribe({
        next: (response: MessageResponse) => {
          this.dialogRef.close;
          this.onUpdateProfile.emit();
          this.reponseMessage = response.message;
          this.snackbarService.openSnackBar(this.reponseMessage, "");
        },
        error: (error: ErrorResponse) => {
          this.dialogRef.close;
          if (error.error.error.message) {
            this.reponseMessage = error.error.error.message;
          } else {
            this.reponseMessage = "Unexpected error occurred";
          }
          this.snackbarService.openSnackBar(this.reponseMessage, "error");
        }
      });
    }
  }

  handlePhotoUpdating() {
    const formData: FormData = new FormData();
    formData.append('photo', this.file);
    this.userService.updatePhoto(formData).subscribe({
      next: (response: MessageResponse) => {
        this.dialogRef.close;
        this.onUpdateProfile.emit();
        this.reponseMessage = response.message;
        this.snackbarService.openSnackBar(this.reponseMessage, "");
      },
      error: (error: ErrorResponse) => {
        this.dialogRef.close;
        if (error.error.error.message) {
          this.reponseMessage = error.error.error.message;
        } else {
          this.reponseMessage = "Unexpected error occurred";
        }
        this.snackbarService.openSnackBar(this.reponseMessage, "error");
      }
    });
  }

  handleFileSelected(event: any):void {
    const files = event.target.files;
    if (files && files.length > 0) {
      this.fileName = files[0].name;
      this.file = event.target.files[0];
    } else {
      this.fileName = '';
    }
  }

  fileNameIsEmpty():boolean {
    return this.fileName === '';
  }
}
