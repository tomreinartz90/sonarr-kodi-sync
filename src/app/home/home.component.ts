import { Component, OnInit } from '@angular/core';
import {KodiService} from "../shared/kodi.service";
import {SonarrService} from "../shared/sonarr.service";

@Component({
  selector: 'my-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  private kodiSeries = [];
  private sonarrSeries = [];
  private apiStatus:string;

  constructor(private kodi:KodiService, private sonarr:SonarrService) {
    // Do stuff
  }

  ngOnInit() {
    this.apiStatus = "getting episodes from KODI api";
    this.kodi.getWatchedEpisodes().subscribe(resp => {
    this.apiStatus = "getting series from SONARR api";
      this.kodiSeries = resp;
      this.sonarr.getSeries().subscribe(resp => {
        this.sonarrSeries = resp;

        this.sonarrSeries.forEach(serie => {
          serie['status'] = 'checking if serie needs sync';

          //check if series is available in kodi
          let kodiEpisodes = this.getSeriesFromKodi(serie['tvdbId']);
          if(kodiEpisodes.length){
            serie['status'] = 'has watched episodes';
          } else {
            serie['status'] = 'no need to sync';
          }

        })
      }, () => {
        this.apiStatus = "Issue getting data from Sonarr, Check settings.php in API folder"
      });
    }, () => {
      this.apiStatus = "Issue getting data from KODI"
    });
  }

  getSeriesFromKodi(tvdbId:number):Array<any>{
    return this.kodiSeries.filter(serie => serie['tvdb'] == tvdbId);
  }



  startSonarrSync(){
    this.sonarrSeries.forEach(serie => {

      let kodiEpisodes = this.getSeriesFromKodi(serie['tvdbId']);

      this.sonarr.getEpisodes(serie.id).subscribe(sonarrEpisodes => {
        let monitored = sonarrEpisodes.filter(ep => ep.monitored == true);
        if(monitored.length){
          serie['status'] = 'got episodes from sonarr, marking ' + kodiEpisodes.length + ' / ' + monitored.length + " as watched";
        } else {
          serie['status'] = 'does not need updates'
        }
        let updated:number = 0;
        let notWatched:number = 0;

        console.log(monitored, kodiEpisodes);
        monitored.forEach(file => {
          let eppWatched = kodiEpisodes.findIndex(epp => epp.season == file.seasonNumber && epp.episode == file.episodeNumber) > -1;
          console.log(eppWatched);
          if(!eppWatched){
            notWatched++;
            serie['status'] = 'Marked ' + updated + ' / ' + monitored.length + " as watched. Marked " + notWatched + " As need no update";
          } else {
            this.sonarr.setEpisodeWatched(file.id, file.seriesId, false).subscribe(() => {
              updated++;
              serie['status'] = 'Marked ' + updated + ' / ' + monitored.length + " as watched. Marked " + notWatched + ' / ' + monitored.length + " as need no update";
              if((updated + notWatched) == monitored.length){
                serie['status'] = "updated all episodes";
              }
            })
          }
        });
      });

    });
  }

}
