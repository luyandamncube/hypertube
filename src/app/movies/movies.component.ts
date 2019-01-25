import { Component, OnInit } from '@angular/core';
//Use these to build forms
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss']
})
export class MoviesComponent implements OnInit {
  movieform : FormGroup;
  constructor(
    private fb : FormBuilder,
  ) { }

  ngOnInit() {

    this.movieform = this.fb.group({
      label: ['Download from a magnet link', [
      ]],
      input: ['Magnet', [
      ]],
  });

  }

    //Accessors for ngIF error handling
    get input(){
      return this.movieform.get('input');
    }

}
