import { Observable } from 'rxjs/Observable';
import {Injectable} from '@angular/core';
import { HttpService } from './../../../../core/http/http.service';
import { RequestOptions, Headers } from '@angular/http';
import { AuthenticationService } from '../../../../core/authentication';

@Injectable()
export class LocalPurchaseSupplierInvoiceReportService {

  authenticationService: AuthenticationService;

  constructor(private http: HttpService, private authService: AuthenticationService) {
   this.authenticationService = authService;
  }

  getConsolidatedLocalPurchaseInvoiceReport(supplierId: number,month : number,year: number): Observable <any> {
    return this.http.get('/getConsolidatedLocalPurchaseInvoiceReport/' + supplierId + '/' + month + '/' + year).map(req => req.json())
  }
  
  getAllSupplierByType(type : string): Observable <any>{
    return this.http.get('/getAllPartiesByType/' + type).map(req => req.json())
  }
}

