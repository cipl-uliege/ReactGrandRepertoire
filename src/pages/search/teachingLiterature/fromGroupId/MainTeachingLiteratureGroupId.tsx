import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import SkeletonLoaderTeachingLiterature from "./SkeletonLoaderTeachingLiterature";
import { Pagination } from "../../../../utils/Pagination";
import { ISheetMusicFromGroupAPI } from "../../../../api/interfaces/SheetMusic/ISheetMusicFromGroupAPI";
import { IPaginatedResultsAPI } from "../../../../api/interfaces/IPaginatedResultsAPI";
import { Get } from "../../../../api/Get";
import { ERROR_MSG_FETCH } from "../../../../utils/ErrorMessageFetch";
import { ITeachingLiteratureFromGroupAPI } from "../../../../api/interfaces/TeachingLiterature/ITeachingLiteratureFromGroupAPI";
import ButtonFavorite from "../../../../components/ButtonFavorite";
import ScrollIntoView from "../../../../components/ScrollIntoView";
import ButtonHelperGroup from "../../../../components/ButtonHelperGroup";
import Spinner from "../../../../components/Spinner";
import DisplayPages from "../../../../components/DisplayPages";
import Accordion from "../../../../components/Accordion";
import ButtonFilling from "../../../../components/ButtonFilling";

function setStateResultsPerPage(queryParameter: string) {
    let resultsPerPageQuery = parseInt(queryParameter);
    return isNaN(resultsPerPageQuery) ? Pagination.defaultResultPerPage : resultsPerPageQuery;
}

function setStatePage(queryParameter: string) {
    let pageQuery = parseInt(queryParameter);
    return isNaN(pageQuery) ? Pagination.defaultPage : pageQuery;
}

export default function MainSheetMusicGroupId() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const groupId = searchParams.get("id");

    //composition de la formation
    const [composition, setComposition] = useState<string | null>(null);

    //countdown si aucun groupId n'a été donné
    const intervalId = useRef<any>(null);
    const [countDown, setCountdown] = useState(15);


    const [selectedResultsPerPage, setSelectedResultsPerPage] = useState<number>(setStateResultsPerPage(searchParams.get("results_per_page") ?? ""));
    const lastPage = useRef(Pagination.defaultPage);
    const [page, setPage] = useState<number>(setStatePage(searchParams.get("page") ?? ""));
    const [displayedPages, setDisplayedPages] = useState<number[]>([Pagination.defaultPage]);

    const [resultFromAPI, setResultFromAPI] = useState<IPaginatedResultsAPI<ISheetMusicFromGroupAPI[]> | null>(null);
    const [isRequestPending, setIsRequestPending] = useState(true);
    const totalNumberOfResults = useRef(0);

    const author = useRef("");
    const title = useRef("");


    /************************************************************* */

    useEffect(() => {
        window.scrollTo({ top: 0 });
        if (groupId == null) {
            //si aucun query parameter pour le groupId, j'enclenche un décompte qui renverra  sur la page d'accueil     
            intervalId.current = setInterval(() => {
                setCountdown(prev => prev - 1);
            }, 1000);
        }

        let isDataFetched = false;
        let abortController = new AbortController();
        if (groupId != null) {
            Get.getCompositionFromGroupId(groupId, abortController.signal)
                .then(json => {
                    isDataFetched = true;
                    setComposition(json.composition);
                })
                .catch(() => {
                    if (abortController.signal.aborted) {
                        console.log("fetch aborted");
                    } else {
                        window.alert(ERROR_MSG_FETCH);
                    }
                })
        }


        return () => {
            if (isDataFetched == false) {
                abortController.abort();
            }
            clearInterval(intervalId.current);
        }
    }, []);

    //quand le décompte arrive à zéro, on redirige vers l'home page
    useEffect(() => {
        if (countDown == 0)
            navigate("/", { preventScrollReset: false });

    }, [countDown]);

    useEffect(() => {
        //si groupId est null ou qu'une requête est en cours on empêche une requête vers l'API
        if (groupId == null || isRequestPending) {
            return;
        }

        refreshUrlWithCorrectParameters();
        fetchNewResult();
    }, [page, selectedResultsPerPage]);


    const refreshUrlWithCorrectParameters = () => {
        navigate(`../from_group?id=${groupId}&results_per_page=${selectedResultsPerPage}&page=${page}`, { replace: true });
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

    const callBackSearchAuthorTitle = (authorSearch: string, titleSearch: string) => {
        author.current = authorSearch;
        title.current = titleSearch;
        fetchNewResult();
    }

    const fetchNewResult = () => {
        setIsRequestPending(true);
        setResultFromAPI(null);
    }

    const callbackWhenFetched = (json: IPaginatedResultsAPI<ITeachingLiteratureFromGroupAPI[]>) => {
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
            {
                /*S'il n'y a pas de query parameter pour l'id on redirige*/
                groupId == null &&
                <div className="mt-5 max-w-xl mx-auto">
                    <h3 className="font-raleway font-black text-center text-xl">Aucun <span className="text-red-700">identifiant</span> n'a été donné pour trouver les partitions d'une formation voulue. :(</h3>
                    <h4 className="font-open text-center text-lg font-light mt-5">
                        Vous allez être redirigé vers la <Link to={"/"} className="text-blue-500 hover:text-blue-800 underline underline-offset-4">page d'accueil</Link> dans : <span className="underline font-bold">{countDown}</span>
                    </h4>
                </div>
            }

            {
                //GUARD pour vérifier qu'un id a bel et bien été passé.
                groupId != null &&
                <div id="listTeachLitt" className="max-w-4xl mx-auto flex flex-col sm:justify-center sm:flex-row-reverse relative mt-4">

                    {/*COMPOSITION NAME POUR MOBILE*/}
                    <div className="sm:hidden">
                        <DisplayCompositionName composition={composition}></DisplayCompositionName>
                    </div>
                    <div className="sticky top-0 w-full bg-white z-20 sm:shrink-0 sm:w-80 sm:self-start">
                        <SelectableResultsAndPagination
                            author={author.current}
                            title={title.current}
                            selectedResultPerPage={selectedResultsPerPage}
                            setSelectedResultPerPage={setSelectedResultsPerPage}
                            isRequestPending={isRequestPending}
                            displayedPages={displayedPages}
                            lastPage={lastPage.current}
                            page={page}
                            callbackSetPage={callBackSetPage}
                            callbackSearchAuthorTitle={callBackSearchAuthorTitle}
                            totalNumberOfResults={totalNumberOfResults.current}></SelectableResultsAndPagination>
                    </div>
                    <div className="max-w-full sm:w-[720px] sm:max-w-none px-2">

                        {/*COMPOSITION NAME POUR DESKTOP*/}
                        <div className="hidden sm:block">
                            <DisplayCompositionName composition={composition}></DisplayCompositionName>
                        </div>

                        {
                            isRequestPending &&
                            <>
                                <SkeletonLoaderTeachingLiterature
                                    author={author.current}
                                    title={title.current}
                                    groupId={groupId}
                                    callbackWhenFetched={callbackWhenFetched}
                                    page={page}
                                    resultsPerPage={selectedResultsPerPage}></SkeletonLoaderTeachingLiterature>
                            </>
                        }
                        {
                            isRequestPending == false && resultFromAPI != null &&
                            <>
                                {resultFromAPI.results.map(r =>
                                    <div key={r.id} className="flex shadow-md mb-3 p-3 rounded-md">
                                        <div className="grow">
                                            <p className="mb-1">{/*<i className="font-light text-2xl">Auteur(s)</i> : */}<span className="text-blue-900 font-bold text-xl">{r.author}</span></p>
                                            {/* <p className="mb-1"><i className="font-light text-2xl">Titre</i> : <span className="text-blue-900 font-bold text-xl">{r.title}</span></p> */}
                                            <p className="mb-1"><i className="text-xl text-blue-600 font-medium">{r.title}</i></p>

                                            <p className="mb-2"><i className="font-light text-lg">Édition & référence</i> : <span>{r.publisher}</span></p>
                                            {/* <p><span className={"italic font-light text-lg"}>Auteur(s)</span> :</p>
                                            {/* <ul className="list-disc pl-2 ml-2 mb-2">
                                                <li>{r.author}</li>
                                            </ul> */}
                                            {
                                                r.releaseYear != null &&
                                                <p><i className="font-light text-sm">Année</i> : <span className="text-xs">{r.releaseYear}</span></p>
                                            }
                                            {
                                                r.duration != null &&
                                                <p><i className="font-light text-sm">Durée</i> : <span className="text-xs">{r.duration}</span></p>
                                            }
                                            {/* <p className="mb-1"><i className="font-light text-2xl">Titre</i> : <span className="text-blue-900 font-bold text-xl">{r.title}</span></p>
                                            <p className="mb-2"><i className="font-light text-lg">Édition & référence</i> : <span>{r.publisher}</span></p>
                                            <p><span className={"italic font-light text-lg"}>Auteur(s)</span> :</p>
                                            <ul className="list-disc pl-2 ml-2 mb-2">
                                                <li>{r.author}</li>
                                            </ul>
                                            <p><i className="font-light text-sm">Année</i> : <span className="text-xs">{r.releaseYear ?? "Année inconnue"}</span></p>
                                            <p><i className="font-light text-sm">Durée</i> : <span className="text-xs">{r.duration ?? "Durée inconnue"}</span></p> */}
                                        </div>
                                        <div className="self-start">
                                            <ButtonFavorite sheetMusicId={r.id}></ButtonFavorite>
                                        </div>
                                    </div>
                                )}
                                <ScrollIntoView idToScroll="listTeachLitt" dependenciesToWatch={[]}></ScrollIntoView>
                            </>
                        }

                    </div>
                </div>
            }
        </div>
    )
}

function DisplayCompositionName(props: { composition: string | null }) {
    return (
        <>
            {
                props.composition != null && props.composition != "" &&
                <div className="flex items-center">
                    <ButtonHelperGroup composition={props.composition}></ButtonHelperGroup>
                    <h2 id="compositionName" className="px-1 font-raleway text-blue-950 font-black text-3xl text-center sm:text-left">Œuvre(s) pour <i>{props.composition}</i></h2>
                </div>
            }
            {
                props.composition != null && props.composition == "" &&
                <h2 className="px-1 font-raleway text-red-700 font-black text-xl text-center sm:text-left">Aucune œuvre n'existe avec l'identifiant passé</h2>
            }
        </>
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
    callbackSearchAuthorTitle: (author: string, title: string) => void,
    totalNumberOfResults: number,
    author: string,
    title: string
}) {

    const [toggleAccordion, setToggleAccordion] = useState<number>();
    const [author, setAuthor] = useState<string>(props.author);
    const [title, setTitle] = useState<string>(props.title);

    const search = () => {
        //il me faut un truc qui change à chaque fois pour que l'accordion détecte un changement.
        if (window.innerWidth < 640) {
            setToggleAccordion(Date.now());
        }
        props.callbackSearchAuthorTitle(author, title);
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
                <h3 className="font-black text-center uppercase sm:mt-3">{props.totalNumberOfResults} œuvre(s) trouvée(s)</h3>
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
                            <label htmlFor="author" className="font-raleway font-black text-lg">Auteur<span className="font-open text-xs font-light">(Laisser vide pour ne spécifier aucun auteur)</span></label>
                        </div>
                        <div>
                            <input placeholder="Nom de l'auteur à rechercher..." className="w-full shadow-md p-2 rounded-md" type="text" value={author} onChange={(e) => setAuthor(e.target.value)} />
                        </div>
                        <div className="mt-2">
                            <label htmlFor="title" className="font-raleway font-black text-lg">Titre<span className="font-open text-xs font-light">(Laisser vide pour ne spécifier aucun titre)</span></label>
                        </div>
                        <div>
                            <input placeholder="Titre de l'oeuvre à rechercher..." className="w-full shadow-md p-2 rounded-md" type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                        </div>
                        <div className="flex justify-center mt-2">
                            <ButtonFilling>
                                <>Rechercher</>
                            </ButtonFilling>
                        </div>
                    </form>
                </Accordion>
            </div>
        </div>

    );
}