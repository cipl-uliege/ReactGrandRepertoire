import { useEffect } from "react";
import { IPaginatedResultsAPI } from "../../../../api/interfaces/IPaginatedResultsAPI";
import { Get } from "../../../../api/Get";
import { ITeachingLiteratureFromGroupAPI } from "../../../../api/interfaces/TeachingLiterature/ITeachingLiteratureFromGroupAPI";
import { ERROR_MSG_FETCH } from "../../../../utils/ErrorMessageFetch";

export default function SkeletonLoaderTeachingLiterature(props: { 
    resultsPerPage: number,
    page: number,
    author:string,
    title:string,
    groupId:string,
    callbackWhenFetched: (paginatedData : IPaginatedResultsAPI<ITeachingLiteratureFromGroupAPI[]>) => void,
}) {

    useEffect(() => {
        let isDataFetched = false;
        let abortController = new AbortController();
        Get.getTeachingLiteratureFromGroupId(props.groupId, abortController.signal, props.page, props.resultsPerPage, props.author, props.title)
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

    let array: any[] = [];

    for (let i = 0; i < props.resultsPerPage; i++) {
        array.push(
            <div key={i} className="h-40 flex bg-gray-100 shadow-md mb-3 p-3 rounded-md">
                <div className="w-full">
                    <div className="w-9/12 h-5 bg-gray-300 rounded-full fadeInFadeOut mb-3"></div>
                    <div className="w-2/3 h-3 bg-gray-300 rounded-full fadeInFadeOut mb-3"></div>
                    <div className="w-28 h-3 bg-gray-300 rounded-full fadeInFadeOut mb-3"></div>
                    <div className="flex items-center mb-3 gap-2 fadeInFadeOut">
                        <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                        <div className="w-20 h-3 rounded-full bg-gray-300"></div>
                    </div>
                    <div className="w-32 h-2 bg-gray-300 rounded-full fadeInFadeOut mb-3"></div>
                    <div className="w-28 h-2 bg-gray-300 rounded-full fadeInFadeOut mb-3"></div>
                </div>
            </div>
        );
    }

    return (
        <>
            {array}
        </>
    );
}