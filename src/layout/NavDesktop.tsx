import { NavLink } from "react-router-dom";

export default function NavDesktop(){
    return (
        <nav id="navDesktop">
            {/* className={"hover:text-cu_yellow-100 py-1 block "} */}
            <ul className="flex items-center text-white text-lg">
                <li className="border-r border-r-white px-2">
                    <NavLink className={"hover:text-cu_yellow-100 py-1 block parent"} to={"/"}>Accueil</NavLink>
                </li>
                <li className="border-r border-r-white px-2 relative group hover:text-cu_yellow-100 parent">
                    Chercher par... <i className="fa-solid fa-chevron-down group-hover:rotate-180 transition-all"></i>
                    <ul className="bg-white shadow-md w-56 z-50 border border-gray-500 rounded-md px-2 py-1 absolute top-full left-0 text-black hidden group-hover:block">
                        <li>
                            <NavLink className={"hover:text-gold-600 py-1 block child"} to={"/search/category"}>Nb. d'instruments</NavLink>
                        </li>
                        <li>
                            <NavLink className={"hover:text-gold-600 py-1 block child"} to={"/search/author_or_title"}>Auteur/titre</NavLink>
                        </li>
                        <li>
                            <NavLink className={"hover:text-gold-600 py-1 block child"} to={"/search/teaching_or_literature"}>Enseignement/littérature</NavLink>
                        </li>
                    </ul>
                </li>
                <li className="px-2">
                    <NavLink className={"hover:text-cu_yellow-100 py-1 block parent"} to={"/favorites"}>Mes favoris</NavLink>
                </li>
            </ul>
        </nav>
    )
}