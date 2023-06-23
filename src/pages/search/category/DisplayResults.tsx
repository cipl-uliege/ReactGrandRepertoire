import { useEffect, useRef, useState } from "react";
import { ISelectedCategoryAPI } from "../../../api/interfaces/Category/ISelectedCategoryAPI";
import DisplayCategories from "./DisplayCategories";
import Spinner from "../../../components/Spinner";
import { Get } from "../../../api/Get";
import { IGroupFromCategoryAPI } from "../../../api/interfaces/Group/IGroupFromCategoryAPI";
import { Link } from "react-router-dom";
import ButtonHelperGroup from "../../../components/ButtonHelperGroup";
import { ERROR_MSG_FETCH } from "../../../utils/ErrorMessageFetch";

export default function DisplayResults(props: { results: ISelectedCategoryAPI[] }) {
    const [toggleFetchGroups, setToggleFetchGroups] = useState(false);
    const [categoryId, setCategoryId] = useState(0);

    const getGroupsFromCategory = (id: number) => {
        setToggleFetchGroups(true);
        setCategoryId(id);
    }

    return (
        <>
            {
                toggleFetchGroups &&
                <FetchGroupsFromCategoryId categoryId={categoryId} setToggleOwn={setToggleFetchGroups}></FetchGroupsFromCategoryId>
            }
            {
                // Ex = Bois(1) | Bois(2) + Cuivres(4) | etc...
                props.results.map(r =>
                    <div role="button" key={r.id} onClick={() => getGroupsFromCategory(r.id)} className="block cursor-pointer hover:-translate-y-[2px] transition-all hover:shadow-lg hover:translate-x-[2px]">
                        <div className="px-2 py-3 shadow-md my-2 rounded-md flex">
                            <h3 className="text-xl font-black">
                                <DisplayCategories categories={r.name.split(" / ")}></DisplayCategories>
                                <span className="ml-1 min-w-[120px] inline-block font-light text-sm">(avec {r.countGroup} {r.countGroup > 1 ? "formations" : "formation"})</span>
                            </h3>
                        </div>
                    </div>
                )
            }
        </>
    )
}

function FetchGroupsFromCategoryId(props: {
    setToggleOwn: React.Dispatch<React.SetStateAction<boolean>>,
    categoryId: number
}) {
    const groupsContainerRef = useRef<HTMLDivElement | null>(null);
    const closeButtonRef = useRef<HTMLButtonElement | null>(null);
    const closeButtonBottomRef = useRef<HTMLDivElement | null>(null);
    const [groups, setGroups] = useState<IGroupFromCategoryAPI[] | null>(null);

    useEffect(() => {
        document.body.style.overflowY = "hidden";
        let isDataFetched = false;
        let abortController = new AbortController();
        Get.getGroupsFromCategoryId(props.categoryId, abortController.signal)
            .then((json) => {
                isDataFetched = true;
                setGroups(json);
            })
            .catch(() => {
                if (abortController.signal.aborted) {
                    console.log("fetch aborted");
                } else {
                    window.alert(ERROR_MSG_FETCH);
                }
            });

        if (groupsContainerRef.current) {
            groupsContainerRef.current.addEventListener("scroll", scrollOnContainer);
        }

        setTimeout(() => {
            window.addEventListener("click", clickOnWindowWhenContainerIsUp);
        });

        //sert juste à jouer l'animation d'apparition
        setTimeout(() => {
            if (groupsContainerRef.current == null) {
                window.alert("can't find the container group")
                props.setToggleOwn(false);
                return;
            }
            groupsContainerRef.current.style.opacity = "1";
            groupsContainerRef.current.style.transform = "translateY(0)";
        }, 5);

        return () => {
            if (isDataFetched == false) {
                abortController.abort();
            }
            document.body.style.overflowY = "";
            window.removeEventListener("click", clickOnWindowWhenContainerIsUp);
            groupsContainerRef.current?.removeEventListener("scroll", scrollOnContainer);
        }
    }, [])


    //closeButtonRef n'est accessible que pour mobile
    const scrollOnContainer = () => {
        if (closeButtonRef.current?.getBoundingClientRect().bottom! < 0) {
            closeButtonBottomRef.current!.style.transform = "translateY(0%)";
        } else {
            closeButtonBottomRef.current!.style.transform = "";
        }
    }

    //sert juste à fermer le pop up lorsqu'on en clique en dehors
    const clickOnWindowWhenContainerIsUp = (e: MouseEvent) => {
        let element: Element = e.target as Element;

        //Si on clique en dehors du formulaire on le ferme
        if (element.closest("#groupsContanier, .toastContainer, #closeButtonBottom, #containerAbrevHelper") == null) {
            props.setToggleOwn(false);
        }
    }
    return (
        <div className="fixed top-0 left-0 w-full h-full py-2 px-3 z-40 bg-black bg-opacity-80 flex justify-center items-center">
            <div className="w-full h-full">
                <div id="groupsContanier" ref={groupsContainerRef} className="h-full max-w-lg mx-auto rounded-md bg-white overflow-y-scroll transition duration-300 ease-out opacity-0 translate-y-5">

                    <div className="flex justify-end p-3">
                        <button ref={closeButtonRef} onClick={() => props.setToggleOwn(false)} className="w-11 h-11 flex justify-center items-center">
                            <i className="text-3xl fa-solid fa-x"></i>
                        </button>
                    </div>
                    {
                        groups == null &&
                        <div className="flex justify-center">
                            <Spinner message="Nous récupérons les différentes formations..."></Spinner>
                        </div>
                    }
                    {
                        groups != null &&
                        <div className="pr-3 pl-1 pb-16 md:pb-3">
                            <h3 className="text-xl font-raleway text-center uppercase font-black">{groups.length} résultat(s) trouvé(s)</h3>
                            {
                                groups.map((g, index) =>
                                <div key={index} className="flex items-center gap-1">
                                    <div className="self-end">
                                        <ButtonHelperGroup composition={g.composition}></ButtonHelperGroup>
                                    </div>
                                    <Link to={"/sheetmusic/from_group?id="+g.id} role="button" className="rounded-md block grow cursor-pointer hover:-translate-y-[2px] transition-all shadow-md hover:shadow-xl hover:translate-x-[2px]">
                                        <div className="px-2 py-3 my-2">
                                            <h3 className="text-xl font-black text-blue-800">
                                                {g.composition}
                                                <span className="ml-1 min-w-[120px] inline-block font-light text-sm text-black">(avec {g.countSheetMusic} {g.countSheetMusic > 1 ? "partitions" : "partitions"})</span>
                                            </h3>
                                        </div>
                                    </Link>
                                </div>
                                )
                            }
                        </div>
                    }
                </div>
                <div>
                    <div className="fixed bottom-0 w-full left-0 mb-2 overflow-hidden px-3 md:hidden">
                        <div id="closeButtonBottom" ref={closeButtonBottomRef} className="max-w-lg flex mx-auto justify-center bg-black py-1 border-t-4 border-solid border-t-gray-400 rounded-md transition-all translate-y-full">
                            <button onClick={() => props.setToggleOwn(false)} className="w-11 h-11 bg-white rounded-xl flex justify-center items-center">
                                <i className="text-sm fa-solid fa-x text-gray-500"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}