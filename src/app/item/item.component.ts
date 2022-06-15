import { Component, Input, OnInit } from '@angular/core';

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
    `,
  ],
})
export class ItemComponent implements OnInit {
  @Input() item: Item = { name: '' };

  constructor() {}

  ngOnInit(): void {}

  onEdit() {}

  onDelete() {}
}
