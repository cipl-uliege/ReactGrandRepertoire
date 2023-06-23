import { useEffect, useState } from "react"
import { Get } from "../api/Get";
import { IAbreviationAndNameAPI } from "../api/interfaces/Instrument/IAbreviationAndNameAPI";
import Spinner from "./Spinner";
import ScrollIntoView from "./ScrollIntoView";

//Permet de récupérons le nom complet d'une formation
export default function ButtonHelperGroup(props: {
    composition: string
}) {
    const [toggle, setToggle] = useState(false);

    return (
        <div className="relative">
            <button onClick={() => setToggle(!toggle)} className="w-10 h-10 shadow-md border border-solid border-blue-700 rounded-full hover:scale-110 transition-all">
                <i className="fa-solid fa-question"></i>
            </button>

            {
                toggle &&
                <>
                    <FetchAbreviationAndName composition={props.composition} setToggle={setToggle}></FetchAbreviationAndName>
                </>
            }
        </div>
    )
}

function FetchAbreviationAndName(props: { composition: string, setToggle: React.Dispatch<React.SetStateAction<boolean>> }) {
    const [abreviationsAndNames, setAbreviationsAndNames] = useState<IAbreviationAndNameAPI[] | null>(null);
    useEffect(() => {

        setTimeout(() => {
            window.addEventListener("click", clickOnWindowWhenContainerAbrevIsUp);
        });

        let isDataFetched = false;
        let abortController = new AbortController();
        Get.getInstrumentNameFromComposition(props.composition, abortController.signal)
            .then(json => {
                isDataFetched = true;
                setAbreviationsAndNames(json);
            })
            .catch(() => {
                if (abortController.signal.aborted) {
                    console.log("fetch aborted");
                } else {
                    window.alert("Error occured while getting the data, please refresh the page.");
                }
            })

        return () => {
            window.removeEventListener("click", clickOnWindowWhenContainerAbrevIsUp);
            if (isDataFetched == false) {
                abortController.abort();
            }
        }
    }, [])

    const clickOnWindowWhenContainerAbrevIsUp = (e: MouseEvent) => {
        let element: Element = e.target as Element;

        if (element.closest("#containerAbrevHelper, .toastContainer") == null) {
            props.setToggle(false);
        }
    }

    return (
        <div id="containerAbrevHelper" className="absolute w-80 top-full left-0 z-50 rounded-md pointer-events-none">
            <div className="bg-white w-full p-1 border border-slate-600 rounded-md shadow-2xl pointer-events-auto">
                <div className="flex justify-end">
                    <button onClick={() => props.setToggle(false)} className="w-8 h-8 flex justify-center items-center">
                        <i className="fa-solid fa-x text-xl"></i>
                    </button>
                </div>
                {
                    abreviationsAndNames == null &&
                    <Spinner message={"Récupération des noms d'instruments pour " + props.composition}></Spinner>
                }

                {
                    abreviationsAndNames &&
                    <div>
                        <h3>Nom des instruments composants : <p className="text-blue-700 italic">{props.composition}</p></h3>
                        <table className="table-auto w-full border-collapse border border-slate-400">
                            <thead className="bg-gray-200 uppercase text-lg">
                                <tr>
                                    <th className="p-1 font-light border border-slate-400">Abréviation</th>
                                    <th className="p-1 font-light border border-slate-400">Nom complet</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    abreviationsAndNames.map((a, index) =>
                                        <tr key={index} className="odd:bg-white even:bg-gray-100">
                                            <td className="p-1 border border-slate-400 uppercase">{a.abreviation}</td>
                                            <td className="p-1 border border-slate-400">{a.fullName}</td>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </table>
                        <ScrollIntoView idToScroll="containerAbrevHelper" dependenciesToWatch={[]} block="nearest"></ScrollIntoView>
                    </div>
                }
            </div>
            <hr className="mb-20 pointer-events-none" />
        </div>
    )
}