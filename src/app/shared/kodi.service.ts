/**
 * Created by Tom on 18-11-2016.
 */
import { Injectable } from '@angular/core';
import {Http} from "@angular/http";

@Injectable()
export class KodiService {
    private baseUrl:string = "./api";
    constructor(private http:Http) { }

    getWatchedEpisodes(){
        return this.http.get(this.baseUrl + '/kodi.php').map(resp => resp.json())
    }
}