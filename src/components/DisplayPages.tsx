import { Pagination } from "../utils/Pagination";

export default function DisplayPages(props: {
    displayedPages: number[],
    page: number,
    lastPage: number,
    callbackSetPage: (page:number) => void,
}) {
    let fixPage:number = 0;
    if (props.page > props.lastPage) {
        fixPage = props.lastPage;
    } else if (props.page < Pagination.defaultPage) {
        fixPage = Pagination.defaultPage;
    } else{
        fixPage = props.page;
    }
    return (
        <div>
            <div className="flex flex-wrap gap-1 justify-center">
                {
                    props.displayedPages.map((p) =>
                        <button
                            onClick={() => props.callbackSetPage(p)}
                            className={"min-w-[40px] h-10 border border-solid border-gold-600 rounded-md hover:bg-gold-600 hover:text-white " + (p == fixPage ? "bg-gold-600 text-white" : "")}
                            key={p}>{p}</button>
                    )
                }
            </div>
            <div className="flex gap-1 justify-center mt-1">
                <button disabled={props.page <= Pagination.defaultPage} onClick={() => props.callbackSetPage(Pagination.defaultPage)} className="rounded-md min-w-[40px] h-10 bg-gray-200 [&:not(:disabled)]:hover:bg-cu_yellow-100">
                    <i className="fa-solid fa-backward-fast"></i>
                </button>
                <button disabled={props.page <= Pagination.defaultPage} onClick={() => props.callbackSetPage(fixPage - 1)} className="rounded-md min-w-[40px] h-10 bg-gray-200 [&:not(:disabled)]:hover:bg-cu_yellow-100">
                    <i className="fa-solid fa-backward-step"></i>
                </button>
                <button disabled={props.page >= props.lastPage} onClick={() => props.callbackSetPage(fixPage + 1)} className="rounded-md min-w-[40px] h-10 bg-gray-200 [&:not(:disabled)]:hover:bg-cu_yellow-100">
                    <i className="fa-solid fa-forward-step"></i>
                </button>
                <button disabled={props.page >= props.lastPage} onClick={() => props.callbackSetPage(props.lastPage)} className="rounded-md min-w-[40px] h-10 bg-gray-200 [&:not(:disabled)]:hover:bg-cu_yellow-100">
                    <i className="fa-solid fa-forward-fast"></i>
                </button>
            </div>
        </div>
    )
}