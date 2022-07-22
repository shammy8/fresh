import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import { Item } from '../item.interface';

@Component({
  selector: 'fresh-item',
  templateUrl: './item.component.html',
  styles: [
    `
      mat-expansion-panel {
        margin: 5px 0;
      }
      .stored-in-text {
        color: rgba(255, 255, 255, 0.7);
        font-size: 12px;
      }
      .date-title-text {
        color: rgba(255, 255, 255, 0.7);
      }
      mat-panel-description.right-aligned {
        flex-grow: 0;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemComponent {
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
    notifyOn: null,
    createdAt: null,
    comments: '',
  };

  @Output() delete = new EventEmitter();

  @Output() edit = new EventEmitter();

  /**
   * @param timeUntilExpiration 
   * @returns True if timeUntilExpiration is 7 days or less, false otherwise 
   */
  isSevenDaysOrLess(timeUntilExpiration: number) {
    const sevenDays = 604800000; // 7 * 24 * 60 * 60 * 1000; // TODO make dynamic
    return timeUntilExpiration - sevenDays <= 0
  }
}
