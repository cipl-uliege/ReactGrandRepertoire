import { NavLink } from "react-router-dom";

export default function NavMobile(props: {
    refNavMobile: React.MutableRefObject<HTMLDivElement | null>,
    toggleNavMobile: () => void,
}) {
    return (
        <div role="navigation" id="navMobile" aria-hidden="true" ref={props.refNavMobile} className="md:aria-[hidden=false]:hidden p-2 fixed z-50 top-0 left-0 w-full h-full overflow-y-scroll bg-white transition-all -translate-x-full">
            <div className="flex justify-end">
                <button onClick={props.toggleNavMobile} className="flex items-center justify-center w-12 h-12">
                    <i className="fa-solid fa-x text-4xl"></i>
                </button>
            </div>
            <div className="flex justify-center">
                <ul className="text-3xl text-center font-raleway font-black uppercase">
                    <li className="">
                        <NavLink onClick={props.toggleNavMobile} className={"hover:text-gold-600 py-3 block parent"} to={"/"}>Accueil</NavLink>
                    </li>
                    <li className="border-t border-b border-slate-400">
                        <ul>
                            <li className="text-left text-slate-600 normal-case text-xl">Rechercher par...</li>
                            <li className="">
                                <NavLink onClick={props.toggleNavMobile} className={"hover:text-gold-600 py-1 block parent"} to={"/search/category"}>Nb. d'instruments</NavLink>
                            </li>
                            <li className="">
                                <NavLink onClick={props.toggleNavMobile} className={"hover:text-gold-600 py-1 block parent"} to={"/search/author_or_title"}>Auteur ou titre</NavLink>
                            </li>
                            <li className="">
                                <NavLink onClick={props.toggleNavMobile} className={"hover:text-gold-600 py-1 block parent"} to={"/search/teaching_or_literature"}>Enseignement ou littérature</NavLink>
                            </li>
                        </ul>
                    </li>
                    <li className="px-2">
                        <NavLink onClick={props.toggleNavMobile} className={"hover:text-gold-600 py-3 block parent"} to={"/favorites"}>Mes favoris</NavLink>
                    </li>
                </ul>
            </div>
        </div>
    )
}