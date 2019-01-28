import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  getMovies() {
    return this.http.get('https://yts.am/api/v2/list_movies.json');
  }

  getSeries()
  {
    return this.http.get('https://yts.am/api/v2/list_series.json');
  }
  getFiles(type: string, page) {
    const url = 'https://yts.am/api/v2/list_' + type + '.json?page='+page;
    return this.http.get(url);
  }
/*
  getWithParams(type: string, params : Array)
  {
    const url='https://yts.am/api/v2/list_' + type + '.json'+params['']
  }
  */

}
