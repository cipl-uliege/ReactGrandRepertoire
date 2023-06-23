import { LocalStorage } from "../utils/LocalStorage";
import { Pagination } from "../utils/Pagination";
import { InfoApi } from "./InfoApi"
import { IPaginatedResultsAPI } from "./interfaces/IPaginatedResultsAPI";
import { IFavoriteSheetMusicAPI } from "./interfaces/SheetMusic/IFavoriteSheetMusicAPI";

export class Post {
    // public static async getCombinations(wantedInstruments: IWantedInstrument[], abortSignal: AbortSignal) {
    //     let res = await fetch(InfoApi.url + "api/Group", {
    //         headers: {
    //             'Accept': 'application/json',
    //             'Content-Type': 'application/json'
    //         },
    //         method: "POST",
    //         body: JSON.stringify(wantedInstruments),
    //         signal: abortSignal,
    //     });

    //     let json:IGroupAPI[] = await res.json();
    //     return json;
    // }

    public static async getFavoriteSheetMusic(abortSignal: AbortSignal, page = Pagination.defaultPage, resultsPerPage = Pagination.defaultResultPerPage, author: string = "", title: string = "", nbrInstrumentalists: number = -1) {
        let res = await fetch(
            InfoApi.url + `api/SheetMusic/get_favorites?author=${author}&title=${title}&results_per_page=${resultsPerPage}&page=${page}&nbr_instrumentalists=${nbrInstrumentalists}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify(LocalStorage.getFavoriteSheetMusic()),
                signal: abortSignal
            }
        );
        if(res.status == 400){
            //si 400 depuis cet endpoint, cela veut dire qu'il y a plus de 100 ids dans le localstorage
            LocalStorage.clearFavoriteLocalStorage();
            throw new Error();
        }
        let json: IPaginatedResultsAPI<IFavoriteSheetMusicAPI[]> = await res.json();
        return json;
    }
}