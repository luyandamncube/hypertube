import { Component, OnInit } from '@angular/core';
// Use these to build forms
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../data.service';
// import { WebTorrent } from '../../../node_modules/webtorrent/webtorrent.min';
import WebTorrent from 'webtorrent';




@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss']
})
export class MoviesComponent implements OnInit {

  movieList: Object;
  constructor (private data: DataService) { }
  ngOnInit( ) {
    this.data.getMovies().subscribe(data => {
      this.movieList = data;
      console.log(this.movieList);
    });
  }
  stream(movie) {
    
    let magnet = new String('magnet:?xt=urn:btih:');
    const client = new WebTorrent();
    const video: HTMLElement = document.getElementById('playback');
    magnet = magnet + movie.torrents[0].hash + '&dn=';
    magnet = magnet + movie.torrents[0].url;
    magnet = magnet + 'tr=http://track.one:1234/announce&tr=udp://track.two:80';

    client.add(magnet, function(torrent){
      const file = torrent.files.find(function(file){
        return file.name.endsWith('mp4');
      });
      file.appendTo(video, [{
        autoplay: true,
        mute : true
      }]);
    });
    
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
}

