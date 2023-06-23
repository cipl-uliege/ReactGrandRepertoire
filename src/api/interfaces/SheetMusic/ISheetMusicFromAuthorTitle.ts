export interface ISheetMusicFromAuthorTitleAPI{
    id:number,
    composition:string,
    title:string,
    author:string,
    publisher:string,
    releaseYear:number | null,
    duration:string | null
}