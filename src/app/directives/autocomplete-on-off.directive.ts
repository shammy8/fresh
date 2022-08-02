import { AfterViewInit, Directive, ElementRef, OnDestroy } from '@angular/core';
import { NgControl } from '@angular/forms';

import { startWith, Subject, takeUntil } from 'rxjs';

@Directive({
  standalone: true,
  selector: 'input[freshAutocompleteOnOff]',
})
export class AutoCompleteOnOffDirective implements AfterViewInit, OnDestroy {
  private readonly _destroy = new Subject<void>();

  constructor(
    private readonly _formControl: NgControl,
    private readonly _elementRef: ElementRef
  ) {}

  ngAfterViewInit() {
    console.log(this._formControl.value);

    this._formControl.valueChanges
      ?.pipe(startWith(this._formControl.value), takeUntil(this._destroy))
      .subscribe((value) => {
        if (value.length > 0) {
          this._elementRef.nativeElement.autocomplete = 'on';
        } else {
          this._elementRef.nativeElement.autocomplete = 'off';
        }
      });
  }

  ngOnDestroy(): void {
    this._destroy.next();
    this._destroy.complete();
  }
}
