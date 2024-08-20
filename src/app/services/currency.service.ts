import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ExchangeRate } from '../models/exchange-rate.model';
import { Conversion } from '../models/conversion.model';

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

  getAvailableCurrenciesNames(
    baseCurrency: string = 'uah'
  ): Observable<string[]> {
    return this.getCurrentExchangeForUAH(baseCurrency).pipe(
      map((data) => {
        return Object.keys(data.conversion_rates);
      })
    );
  }

  getPairConversionValue(
    firstCurrency: string,
    secondCurrency: string
  ): Observable<number> {
    firstCurrency = firstCurrency.toUpperCase();
    secondCurrency = secondCurrency.toUpperCase();

    return this.http
      .get<Conversion>(
        `${environment.BASE_URL}${environment.API_KEY}/pair/${firstCurrency}/${secondCurrency}`
      )
      .pipe(map((data) => data.conversion_rate));
  }
}
