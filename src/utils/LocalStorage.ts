export class LocalStorage{
    private static favoriteSheetMusic:number[] = this.getFavoriteInit();
    public static readonly maxFavoriteSheetMusic = 100;

    private static getFavoriteInit(){
        let data:number[] = JSON.parse(localStorage.getItem("favoriteSheetMusic") ?? "[]");
        //au cas où un malin set le localstorage via la console du navigateur et cela excède la limite et refresh la page, 
        //je vide ses favoris.
        if(data.length > this.maxFavoriteSheetMusic){
            data = [];
        }
        return data;
    }

    public static addFavoriteSheetMusic(sheetMusicId:number){
        if(this.favoriteSheetMusic.findIndex(f => f == sheetMusicId) == -1 && this.favoriteSheetMusic.length != this.maxFavoriteSheetMusic){
            this.favoriteSheetMusic.push(sheetMusicId);
            this.updateFavoriteLocalStorage();
            return true;
        }

        return false;
    }

    public static removeFavoriteSheetMusic(sheetMusicId:number){
        this.favoriteSheetMusic = this.favoriteSheetMusic.filter(f => f != sheetMusicId);
        this.updateFavoriteLocalStorage();
        return true;
    }

    public static getFavoriteSheetMusic(){
        return this.favoriteSheetMusic;
    }

    public static doesSheetMusicIdIsInFavorite(sheetMusicId:number){
        return this.favoriteSheetMusic.includes(sheetMusicId);
    }

    private static updateFavoriteLocalStorage(){
        localStorage.setItem("favoriteSheetMusic", JSON.stringify(this.favoriteSheetMusic));
    }

    public static clearFavoriteLocalStorage(){
        this.favoriteSheetMusic = [];
        this.updateFavoriteLocalStorage();
    }
}