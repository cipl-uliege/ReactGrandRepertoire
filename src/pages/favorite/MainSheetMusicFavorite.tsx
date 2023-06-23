import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { IPaginatedResultsAPI } from "../../api/interfaces/IPaginatedResultsAPI";
import Spinner from "../../components/Spinner";
import { Pagination } from "../../utils/Pagination";
import DisplayPages from "../../components/DisplayPages";
import Accordion from "../../components/Accordion";
import ButtonFilling from "../../components/ButtonFilling";
import ScrollIntoView from "../../components/ScrollIntoView";
import SkeletonLoaderSheetMusicFavorite from "./SkeletonLoaderSheetMusicFavorite";
import ButtonHelperGroup from "../../components/ButtonHelperGroup";
import { CategoryParameter } from "../../utils/CategoryParameter";
import ButtonFavorite from "../../components/ButtonFavorite";
import { IFavoriteSheetMusicAPI } from "../../api/interfaces/SheetMusic/IFavoriteSheetMusicAPI";
import { LocalStorage } from "../../utils/LocalStorage";

function setStateResultsPerPage(queryParameter: string) {
    let resultsPerPageQuery = parseInt(queryParameter);
    return isNaN(resultsPerPageQuery) ? Pagination.defaultResultPerPage : resultsPerPageQuery;
}

function setStatePage(queryParameter: string) {
    let pageQuery = parseInt(queryParameter);
    return isNaN(pageQuery) ? Pagination.defaultPage : pageQuery;
}

export default function MainSheetMusicFavorite() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [selectedResultsPerPage, setSelectedResultsPerPage] = useState<number>(setStateResultsPerPage(searchParams.get("results_per_page") ?? ""));
    const lastPage = useRef(Pagination.defaultPage);
    const [page, setPage] = useState<number>(setStatePage(searchParams.get("page") ?? ""));
    const [displayedPages, setDisplayedPages] = useState<number[]>([Pagination.defaultPage]);

    const [resultFromAPI, setResultFromAPI] = useState<IPaginatedResultsAPI<IFavoriteSheetMusicAPI[]> | null>(null);
    const [isRequestPending, setIsRequestPending] = useState(true);
    const totalNumberOfResults = useRef(0);

    const author = useRef(searchParams.get("author") ?? "");
    const title = useRef(searchParams.get("title") ?? "");
    const nbrInstrumentalists = useRef(-1);


    /************************************************************* */

    useEffect(() => {
        window.scrollTo({ top: 0 });
    }, []);

    useEffect(() => {
        if (isRequestPending) {
            return;
        }

        fetchNewResult();
    }, [page, selectedResultsPerPage]);


    const refreshUrlWithCorrectParameters = () => {
        navigate(`../favorites?&results_per_page=${selectedResultsPerPage}&page=${page}&author=${author.current}&title=${title.current}`, { replace: true });
    }

    const callBackSetPage = (page: number) => {
        if (page < Pagination.defaultPage) {
            setPage(Pagination.defaultPage);
        } else if (page > lastPage.current) {
            setPage(lastPage.current);
        } else {
            setPage(page);
        }
    }

    const callBackSearchAuthorTitleInstrumentalists = (authorSearch: string, titleSearch: string, nbrInstrumentalistsSearch: number) => {
        if (isRequestPending) {
            return;
        }

        author.current = authorSearch;
        title.current = titleSearch;
        nbrInstrumentalists.current = nbrInstrumentalistsSearch;
        fetchNewResult();
    }

    const fetchNewResult = () => {
        refreshUrlWithCorrectParameters();
        setIsRequestPending(true);
        setResultFromAPI(null);
    }

    const callbackWhenFetched = (json: IPaginatedResultsAPI<IFavoriteSheetMusicAPI[]>) => {
        lastPage.current = json.maxNbrOfPages;
        totalNumberOfResults.current = json.totalNbrOfResults;
        setTimeout(() => {
            setResultFromAPI(json);
            setIsRequestPending(false);
            setSelectedResultsPerPage(json.resultsPerPage);
            setDisplayedPages(Pagination.get(json.resultsPerPage, json.totalNbrOfResults, json.page));
        });
    }

    return (
        <div className="max-w-5xl mx-auto">

            <h2 className="font-raleway text-center text-xl uppercase font-black underline underline-offset-4 mt-2">
                Mes partitions favorites
            </h2>

            {
                LocalStorage.getFavoriteSheetMusic().length != 0 &&
                <div id="listSheetMusics" className="max-w-4xl mx-auto flex flex-col sm:justify-center sm:flex-row-reverse relative mt-4">

                    <div className="sticky top-0 w-full bg-white z-20 sm:shrink-0 sm:w-80 sm:self-start">
                        <SelectableResultsAndPagination
                            author={author.current}
                            title={title.current}
                            nbrInstrumentalists={nbrInstrumentalists.current}
                            selectedResultPerPage={selectedResultsPerPage}
                            setSelectedResultPerPage={setSelectedResultsPerPage}
                            isRequestPending={isRequestPending}
                            displayedPages={displayedPages}
                            lastPage={lastPage.current}
                            page={page}
                            callbackSetPage={callBackSetPage}
                            callbackSearchAuthorTitleInstrumentalists={callBackSearchAuthorTitleInstrumentalists}
                            totalNumberOfResults={totalNumberOfResults.current}></SelectableResultsAndPagination>
                    </div>
                    <div className="max-w-full sm:w-[720px] sm:max-w-none px-2">
                        {
                            isRequestPending &&
                            <>
                                <SkeletonLoaderSheetMusicFavorite
                                    author={author.current}
                                    title={title.current}
                                    nbrInstrumentalists={nbrInstrumentalists.current}
                                    callbackWhenFetched={callbackWhenFetched}
                                    page={page}
                                    resultsPerPage={selectedResultsPerPage}></SkeletonLoaderSheetMusicFavorite>
                            </>
                        }
                        {
                            isRequestPending == false && resultFromAPI != null &&
                            <>
                                {resultFromAPI.results.map(r =>
                                    <div key={r.id} className="flex shadow-md mb-3 p-3 rounded-md">
                                        <div className="grow">
                                            <div className="flex items-center mb-2">
                                                <div className="self-end">
                                                    <ButtonHelperGroup composition={r.composition}></ButtonHelperGroup>
                                                </div>
                                                <span className="ml-1 text-blue-500">{r.composition}</span>
                                            </div>
                                            <p className="mb-1"><span className="text-blue-900 font-bold text-xl">{r.author}</span></p>
                                            <p className="mb-1"><i className="text-xl text-blue-600 font-medium">{r.title}</i></p>

                                            <p className="mb-2"><i className="font-light text-lg">Édition & référence</i> : <span>{r.publisher}</span></p>
                                            {
                                                r.releaseYear != null &&
                                                <p><i className="font-light text-sm">Année</i> : <span className="text-xs">{r.releaseYear}</span></p>
                                            }
                                            {
                                                r.duration != null &&
                                                <p><i className="font-light text-sm">Durée</i> : <span className="text-xs">{r.duration}</span></p>
                                            }
                                        </div>
                                        <div className="self-start">
                                            <ButtonFavorite sheetMusicId={r.id}></ButtonFavorite>
                                        </div>
                                    </div>
                                )}
                                <ScrollIntoView idToScroll="listSheetMusics" dependenciesToWatch={[]}></ScrollIntoView>
                            </>
                        }

                    </div>
                </div>
            }
            {
                LocalStorage.getFavoriteSheetMusic().length == 0 &&
                <div className="mt-8">
                    <h3 className="text-red-600 text-2xl text-center font-raleway font-black">Il semblerait que vous n'ayez aucune partitions favorites.</h3>
                </div>
            }
        </div>
    )
}

function SelectableResultsAndPagination(props: {
    setSelectedResultPerPage: React.Dispatch<React.SetStateAction<number>>,
    selectedResultPerPage: number,
    isRequestPending: boolean,
    displayedPages: number[],
    page: number,
    lastPage: number,
    callbackSetPage: (page: number) => void,
    callbackSearchAuthorTitleInstrumentalists: (author: string, title: string, nbrInstrumentalists: number) => void,
    totalNumberOfResults: number,
    author: string,
    title: string,
    nbrInstrumentalists: number,
}) {

    const [toggleAccordion, setToggleAccordion] = useState<number>();
    const [author, setAuthor] = useState<string>(props.author);
    const [title, setTitle] = useState<string>(props.title);
    const [selectedInstrumentalist, setSelectedInstrumentalist] = useState<number>(props.nbrInstrumentalists);

    const search = () => {
        //il me faut un truc qui change à chaque fois pour que l'accordion détecte un changement.
        if (window.innerWidth < 640) {
            setToggleAccordion(Date.now());
        }
        props.callbackSearchAuthorTitleInstrumentalists(author, title, selectedInstrumentalist);
    }

    return (
        <div className="bg-white shadow-md sm:shadow-none flex flex-col">
            {
                props.isRequestPending &&
                <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-white bg-opacity-80 z-20">
                    <Spinner message=""></Spinner>
                </div>
            }
            <div className="order-1 sm:order-2">
                <hr className="border-t border-solid border-t-gray-500 sm:hidden " />
                <div className=" flex justify-evenly px-2 pt-3 pb-1 sm:pt-0 sm:flex-col">
                    <div className="text-xs font-light sm:text-lg ">
                        <div className="sm:hidden">
                            <p>Résultats</p>
                            <p>par page</p>
                        </div>
                        <hr className="hidden sm:block border-t border-solid border-t-gray-400 w-full mt-2 mb-1" />
                        <div className="hidden sm:block">
                            <p className="font-black uppercase text-base">Résultats par page</p>
                        </div>
                        <select
                            value={props.selectedResultPerPage}
                            onChange={(e) => {
                                let value = parseInt(e.target.value);
                                props.setSelectedResultPerPage(isNaN(value) ? Pagination.defaultResultPerPage : value)
                            }}
                            className="cursor-pointer mt-1 w-full p-1 text-center rounded-sm border border-solid border-gold-600 bg-white">
                            {
                                Pagination.selectableResults.map(s =>
                                    <option key={s} value={s}>{s}</option>
                                )
                            }
                        </select>
                    </div>
                    <div className="sm:mt-2">
                        <DisplayPages
                            callbackSetPage={props.callbackSetPage}
                            displayedPages={props.displayedPages}
                            page={props.page}
                            lastPage={props.lastPage}></DisplayPages>
                    </div>
                </div>
            </div>
            <div className="px-2 pb-2">
                <h3 className="font-black text-center uppercase sm:mt-3">{props.totalNumberOfResults} partitions(s) trouvée(s)</h3>
            </div>
            <div className="order-2 sm:order-1 sm:pr-1">
                <Accordion
                    toggleAccordion={toggleAccordion}
                    includeDefaultChevron={false}
                    classNameButton="buttonFilterAccordion sm:overflow-hidden"
                    classNameChildren="sm:rounded-br-xl sm:rounded-bl-xl"
                    button={
                        <div className="w-full bg-black sm:py-1 sm:rounded-tr-md sm:rounded-tl-md">
                            <h3 className="text-white text-sm font-light uppercase">Filtrer la recherche <i className="fa-solid fa-sliders"></i></h3>
                            <div className="-mt-2">
                                <i className="inline-block text-white fa-solid fa-chevron-down"></i>
                            </div>
                        </div>
                    }>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        search();
                    }} className="pb-1 px-2 bg-gray-100">
                        <div>
                            <label htmlFor="author" className="font-raleway font-black text-lg">
                                Auteur
                                <span className="font-open text-xs font-light">
                                    (Laisser vide pour ne spécifier aucun auteur)
                                </span>
                            </label>
                        </div>
                        <div>
                            <input placeholder="Nom de l'auteur à rechercher..." className="w-full shadow-md p-2 rounded-md" type="text" value={author} onChange={(e) => setAuthor(e.target.value)} />
                        </div>
                        <div className="mt-1 md:mt-2">
                            <label htmlFor="title" className="font-raleway font-black text-lg">
                                Titre
                                <span className="font-open text-xs font-light">(Laisser vide pour ne spécifier aucun titre)</span>
                            </label>
                        </div>
                        <div>
                            <input placeholder="Titre de l'oeuvre à rechercher..." className="w-full shadow-md p-2 rounded-md" type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                        </div>
                        <div className="mt-1 md:mt-2">
                            <label htmlFor="nbrInstrumentalists" className="font-raleway font-black text-lg">
                                Nombre d'instrument(s)
                            </label>
                        </div>
                        <div>
                            <select
                                value={selectedInstrumentalist}
                                onChange={(e) => {
                                    let value = parseInt(e.target.value);
                                    setSelectedInstrumentalist(isNaN(value) ? CategoryParameter.selectableCountInstrumentalists[0] : value);
                                }}
                                className="cursor-pointer w-full p-2 font-open text-center text-lg rounded-sm border border-solid border-gold-600 bg-white">

                                <option value={"-1"}>Peu importe</option>
                                <option value={"0"}>Indéfini. (Je ne cherche que des orchestres/ensembles)</option>
                                {CategoryParameter.selectableCountInstrumentalists.map(c =>
                                    <option value={c} key={c}>{c}</option>
                                )}
                            </select>
                        </div>
                        <div className="flex justify-center mt-2">
                            <ButtonFilling onClick={() => {
                                search();
                            }}>
                                <>Rechercher</>
                            </ButtonFilling>
                        </div>
                    </form>
                </Accordion>
            </div>
        </div>

    );
}