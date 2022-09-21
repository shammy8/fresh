import { DatePipe, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { DateTime } from 'luxon';

// import { LetModule } from '@rx-angular/template/let';

import { Item } from '../item.interface';
import { HumanizeDurationPipe } from '../pipes/humanize-duration.pipe';

@Component({
  standalone: true,
  imports: [
    NgIf,
    // IfModule, // TODO the action buttons appear half a second after the rest of the expansion box
    // LetModule,
    MatExpansionModule,
    HumanizeDurationPipe,
    DatePipe,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
  ],
  selector: 'fresh-item',
  templateUrl: './item.component.html',
  styles: [
    `
      mat-expansion-panel {
        margin: 5px 0;
      }
      mat-panel-title {
        flex-grow: 2;
        flex-direction: column;
        align-items: start;
      }
      .stored-in-text {
        color: rgba(255, 255, 255, 0.7);
        font-size: 12px;
      }
      .date-title-text {
        color: rgba(255, 255, 255, 0.7);
      }
      mat-panel-description.right-aligned {
        justify-content: end;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemComponent {
  dateTime = DateTime;

  /**
   * Today's date as a number set to a time of 00:00
   */
  @Input() today!: number;

  @Input() item: Item = {
    name: '',
    storedIn: '',
    dateBought: null,
    primaryDate: null,
    userDefinedDate: null,
    useBy: null,
    bestBefore: null,
    // notifyOn: null,
    createdAt: null,
    comments: '',
  };

  @Output() delete = new EventEmitter();

  @Output() deleteAndAddToShoppingList = new EventEmitter();

  @Output() edit = new EventEmitter();

  /**
   * @param timeUntilExpiration
   * @returns True if timeUntilExpiration is 7 days or less, false otherwise
   */
  isSevenDaysOrLess(timeUntilExpiration: number) {
    const sevenDays = 604800000; // 7 * 24 * 60 * 60 * 1000; // TODO make dynamic
    return timeUntilExpiration - sevenDays <= 0;
  }
}
