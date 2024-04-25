import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { Router, RouterModule } from '@angular/router';
import { ExchangeService } from '../../services/exchange/exchange.service';
import { AuthServiceService } from '../../services/auth/auth-service.service';
import { SnackbarService } from '../../services/snackbar/snackbar.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-exchanges',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatTabsModule, MatTableModule, RouterModule],
  templateUrl: './exchanges.component.html',
  styleUrl: './exchanges.component.scss'
})
export class ExchangesComponent implements OnInit {

  initiateExchanges:any = [];
  recipientExchanges:any = [];
  displayedColumns: string[] = ['id', 'initiator', 'recipient', 'book', 'confirmed', 'action'];
  errorMessage = '';
  reponseMessage:any;

  constructor (
    private router:Router, 
    private exchangeService:ExchangeService, 
    private authService:AuthServiceService, 
    private snackbarService:SnackbarService,
    private dialog:MatDialog
  ) {}

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.getInitiateExchangesData();
      this.getRecipientExchangesData();
    } else {
      this.router.navigate(['/auth']);
    }
  }

  getInitiateExchangesData() {
    this.exchangeService.getAllInitiateExchanges().subscribe({
      next: data => {
        this.initiateExchanges = data.data;
      },
      error: (error: any) => {
       if (error.error?.error.message) {
          this.errorMessage = error.error?.error.message;
        } else {
          this.errorMessage = "Unexpected error occurred";
        }
        this.snackbarService.openSnackBar(this.errorMessage, "error");
      }
    });
  }

  getRecipientExchangesData() {
    this.exchangeService.getAllRecipientExchanges().subscribe({
      next: data => {
        this.recipientExchanges = data.data;
      },
      error: (error: any) => {
       if (error.error?.error.message) {
          this.errorMessage = error.error?.error.message;
        } else {
          this.errorMessage = "Unexpected error occurred";
        }
        this.snackbarService.openSnackBar(this.errorMessage, "error");
      }
    });
  }

  handleConfirmExchange(exchangeId:number) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'confirm',
      objectOfAction: 'exchange with id \'' + exchangeId + '\'',
      confirmation: true
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((response) => {
      this.confirmExchange(exchangeId);
    });
  }

  confirmExchange(exchangeId:number) {
    this.exchangeService.confirmExchange(exchangeId).subscribe({
      next: (response: any) => {
        this.reponseMessage = response?.message;
        this.getRecipientExchangesData();
        this.snackbarService.openSnackBar(this.reponseMessage, "");
      },
      error: (error: any) => {
       if (error.error?.error.message) {
          this.errorMessage = error.error?.error.message;
        } else {
          this.errorMessage = "Unexpected error occurred";
        }
        this.snackbarService.openSnackBar(this.errorMessage, "error");
      }
    })
  }

  handleDeleteExchange(exchangeId:number) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'delete',
      objectOfAction: 'exchange with id \'' + exchangeId + '\'',
      confirmation: true
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((response) => {
      this.deleteExchange(exchangeId);
    });
  }

  deleteExchange(exchangeId:number) {
    this.exchangeService.deleteExchange(exchangeId).subscribe({
      next: (response: any) => {
        this.reponseMessage = response?.message;
        this.getInitiateExchangesData();
        this.getRecipientExchangesData();
        this.snackbarService.openSnackBar(this.reponseMessage, "");
      },
      error: (error: any) => {
       if (error.error?.error.message) {
          this.errorMessage = error.error?.error.message;
        } else {
          this.errorMessage = "Unexpected error occurred";
        }
        this.snackbarService.openSnackBar(this.errorMessage, "error");
      }
    })
  }
}
