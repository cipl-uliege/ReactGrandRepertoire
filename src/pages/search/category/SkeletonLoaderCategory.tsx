import { useEffect } from "react";
import { Get } from "../../../api/Get";
import { IPaginatedResultsAPI } from "../../../api/interfaces/IPaginatedResultsAPI";
import { ISelectedCategoryAPI } from "../../../api/interfaces/Category/ISelectedCategoryAPI";
import { IFilterInstrumentFamily } from "./IFilterInstrumentFamily";
import { ERROR_MSG_FETCH } from "../../../utils/ErrorMessageFetch";

export default function SkeletonLoaderCategory(props:{
    shouldHaveOrchEnsemb:boolean,
    nbrInstrumentalists:number,
    resultsPerPage:number,
    page:number,
    filterInstrumentFamilies:IFilterInstrumentFamily[],
    callbackWhenFetched : (json:IPaginatedResultsAPI<ISelectedCategoryAPI[]>) => void

}){
    useEffect(() => {
        let isDataFetched = false;
        let abortController = new AbortController();        
        Get.getSelectedCategories(abortController.signal, props.shouldHaveOrchEnsemb, props.nbrInstrumentalists, props.page, props.resultsPerPage, props.filterInstrumentFamilies.map(f => `${f.instrumentFamily} (${f.count})`).join('_'))
            .then(json => {
                isDataFetched = true;
                props.callbackWhenFetched(json);
            })
            .catch(() => {
                if (abortController.signal.aborted) {
                    console.log("fetch aborted");
                } else {
                    window.alert(ERROR_MSG_FETCH);
                }
            })

        return () => {
            if (isDataFetched == false) {
                abortController.abort();
            }
        }
    }, [])

    let array = [];

    for(let i = 0; i < props.resultsPerPage; i++){
        array.push(
            <div key={i} className="p-3 h-16 shadow-md my-2 rounded-md flex items-center">
                <div className="w-full">
                    <div className="fadeInFadeOut h-3 bg-gray-300 rounded-full w-3/4"></div>
                    <div className="fadeInFadeOut h-3 mt-1 bg-gray-300 rounded-full w-2/3"></div>
                </div>
            </div>
        )
    }

    return(
        <>{array}</>
    );
}