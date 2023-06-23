import { useEffect, useRef, useState } from "react"
import { LocalStorage } from "../utils/LocalStorage";
import { Toast } from "../utils/Toast";

export default function ButtonFavorite(props:{sheetMusicId:number}){
    const [isFavorite, setIsFavorite] = useState(LocalStorage.doesSheetMusicIdIsInFavorite(props.sheetMusicId));
    const justMounted = useRef(true);
    
    useEffect(() => {
        if(justMounted.current){
            justMounted.current = false;
            return;
        }

        if(isFavorite){
            if(LocalStorage.addFavoriteSheetMusic(props.sheetMusicId)){
                Toast.success(`(${LocalStorage.getFavoriteSheetMusic().length + "/" + LocalStorage.maxFavoriteSheetMusic}) Cette partition a été ajoutée à votre liste des favoris !`, 5000);
            }else{
                Toast.error(`(${LocalStorage.getFavoriteSheetMusic().length + "/" + LocalStorage.maxFavoriteSheetMusic}) Impossible d'ajouter cette partition à la liste des favoris.`, 5000)
            }
        }else{
            LocalStorage.removeFavoriteSheetMusic(props.sheetMusicId);
            Toast.success(`(${LocalStorage.getFavoriteSheetMusic().length + "/" + LocalStorage.maxFavoriteSheetMusic}) Cette partition a été retirée de votre liste des favoris !`, 5000);
        }
        
    }, [isFavorite])
    return(
        <button onClick={() => setIsFavorite(!isFavorite)} className="w-10 h-10 flex justify-center items-center text-3xl">
            {
                isFavorite == false &&
                <i className="fa-regular fa-star text-yellow-400"></i>
            }
            {
                isFavorite == true &&
                <i className="fa-solid fa-star text-yellow-400"></i>
            }
        </button>
    )
}