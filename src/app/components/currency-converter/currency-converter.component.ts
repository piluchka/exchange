import { Component, OnDestroy, OnInit } from '@angular/core';
import { CurrencyService } from '../../services/currency.service';
import { CommonModule } from '@angular/common';
import { Subscription, take } from 'rxjs';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-currency-converter',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './currency-converter.component.html',
  styleUrl: './currency-converter.component.scss',
})
export class CurrencyConverterComponent implements OnInit, OnDestroy {
  currencies: string[] = [];
  converterForm: FormGroup = new FormGroup({});

  subscriptions: Subscription = new Subscription();

  private isUpdatingValue: boolean = false;
  private isUpdatingCurrency: boolean = false;

  constructor(
    private currencyService: CurrencyService,
    private fb: FormBuilder
  ) {
    this.converterForm = this.fb.group({
      firstAmount: 0,
      secondAmount: 0,
      firstCurrency: 'USD',
      secondCurrency: 'UAH',
    });
  }

  ngOnInit(): void {
    this.setCurrencies();
    this.subscribeToUpdates();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  setCurrencies() {
    this.currencyService
      .getAvailableCurrenciesNames()
      .pipe(take(1))
      .subscribe((data) => {
        this.currencies = data;
        console.log(this.currencies);
      });
  }

  subscribeToUpdates() {
    const firstSub = this.converterForm
      .get('firstAmount')
      ?.valueChanges.subscribe((value) => {
        if (!this.isUpdatingValue) {
          this.isUpdatingValue = true;
          this.updateValue(
            value,
            this.converterForm.get('firstCurrency')?.value,
            this.converterForm.get('secondCurrency')?.value,
            'secondAmount'
          );
        } else {
          this.isUpdatingValue = false;
        }
      });
    this.subscriptions.add(firstSub);

    const secondSub = this.converterForm
      .get('secondAmount')
      ?.valueChanges.subscribe((value) => {
        if (!this.isUpdatingValue) {
          this.isUpdatingValue = true;
          this.updateValue(
            value,
            this.converterForm.get('secondCurrency')?.value,
            this.converterForm.get('firstCurrency')?.value,
            'firstAmount'
          );
        } else {
          this.isUpdatingValue = false;
        }
      });
    this.subscriptions.add(secondSub);

    const firstCurrencySub = this.converterForm
      .get('firstCurrency')
      ?.valueChanges.subscribe((value) => {
        const firstAmount = this.converterForm.get('firstAmount')?.value;
        const secondCurrency = this.converterForm.get('secondCurrency')?.value;
        this.updateValue(
          firstAmount,
          value,
          secondCurrency,
          'secondAmount',
          true
        );
      });
    this.subscriptions.add(firstCurrencySub);

    const secondCurrencySub = this.converterForm
      .get('secondCurrency')
      ?.valueChanges.subscribe((value) => {
        const secondAmount = this.converterForm.get('secondAmount')?.value;
        const firstCurrency = this.converterForm.get('firstCurrency')?.value;
        this.updateValue(
          secondAmount,
          value,
          firstCurrency,
          'firstAmount',
          true
        );
      });
    this.subscriptions.add(secondCurrencySub);
  }

  updateValue(
    amount: number,
    firstCurrency: string,
    secondCurrency: string,
    formKey: 'secondAmount' | 'firstAmount',
    isGoingToPreventEvent: boolean = false
  ) {
    this.currencyService
      .getPairConversionValue(firstCurrency, secondCurrency)
      .pipe(take(1))
      .subscribe((rate) => {
        const result = amount * rate;
        this.converterForm.patchValue(
          { [formKey]: result.toFixed(2) },
          { emitEvent: !isGoingToPreventEvent }
        );
      });
  }
}
