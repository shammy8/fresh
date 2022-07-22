import { Pipe, PipeTransform } from '@angular/core';

import * as humanizeDuration from 'humanize-duration';

@Pipe({
  name: 'humanizeDuration',
})
export class HumanizeDurationPipe implements PipeTransform {
  /**
   * Formats a time duration
   *
   * @param duration The duration in milliseconds
   * @returns The formatted duration
   */
  transform(duration: number): string {
    // TODO duration sometimes seems to be wrong. Off by few hours to half a day.
    // Just rounding stuff for now as it's not too important for us
    return humanizeDuration(duration, {
      largest: 2,
      units: ['y', 'mo', 'w', 'd'],
      round: true
    });
  }
}
