import { Component, OnInit } from '@angular/core';
// Use these to build forms
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../services/data.service';
//Mobile view breekpoints
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss']
})
export class MoviesComponent implements OnInit {
  loading = false;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  movieList: Object;
  constructor (
    private data: DataService,
    private breakpointObserver: BreakpointObserver, 
  ) { }
  ngOnInit( ) {
    this.data.getMovies().subscribe(data => {
      this.loading = true;
      this.movieList = data;
      //Improve this, make a promise to get proper async loading state
      if (this.movieList){
        this.loading = false;
      }

      console.log(this.movieList);
    })
  }
  
}

