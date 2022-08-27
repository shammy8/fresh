import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
} from '@angular/core';

import { coerceNumberProperty, NumberInput } from '@angular/cdk/coercion';

/**
 * Directive to be applied to <input type="text"> elements to turn the autocomplete attribute 'on' when the value length is
 * greater than a certain number and 'off' otherwise.
 * 
 * When directive is used without binding to anything, it will default to greater than 0. Meaning autocomplete will be turn
 * on when there is at least one character in the <input type="text">
 *
 * Normal html criteria for autocomplete applies. Ie needs a name and/or id attribute, be descendant of a <form> element and
 * the form must have a submit button. https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete
 * Not sure if above is correct actually.
 */
@Directive({
  standalone: true,
  selector: 'input[type=text][freshAutocompleteOnWhenLengthGreaterThan]',
})
export class AutocompleteOnOffDirective implements AfterViewInit {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('freshAutocompleteOnWhenLengthGreaterThan')
  get limit() {
    return this._limit;
  }
  set limit(value: NumberInput) {
    this._limit = coerceNumberProperty(value, 0);
  }
  private _limit = 0;

  @HostBinding('attr.autocomplete') autocomplete: 'on' | 'off' = 'off';

  @HostListener('input', ['$event'])
  inputChange(event: InputEvent) {
    const value = (event.target as HTMLInputElement).value;
    this._setAutocomplete(value);
  }

  constructor(private readonly _elementRef: ElementRef) {}

  ngAfterViewInit() {
    const initialValue = (this._elementRef.nativeElement as HTMLInputElement)
      .value;
    this._setAutocomplete(initialValue);
  }

  private _setAutocomplete(value: string) {
    this.autocomplete = value.length > this._limit ? 'on' : 'off';
  }
}
