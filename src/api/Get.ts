import { Pagination } from "../utils/Pagination";
import { InfoApi } from "./InfoApi";
import { ISelectedCategoryAPI } from "./interfaces/Category/ISelectedCategoryAPI";
import { ICompositionAPI } from "./interfaces/Group/ICompositionAPI";
import { IGroupFromCategoryAPI } from "./interfaces/Group/IGroupFromCategoryAPI";
import { ISheetMusicFromGroupAPI } from "./interfaces/SheetMusic/ISheetMusicFromGroupAPI";
import { IPaginatedResultsAPI } from "./interfaces/IPaginatedResultsAPI";
import { IAbreviationAndNameAPI } from "./interfaces/Instrument/IAbreviationAndNameAPI";
import { ISheetMusicFromAuthorTitleAPI } from "./interfaces/SheetMusic/ISheetMusicFromAuthorTitle";
import { ITeachingLiteratureAPI } from "./interfaces/TeachingLiterature/ITeachingLiteratureAPI";
import { ITeachingLiteratureFromGroupAPI } from "./interfaces/TeachingLiterature/ITeachingLiteratureFromGroupAPI";

export class Get {
    /*Récupère les informations par rapport aux partitions de musique (Titre, oeuvre, année, durée)*/
    public static async sheetMusicsFromGroupId(groupId: string, abortSignal: AbortSignal, page = Pagination.defaultPage, resultsPerPage = Pagination.defaultResultPerPage, author: string = "", title: string = "") {
        let res = await fetch(InfoApi.url + `api/SheetMusic/get_from_group/${groupId}?page=${page}&results_per_page=${resultsPerPage}&author=${author}&title=${title}`, { signal: abortSignal });
        let json: IPaginatedResultsAPI<ISheetMusicFromGroupAPI[]> = await res.json();
        return json;
    }

    //récupère les catégories (Bois(1), Bois(1) Cuivres(2), etc..) par rapport au nombre d'instrumentalistes.
    public static async getSelectedCategories(abortSignal: AbortSignal, shouldIncludeOrchEnsemb: boolean = false, nbrInstrumentalists: number = 1, page = Pagination.defaultPage, resultsPerPage = Pagination.defaultResultPerPage, filterInstrumentFamilies: string = "") {
        let res = await fetch(InfoApi.url + `api/Category?include_orchestra_or_ensemble=${shouldIncludeOrchEnsemb}&nbr_instrumentalists=${nbrInstrumentalists}&page=${page}&results_per_page=${resultsPerPage}&instrument_families_to_include=${filterInstrumentFamilies}`, { signal: abortSignal });
        let json: IPaginatedResultsAPI<ISelectedCategoryAPI[]> = await res.json();
        return json;
    }

    //récupère les formations possibles pour une catégories
    //Exemple : On clique sur Bois (2) cet appel nous renverra : (2PICC, 2FL, PICC FL, etc..)
    public static async getGroupsFromCategoryId(id: number, abortSignal: AbortSignal) {
        let res = await fetch(InfoApi.url + `api/Group/get_from_category/${id}`, { signal: abortSignal });
        let json: IGroupFromCategoryAPI[] = await res.json();
        return json;
    }

    //recupère la composition d'une formation via son id.
    //Exemple : id = 148, cet appel nous renverra : (PICC 2TRP P)
    public static async getCompositionFromGroupId(id: string, abortSignal: AbortSignal) {
        let res = await fetch(InfoApi.url + `api/Group/get_composition/${id}`, { signal: abortSignal });
        let json: ICompositionAPI = await res.json();
        return json;
    }

    //décode les abréviations en nom complet
    //exemple : FL P, cet appel nous renverra : (flûte, piano)
    public static async getInstrumentNameFromComposition(composition: string, abortSignal: AbortSignal) {
        let res = await fetch(InfoApi.url + `api/Instrument/get_name_from_composition/${composition.replace("/", "%2F")}`, { signal: abortSignal });
        let json: IAbreviationAndNameAPI[] = await res.json();
        return json;
    }

    public static async getSheetMusicsFromAuthorTitle(abortSignal: AbortSignal, page = Pagination.defaultPage, resultsPerPage = Pagination.defaultResultPerPage, author: string = "", title: string = "", nbrInstrumentalists: number = -1) {
        let res = await fetch(InfoApi.url + `api/SheetMusic/from_author_or_title?author=${author}&title=${title}&results_per_page=${resultsPerPage}&page=${page}&nbr_instrumentalists=${nbrInstrumentalists}`, { signal: abortSignal });
        let json: IPaginatedResultsAPI<ISheetMusicFromAuthorTitleAPI[]> = await res.json();
        return json;
    }

    //récupère tous les ENS LITT (enseignement, littérature)
    public static async getAllTeachingLiterature(abortSignal: AbortSignal) {
        let res = await fetch(InfoApi.url + `api/TeachingLiterature/get_category`, { signal: abortSignal });
        let json: ITeachingLiteratureAPI[] = await res.json();
        return json;
    }

    //récupère les oeuvres en fonction de l'id de l'ENS LITT
    public static async getTeachingLiteratureFromGroupId(groupId: string, abortSignal: AbortSignal, page = Pagination.defaultPage, resultsPerPage = Pagination.defaultResultPerPage, author: string = "", title: string = ""){
        let res = await fetch(InfoApi.url + `api/TeachingLiterature/get_from_group/${groupId}?page=${page}&results_per_page=${resultsPerPage}&author=${author}&title=${title}`, { signal: abortSignal });
        let json: IPaginatedResultsAPI<ITeachingLiteratureFromGroupAPI[]> = await res.json();
        return json;
    }
}