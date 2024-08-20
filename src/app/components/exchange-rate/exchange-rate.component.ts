import { Component, OnInit } from '@angular/core';
import { CurrencyService } from '../../services/currency.service';
import { map, take } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-exchange-rate',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './exchange-rate.component.html',
  styleUrl: './exchange-rate.component.scss',
})
export class ExchangeRateComponent implements OnInit {
  exchangeForUAH: { [key: string]: number } = {};
  constructor(private currencyService: CurrencyService) {}

  ngOnInit(): void {
    this.setCurrentExchangeForUAH('usd');
    this.setCurrentExchangeForUAH('eur');
  }

  setCurrentExchangeForUAH(currency: string) {
    this.currencyService
      .getCurrentExchangeForUAH(currency)
      .pipe(
        take(1),
        map((info) => info.conversion_rates)
      )
      .subscribe((info) => {
        this.exchangeForUAH[currency.toUpperCase()] = info.UAH;
      });
  }

  getCurrencyNames(): string[] {
    return Object.keys(this.exchangeForUAH);
  }
}
