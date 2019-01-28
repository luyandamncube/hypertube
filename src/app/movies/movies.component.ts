import { Component, OnInit } from '@angular/core';

import { DataService } from '../services/data.service';
import { HttpClient } from '@angular/common/http';
// Mobile view breakpoints
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss']
})
export class MoviesComponent implements OnInit {
  movieList: Object;
  //Breakpoint observers for different sizes 
    isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );
    isTablet$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Tablet)
    .pipe(
      map(result => result.matches)
    );
    isWeb$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Web)
    .pipe(
      map(result => result.matches)
    );
  
  constructor(
    private data: DataService,
    private breakpointObserver: BreakpointObserver,
  ) { }

  ngOnInit() {
    this.data.getFiles("movies",1).subscribe(data => {
      // this.loading = true;
      this.movieList = data;
      // Improve this, make a promise to get proper async loading state
      if (this.movieList) {
        // this.loading = false;
      }

      console.log(this.movieList);
    });
  }

}
