import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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

  public form: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      birthday: ['', Validators.required]
    });
  }

  public addPerson(): void {
    if (this.form.invalid) {
      return;
    }

    this.people = [
      ...this.people,
      this.form.value
    ];
  }

}
