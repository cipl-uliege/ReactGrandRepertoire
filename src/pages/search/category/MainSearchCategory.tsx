import { useEffect, useRef, useState } from "react";
import { CategoryParameter } from "../../../utils/CategoryParameter";
import ToggleSwitch from "../../../components/ToggleSwitch";
import ButtonFilling from "../../../components/ButtonFilling";
import { ISelectedCategoryAPI } from "../../../api/interfaces/Category/ISelectedCategoryAPI";
import { IPaginatedResultsAPI } from "../../../api/interfaces/IPaginatedResultsAPI";
import SkeletonLoaderCategory from "./SkeletonLoaderCategory";
import { Pagination } from "../../../utils/Pagination";
import Spinner from "../../../components/Spinner";
import DisplayPages from "../../../components/DisplayPages";
import { useNavigate, useSearchParams } from "react-router-dom";
import DisplayResults from "./DisplayResults";
import ScrollIntoView from "../../../components/ScrollIntoView";
import { InstrumentParameter } from "../../../utils/InstrumentParameter";
import { Toast } from "../../../utils/Toast";
import { IFilterInstrumentFamily } from "./IFilterInstrumentFamily";

/*************************************************/
//Set juste les state au départ du component principal en récupérant les query parameters.
function setStateResultsPerPage(queryParameter: string) {
    let resultsPerPageQuery = parseInt(queryParameter);
    return isNaN(resultsPerPageQuery) ? Pagination.defaultResultPerPage : resultsPerPageQuery;
}

function setStatePage(queryParameter: string) {
    let pageQuery = parseInt(queryParameter);
    return isNaN(pageQuery) || pageQuery < 1 ? Pagination.defaultPage : pageQuery;
}

function setStateInstrumentalist(queryParameter: string) {
    let instrumentalistQuery = parseInt(queryParameter);
    return isNaN(instrumentalistQuery) || instrumentalistQuery > CategoryParameter.selectableCountInstrumentalists[CategoryParameter.selectableCountInstrumentalists.length - 1] ? CategoryParameter.selectableCountInstrumentalists[0] : instrumentalistQuery;
}

//par défaut le count est à "0". Pourquoi le count est un string ->
//au départ je souhaitais donner la possibilité de taper le nbr soi-même via un input txt mais
//cela engendrait bcp de problèmes pour pas grand chose dont j'ai remplacé cela par un bouton + et -.
function setStateFilterInstrumentFamilies() {
    let arrayTemp: IFilterInstrumentFamily[] = [];
    for (let i = 0; i < InstrumentParameter.instrumentFamilies.length; i++) {
        arrayTemp.push({
            count: "0",
            instrumentFamily: InstrumentParameter.instrumentFamilies[i]
        });
    }

    return arrayTemp;
}
/*************************************************/
export default function MainSearchCategory() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const filterInstrumentFamilies = useRef<IFilterInstrumentFamily[]>(setStateFilterInstrumentFamilies());

    const [selectedInstrumentalist, setSelectedInstrumentalist] = useState(setStateInstrumentalist(searchParams.get("nbr_instrumentalists") ?? ""));

    const [selectedResultsPerPage, setSelectedResultsPerPage] = useState(setStateResultsPerPage(searchParams.get("results_per_page") ?? ""));
    const [page, setPage] = useState(setStatePage(searchParams.get("page") ?? ""));
    const [displayedPages, setDisplayedPages] = useState<number[]>([Pagination.defaultPage]);
    const lastPage = useRef(Pagination.defaultPage);
    const [shouldHaveOrchEnsemb, setShouldHaveOrchEnsemb] = useState<boolean>(selectedInstrumentalist == 0);

    const [result, setResult] = useState<IPaginatedResultsAPI<ISelectedCategoryAPI[]> | null>(null);
    const totalNumberOfResults = useRef(0);
    const [isRequestPending, setIsRequestPending] = useState<boolean>(false);

    const wasFirstRequestMade = useRef(false);

    const callbackWhenFetched = (json: IPaginatedResultsAPI<ISelectedCategoryAPI[]>) => {
        wasFirstRequestMade.current = true;
        lastPage.current = json.maxNbrOfPages;
        totalNumberOfResults.current = json.totalNbrOfResults;
        refreshUrlWithCorrectParameters();
        setResult(json);
        setIsRequestPending(false);
        setDisplayedPages(Pagination.get(json.resultsPerPage, json.totalNbrOfResults, json.page));
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

    //Quand le component render pour la première fois, je regarde s'il y a quelque chose dans ces 3
    //query parameters, si c'est le cas, je lance un appel à l'API pour récupérer les données.
    useEffect(() => {
        if (searchParams.get("nbr_instrumentalists") && searchParams.get("results_per_page") && searchParams.get("page")) {
            fetchNewResult();
        }
    }, [])

    //Si une première requête a été faite lorsqu'on appuie sur le toggle switch pour Switcher s'il
    //y a des orchestres / ensembles avec , je lance une recherche automatique sans appuyer sur le bouton rechercher.
    useEffect(() => {
        if (wasFirstRequestMade.current == false || isRequestPending) {
            return;
        }

        fetchNewResult();
    }, [shouldHaveOrchEnsemb])

    //si une première requête n'a pas été faite, je l'empêche de faire un appel faire l'api.
    //se déclenche au moment du OnMount. le WasFirstRequestMade est une guarde pour empêcher cela.
    useEffect(() => {
        if (wasFirstRequestMade.current == false) {
            return;
        }
        fetchNewResult();
    }, [page, selectedResultsPerPage]);

    //fetchNewResult va permettre au component SkeletonLoaderCategory de s'afficher et c'est lui même qui va permettre
    //de mettre à jour les données ici avec le callbackWhenFetched.
    const fetchNewResult = () => {
        //guard
        if (isRequestPending) {
            return;
        }
        setIsRequestPending(true);
        setResult(null);
    }

    const refreshUrlWithCorrectParameters = () => {
        navigate(`../category?results_per_page=${selectedResultsPerPage}&page=${page}&nbr_instrumentalists=${selectedInstrumentalist}`, { replace: true });
    }

    const onChangeSelectInstrumentalists = (value: number) => {
        setSelectedInstrumentalist(isNaN(value) ? CategoryParameter.selectableCountInstrumentalists[0] : value)

        //Si c'est 0 -> indéfini -> on ne veut que des ensembles/orchestres -> je disable le ToggleSwitch et le mets de force à true.
        if (value == 0) {
            setShouldHaveOrchEnsemb(true);
        }

        //Si une première requête a été au moment de changer de nbr d'instrumentalist, je relance un appel
        //pour éviter de réappuyer sur le bouton rechercher.
        if (wasFirstRequestMade.current) {
            if (filterInstrumentFamilies.current.findIndex(f => f.count != "0") != -1) {
                Toast.warn("Nous avons réinitialisé les filtres dû au changement du nombre d'instrumentistes.");
            }

            filterInstrumentFamilies.current = setStateFilterInstrumentFamilies();
            fetchNewResult();
        }
    }

    const callBackSetFilterInstrumentFamilies = (filter: IFilterInstrumentFamily[]) => {
        filterInstrumentFamilies.current = filter;
        fetchNewResult();
    }

    return (
        <div className="max-w-5xl mx-auto">
            <h2 className="font-raleway text-center text-xl uppercase font-black underline underline-offset-4 mt-2">
                Recherche par nombre d'instruments
            </h2>

            <div className="max-w-sm mx-auto px-1 mt-2">
                <h3 className="font-open text-center text-lg uppercase font-light">Combien d'instruments cherchez-vous?</h3>
                <select
                    value={selectedInstrumentalist}
                    onChange={(e) => {
                        onChangeSelectInstrumentalists(parseInt(e.target.value));
                    }}
                    className="cursor-pointer w-full p-3 font-open text-center text-lg rounded-sm border border-solid border-gold-600 bg-white">
                    <option value={"0"}>Indéfini. (Je ne cherche que des orchestres/ensembles)</option>
                    {CategoryParameter.selectableCountInstrumentalists.map(c =>
                        <option value={c} key={c}>{c}</option>
                    )}
                </select>

                <div className="flex items-center px-2 gap-3 mt-4">
                    <h4 className="font-light">Inclure des orchestres ou ensembles avec ?</h4>
                    {/* {Disable == 0 -> on ne veut que des instrumentalists voir @onChangeSelectInstrumentalists} */}
                    <ToggleSwitch disable={selectedInstrumentalist == 0} check={shouldHaveOrchEnsemb} setCheck={setShouldHaveOrchEnsemb}></ToggleSwitch>
                </div>

                <div className="flex justify-center mt-3">
                    <ButtonFilling onClick={() => {
                        fetchNewResult();
                    }}>
                        <>Rechercher</>
                    </ButtonFilling>
                </div>
            </div>


            <div id="listCategories" className="max-w-4xl mx-auto flex flex-col sm:justify-center sm:flex-row-reverse relative mt-4">
                <div className="sticky top-0 w-full bg-white z-20 sm:shrink-0 sm:w-72 sm:self-start">
                    {
                        (wasFirstRequestMade.current || isRequestPending) &&
                        <SelectableResultsAndPagination
                            nbrInstrumentalists={selectedInstrumentalist}
                            selectedResultPerPage={selectedResultsPerPage}
                            setSelectedResultPerPage={setSelectedResultsPerPage}
                            isRequestPending={isRequestPending}
                            displayedPages={displayedPages}
                            lastPage={lastPage.current}
                            page={page}
                            callbackSetPage={callBackSetPage}
                            callbackSetFilterInstrumentFamilies={callBackSetFilterInstrumentFamilies}
                            filterInstrumentFamilies={filterInstrumentFamilies.current}
                            totalNumberOfResults={totalNumberOfResults.current}></SelectableResultsAndPagination>
                    }
                </div>

                <div className="max-w-full sm:w-[720px] sm:max-w-none px-2">
                    {
                        wasFirstRequestMade.current &&
                        <h2 className="font-raleway font-black text-lg md:text-xl">
                            Résultats pour
                            {selectedInstrumentalist != 0 ? ` ${selectedInstrumentalist} instrumentiste(s)` : "un nombre indéfini d'instrumentiste"}
                            {shouldHaveOrchEnsemb ? " avec ensemble ou orchestre" : " sans ensemble et orchestre"}
                            {filterInstrumentFamilies.current.findIndex(f => f.count != "0") == -1 ? "" : ` et doit inclure ${filterInstrumentFamilies.current.filter(f => f.count != "0").map(f => `${f.instrumentFamily} (${f.count})`).join(', ')}`}
                        </h2>
                    }
                    {
                        isRequestPending &&
                        <SkeletonLoaderCategory
                            filterInstrumentFamilies={filterInstrumentFamilies.current.filter(f => f.count != "0")}
                            callbackWhenFetched={callbackWhenFetched}
                            nbrInstrumentalists={selectedInstrumentalist}
                            page={page}
                            resultsPerPage={selectedResultsPerPage}
                            shouldHaveOrchEnsemb={shouldHaveOrchEnsemb}></SkeletonLoaderCategory>
                    }
                    {
                        isRequestPending == false && result != null &&
                        <>
                            <DisplayResults results={result.results}></DisplayResults>
                            <ScrollIntoView idToScroll="listCategories" dependenciesToWatch={[]}></ScrollIntoView>
                        </>
                    }

                </div>
            </div>

        </div >
    );
}



function SelectableResultsAndPagination(props: {
    setSelectedResultPerPage: React.Dispatch<React.SetStateAction<number>>,
    selectedResultPerPage: number,
    isRequestPending: boolean,
    displayedPages: number[],
    page: number,
    lastPage: number,
    callbackSetPage: (page: number) => void,
    totalNumberOfResults: number,
    nbrInstrumentalists: number,
    filterInstrumentFamilies: IFilterInstrumentFamily[],
    callbackSetFilterInstrumentFamilies: (filter: IFilterInstrumentFamily[]) => void
}) {
    const [toggleFilterCategories, setToggleFilterCategories] = useState(false);

    return (
        <>
            {
                toggleFilterCategories &&
                <FilterCategories
                    nbrInstrumentalists={props.nbrInstrumentalists}
                    filterInstrumentFamilies={props.filterInstrumentFamilies}
                    setToggleOwn={setToggleFilterCategories}
                    callbackSetFilterInstrumentFamilies={props.callbackSetFilterInstrumentFamilies}></FilterCategories>
            }
            <div className="bg-white shadow-md sm:shadow-none flex flex-col">
                {
                    props.isRequestPending &&
                    <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-white bg-opacity-80 z-20">
                        <Spinner message=""></Spinner>
                    </div>
                }
                <div className="order-1 sm:order-2">
                    <div className=" flex justify-evenly px-2 pt-0 pb-1 sm:pt-0 sm:flex-col">
                        <div className="text-xs font-light sm:text-lg ">
                            <div className="sm:hidden">
                                <p>Résultats</p>
                                <p>par page</p>
                            </div>

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
                    <h3 className="font-black text-center uppercase sm:mt-3">{props.totalNumberOfResults} catégories(s) trouvée(s)</h3>
                </div>
                <div className="order-2 sm:order-1 sm:pr-1">
                    {
                        props.nbrInstrumentalists > 1 &&
                        <button className="w-full bg-black py-2 sm:rounded-md" onClick={() => setToggleFilterCategories(true)}>
                            <h3 className="text-white text-sm font-light uppercase">Filtrer la recherche <i className="fa-solid fa-sliders"></i></h3>
                        </button>
                    }
                </div>
            </div>
        </>
    );
}

function additionateCountFilter(array: number[]) {
    let count = 0;
    array.forEach(c => count += c);
    return count;
}

function FilterCategories(props: {
    setToggleOwn: React.Dispatch<React.SetStateAction<boolean>>,
    filterInstrumentFamilies: IFilterInstrumentFamily[],
    nbrInstrumentalists: number,
    callbackSetFilterInstrumentFamilies: (filter: IFilterInstrumentFamily[]) => void
}) {
    const instrumentFamiliesContainer = useRef<HTMLDivElement | null>(null);
    const [filterCopy, setFiltercopy] = useState([...props.filterInstrumentFamilies]);
    const [countLeft, setCountLeft] = useState(props.nbrInstrumentalists - additionateCountFilter(filterCopy.map(f => parseInt(f.count))));
    useEffect(() => {
        document.body.style.overflowY = "hidden";
        setTimeout(() => {
            window.addEventListener("click", clickOnWindowWhenContainerIsUp);
        });

        //sert juste à jouer l'animation d'apparition
        setTimeout(() => {
            if (instrumentFamiliesContainer.current == null) {
                props.setToggleOwn(false);
                return;
            }
            instrumentFamiliesContainer.current.style.opacity = "1";
            instrumentFamiliesContainer.current.style.transform = "translateY(0)";
        }, 5);

        return () => {
            document.body.style.overflowY = "";
            window.removeEventListener("click", clickOnWindowWhenContainerIsUp);
        }
    }, []);

    const resetfilter = () => {
        setFiltercopy(setStateFilterInstrumentFamilies());
        setCountLeft(props.nbrInstrumentalists);
    }

    const onClickButtonCount = (index: number, increment: boolean) => {
        let copy = [...filterCopy];
        let valueParsed: number = parseInt(copy[index].count);
        if (isNaN(valueParsed)) {
            copy[index].count = "0";

        } else {
            if (increment) {
                valueParsed++;
                copy[index].count = valueParsed.toString();
            } else {
                valueParsed--;
                copy[index].count = valueParsed.toString();
            }
        }
        setCountLeft(prev => increment ? prev - 1 : prev + 1);
        setFiltercopy(copy);
    }

    //sert juste à fermer le pop up lorsqu'on en clique en dehors
    const clickOnWindowWhenContainerIsUp = (e: MouseEvent) => {
        let element: Element = e.target as Element;

        //Si on clique en dehors du formulaire on le ferme
        if (element.closest("#instrumentFamiliesContainer, .toastContainer") == null) {
            props.setToggleOwn(false);
        }
    }
    return (
        <div className="fixed top-0 left-0 w-full h-full py-2 px-3 z-40 bg-black bg-opacity-80">
            <div className="w-full h-full flex justify-center items-center">
                <div id="instrumentFamiliesContainer" ref={instrumentFamiliesContainer} className="max-h-full max-w-lg mx-auto rounded-md bg-white overflow-y-scroll transition duration-300 ease-out opacity-0 translate-y-5">
                    <div className="flex justify-end p-3">
                        <button onClick={() => props.setToggleOwn(false)} className="w-11 h-11 flex justify-center items-center">
                            <i className="text-3xl fa-solid fa-x"></i>
                        </button>
                    </div>
                    <div className="p-2">
                        {
                            countLeft != 0 &&
                            <h3 className="text-center">Vous pouvez préciser encore : <span className="inline-block min-w-[200px] italic">{countLeft} famille(s) d'instruments ({props.nbrInstrumentalists - countLeft}/{props.nbrInstrumentalists})</span></h3>
                        }
                        {
                            countLeft == 0 &&
                            <h3 className="text-center">Vous ne pouvez plus préciser de familles d'instrument. ({props.nbrInstrumentalists}/{props.nbrInstrumentalists})</h3>
                        }
                        <div className="mt-5">
                            {
                                countLeft != props.nbrInstrumentalists &&
                                <h4 className="text-xl">La <b>recherche</b> devra <b>inclure</b> :</h4>
                            }

                            <ul className="list-disc ml-2 pl-2 text-lg">

                                {
                                    filterCopy.findIndex(f => f.count != "0") == -1 &&
                                    <li>Aucune famille d'instrument précisée vous allez récupérer toutes les catégories pour {props.nbrInstrumentalists} instrumentistes.</li>
                                }
                                {
                                    filterCopy.filter(f => f.count != "0").map((f, index) =>
                                        <li key={index}>{f.instrumentFamily} ({f.count})</li>
                                    )
                                }
                            </ul>
                            {
                                <div className="flex justify-center mt-2 gap-1">
                                    <ButtonFilling onClick={() => {
                                        props.setToggleOwn(false);
                                        props.callbackSetFilterInstrumentFamilies([...filterCopy])
                                    }}>
                                        <>Rechercher</>
                                    </ButtonFilling>
                                    <ButtonFilling onClick={() => resetfilter()}>
                                        <>Réinitialiser à 0 <i className="fa-solid fa-rotate"></i></>
                                    </ButtonFilling>
                                </div>
                            }
                        </div>
                    </div>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                    }}>
                        {
                            filterCopy.map((f, index) =>
                                <div key={index} className="flex items-center gap-1 odd:bg-gray-200 even:bg-gray-100 py-2 px-1">
                                    <label htmlFor={f.instrumentFamily} className="uppercase">
                                        {f.instrumentFamily}
                                    </label>
                                    <div className="flex ml-auto">
                                        <button disabled={parseInt(f.count) <= 0} onClick={(e) => {
                                            e.preventDefault();
                                            onClickButtonCount(index, false);
                                        }} className="w-10 h-10 flex justify-center items-center text-3xl">-</button>
                                        {/* <input onBlur={() => onBlurInput(index)} type="number" value={f.count} onChange={(e) => onChangeInput(e.target.value, index)} className="w-9 h-9 text-center rounded-md border border-slate-500 p-1 bg-white" /> */}
                                        <span className="w-9 h-9 text-center rounded-md border border-slate-500 p-1 bg-white">{f.count}</span>
                                        <button disabled={countLeft == 0} onClick={(e) => {
                                            e.preventDefault();
                                            onClickButtonCount(index, true);
                                        }} className="w-10 h-10 flex justify-center items-center text-3xl">+</button>
                                    </div>
                                </div>
                            )
                        }
                    </form>
                </div>
            </div>
        </div>
    )
}

