import { useEffect, useState } from "react"
import { Get } from "../../../api/Get";
import { Link } from "react-router-dom";
import { ITeachingLiteratureAPI } from "../../../api/interfaces/TeachingLiterature/ITeachingLiteratureAPI";
import { ERROR_MSG_FETCH } from "../../../utils/ErrorMessageFetch";
import Spinner from "../../../components/Spinner";
import ButtonHelperGroup from "../../../components/ButtonHelperGroup";


export default function TeachingLiterature() {
    const [teachingLiteratureCategories, setTeachingLiteratureCategories] = useState<ITeachingLiteratureAPI[] | null>(null);

    useEffect(() => {
        let isDataFetched = false;
        let abortController = new AbortController();
        Get.getAllTeachingLiterature(abortController.signal)
            .then(json => {
                isDataFetched = true;
                console.log(json);

                setTeachingLiteratureCategories(json);
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
    }, []);
    return (
        <div className="max-w-5xl mx-auto px-3">
            <h2 className="font-raleway text-center text-xl uppercase font-black underline underline-offset-4 mt-2">
                Enseignement ou littérature
            </h2>
            {
                teachingLiteratureCategories == null &&
                <Spinner message="Nous récupérons les données concernant l'enseignement ou la littérature..."></Spinner>
            }
            {
                teachingLiteratureCategories != null &&
                <>
                    <div className="mt-5 max-w-sm mx-auto">
                        {
                            teachingLiteratureCategories.map((t, index) =>
                                <div key={index} className="flex items-center gap-1">
                                    <ButtonHelperGroup composition={t.name}></ButtonHelperGroup>
                                    <Link to={"/search/teaching_or_literature/from_group?id="+t.groupId} role="button" className="rounded-md block grow cursor-pointer hover:-translate-y-[2px] transition-all shadow-md hover:shadow-xl hover:translate-x-[2px]">
                                        <div className="px-2 py-3 my-2">
                                            <h3 className="text-xl font-black text-blue-800">
                                                {t.name}
                                                <span className="ml-1 min-w-[120px] inline-block font-light text-sm text-black">(avec {t.countTitle} {t.countTitle > 1 ? "œuvres" : "œuvre"})</span>
                                            </h3>
                                        </div>
                                    </Link>
                                </div>
                            )
                        }
                    </div>
                </>
            }
        </div>
    )
}