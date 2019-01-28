import { Component, OnInit } from '@angular/core';
// Use these to build forms
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../services/data.service';
// Mobile view breakpoints
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { Torrent } from 'webtorrent';

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
      // Improve this, make a promise to get proper async loading state
      if (this.movieList) {
        this.loading = false;
      }

      console.log(this.movieList);
    });
  }


  stream(movie) {
   
    const WebTorrent = require ('webtorrent');
    const client = new WebTorrent();
    const video: HTMLElement = document.getElementById('playback');
    let magnet = 'magnet:?xt=urn:btih:';
    magnet = magnet + movie.torrents[0].hash + '&dn=';
    magnet = magnet + movie.torrents[0].url;
    magnet = magnet + 'tr=http://track.one:1234/announce&tr=udp://track.two:80';
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
    console.log(magnet);
    console.log(movie.torrents[0].url);
  }

}

