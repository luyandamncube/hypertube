import { Component, OnInit } from '@angular/core';
// Use these to build forms
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
<<<<<<< HEAD
import { WebTorrent } from '../../../node_modules/webtorrent';
// import * as WebTorrent from 'https://cdnjs.cloudflare.com/ajax/libs/webtorrent/0.103.0/webtorrent.min.js';


=======
>>>>>>> c34ff480a8c481f3c79f7d73e84ffff5e2e2d024
import { DataService } from '../services/data.service';
// Mobile view breakpoints
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
<<<<<<< HEAD
//Paginator
import {PageEvent} from '@angular/material';
=======
import { Torrent } from 'webtorrent';
>>>>>>> c34ff480a8c481f3c79f7d73e84ffff5e2e2d024

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

  //Paginator
  length = 100;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  // MatPaginator Output
  pageEvent: PageEvent;


  movieList: Object;
  constructor (
    private data: DataService,
    private breakpointObserver: BreakpointObserver,
  ) { }
  ngOnInit( ) {
    this.data.getFiles("movies",1).subscribe(data => {
      this.loading = true;
      this.movieList = data;
      // Improve this, make a promise to get proper async loading state
      if (this.movieList) {
        this.loading = false;
      }

      console.log(this.movieList);
    });
  }


  stream(movie) {
<<<<<<< HEAD
    let magnet = 'magnet:?xt=urn:btih:';
    // const client = new WebTorrent();
=======
   
    const WebTorrent = require ('webtorrent');
    const client = new WebTorrent();
>>>>>>> c34ff480a8c481f3c79f7d73e84ffff5e2e2d024
    const video: HTMLElement = document.getElementById('playback');
    let magnet = 'magnet:?xt=urn:btih:';
    magnet = magnet + movie.torrents[0].hash + '&dn=';
    magnet = magnet + movie.torrents[0].url;
    magnet = magnet + 'tr=http://track.one:1234/announce&tr=udp://track.two:80';
<<<<<<< HEAD
    /*
    client.add(magnet, function(torrent){
      const file = torrent.files.find(function(file){
        return file.name.endsWith('mp4');
=======
    magnet = magnet + '&tr=udp://open.demonii.com:1337/announce&tr=udp://tracker.openbittorrent.com:80';
    client.add(magnet, function(torrent) {


      console.log('called');
      const file = torrent.files.find(function(file) {
        console.log(file);
        return file.name.endsWith('');
      });
      console.log('I found him: ' + file);
      torrent.on('download', function(bytes) {
        console.log('just downloaded: ' + bytes);
        console.log('total downloaded: ' + torrent.downloaded);
        console.log('download speed: ' + torrent.downloadSpeed);
        console.log('progress: ' + torrent.progress);
      });
      torrent.on('ready', function() {
        console.log('The Torrent is ready');
      });
      torrent.on('warning', function (err) {
        console.log('error: ' + err);
      });

      torrent.on('meatadata', function() {
        torrent.files.array.forEach(element => {
          console.log(element);
        });
>>>>>>> c34ff480a8c481f3c79f7d73e84ffff5e2e2d024
      });
      file.appendTo(video, [{
        autoplay: true,
        mute : true
      }], function(err, elem) {
        if (err) {
         throw err; // file failed to download or display in the DOM
        }
        console.log('New DOM node with the content', elem);
      });
    });
<<<<<<< HEAD
    */
    console.log(magnet);
    console.log(movie.torrents[0].url);
  }
// magnet:?xt=urn:btih:TORRENT_HASH&dn=Url+Encoded+Movie+Name&tr=http://track.one:1234/announce&tr=udp://track.two:80
  /*makeMagnet(movie: Object)
    let magnet = new String('magnet:?xt=urn:btih:');
    magnet = magnet + movie.torrents[0].hash + '&dn=';
    magnet = magnet + movie.torrents[0].url;
    magnet = magnet + 'tr=http://track.one:1234/announce&tr=udp://track.two:80';
    console.log(magnet);
    return (magnet);
  }*/
  onScroll() {
    console.log('scrolled!!');
  }
=======
    console.log(magnet);
    console.log(movie.torrents[0].url);
  }
>>>>>>> c34ff480a8c481f3c79f7d73e84ffff5e2e2d024

}

