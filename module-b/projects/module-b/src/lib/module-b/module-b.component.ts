import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-module-b',
  templateUrl: './module-b.component.html',
  styleUrls: ['./module-b.component.scss']
})
export class ModuleBComponent implements OnInit {
  public people = [
    {
      name: 'William Johnson',
      birthday: new Date(1992, 2, 12)
    },
    {
      name: 'Ken Haymitch',
      birthday: new Date(1963, 6, 2)
    },
    {
      name: 'Isiah Washington',
      birthday: new Date(1956, 11, 21)
    }
  ];

  constructor() {
  }

  ngOnInit() {
  }

}
