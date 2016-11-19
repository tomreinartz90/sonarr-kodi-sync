/**
 * Created by Tom on 18-11-2016.
 */
import { Injectable } from '@angular/core';
import {Http} from "@angular/http";

@Injectable()
export class SonarrService {
    private baseUrl:string = "./api";

    private settings$;

    constructor(private http:Http) { }

    getSettings(){
        if(!this.settings$){
            this.settings$ = this.http.get(this.baseUrl + '/sonarr.php').map(resp => resp.json()).publishReplay(1)
                .refCount();
        }
        return this.settings$;
    }


    getSeries(){
        return this.getSettings().mergeMap(
            settings => this.http.get(settings.url + "/series/?apikey=" + settings.apiKey)
                .map(resp => resp.json())
        )
    }

    getEpisodes(seriesID){
        return this.getSettings().mergeMap(
            settings =>  this.http.get(settings.url +  "/episode?seriesId=" + seriesID + "&apikey=" + settings.apiKey)
                .map(resp => resp.json())
        )
    }

    setEpisodeWatched(episodeId:number, seriesId:number, status:boolean = true){

        return this.getSettings().mergeMap(settings => {
                let episodeUrl = settings.url + "/episode/" + episodeId + "?seriesId=" + seriesId + "&apikey=" + settings.apiKey;
                return this.http.get(episodeUrl)
                    .map(resp => resp.json())
                    .mergeMap(episodeData => {
                        episodeData['monitored'] = status;
                        return this.http.put(episodeUrl, episodeData)
                            .map(resp => resp.json())
                    })
            }
        )
    }

}