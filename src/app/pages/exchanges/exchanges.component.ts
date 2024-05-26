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
import { ErrorResponse } from '../../models/reponses/ErrorResponse';
import { MessageResponse } from '../../models/reponses/MessageResponse';
import { Exchange } from '../../models/exchange';
import { SuccessResponse } from '../../models/reponses/SuccessResponse';

@Component({
  selector: 'app-exchanges',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatTabsModule, MatTableModule, RouterModule],
  templateUrl: './exchanges.component.html',
  styleUrl: './exchanges.component.scss'
})
export class ExchangesComponent implements OnInit {

  initiateExchanges:Exchange[] = [];
  recipientExchanges:Exchange[] = [];
  displayedColumns:string[] = ['id', 'initiator', 'recipient', 'book', 'confirmed', 'action'];
  responseMessage:string = '';

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
      next: (response: SuccessResponse<Exchange[]>) => {
        this.initiateExchanges = response.data;
      },
      error: (error: ErrorResponse) => {
       if (error.error.error.message) {
          this.responseMessage = error.error.error.message;
        } else {
          this.responseMessage = "Unexpected error occurred";
        }
        this.snackbarService.openSnackBar(this.responseMessage, "error");
      }
    });
  }

  getRecipientExchangesData() {
    this.exchangeService.getAllRecipientExchanges().subscribe({
      next: (response: SuccessResponse<Exchange[]>) => {
        this.recipientExchanges = response.data;
      },
      error: (error: ErrorResponse) => {
       if (error.error.error.message) {
          this.responseMessage = error.error.error.message;
        } else {
          this.responseMessage = "Unexpected error occurred";
        }
        this.snackbarService.openSnackBar(this.responseMessage, "error");
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
      next: (response: MessageResponse) => {
        this.responseMessage = response.message;
        this.getRecipientExchangesData();
        this.snackbarService.openSnackBar(this.responseMessage, "");
      },
      error: (error: ErrorResponse) => {
       if (error.error.error.message) {
          this.responseMessage = error.error.error.message;
        } else {
          this.responseMessage = "Unexpected error occurred";
        }
        this.snackbarService.openSnackBar(this.responseMessage, "error");
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
      next: (response: MessageResponse) => {
        this.responseMessage = response.message;
        this.getInitiateExchangesData();
        this.getRecipientExchangesData();
        this.snackbarService.openSnackBar(this.responseMessage, "");
      },
      error: (error: ErrorResponse) => {
       if (error.error.error.message) {
          this.responseMessage = error.error.error.message;
        } else {
          this.responseMessage = "Unexpected error occurred";
        }
        this.snackbarService.openSnackBar(this.responseMessage, "error");
      }
    })
  }
}
