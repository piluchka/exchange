import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ExchangeRate } from '../models/exchange-rate.model';

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
  constructor(private http: HttpClient) {}

  getCurrentExchangeForUAH(currency: string): Observable<ExchangeRate> {
    currency = currency.toUpperCase();
    return this.http.get<ExchangeRate>(
      `${environment.BASE_URL}${environment.API_KEY}/latest/${currency}`
    );
  }
}
