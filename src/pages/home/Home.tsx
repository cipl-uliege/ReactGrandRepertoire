import { Link } from "react-router-dom";

export default function Home() {

    return (
        <div className="max-w-5xl mx-auto p-3">
            <h2 className="font-raleway text-2xl text-center uppercase font-black underline underline-offset-4">
                Le grand répertoire de la flûte de Bernard Pierreuse
            </h2>


            <h3 className="text-xl font-light text-center my-3">
                Comment souhaitez vous faire votre recherche ? <i className="fa-solid fa-magnifying-glass"></i>
            </h3>

            <div className="flex flex-col gap-1 justify-center text-lg sm:text-2xl items-center text-center">
                <Link to={"/search/category"} className="block py-2 px-1 relative overflow-hidden group border border-solid border-gold-600 rounded-full text-gold-600 uppercase font-light">
                    <div className="absolute -z-10 w-full h-full left-0 top-0 group-hover:bg-gold-600 transition duration-300 ease-out"></div>
                    <span className="group-hover:text-white">
                        Par nb. d'instruments <i className="fa-solid fa-music"></i>
                    </span>
                </Link>
                <Link to={"/search/author_or_title"} className="block py-2 px-1 relative overflow-hidden group border border-solid border-gold-600 rounded-full text-gold-600 uppercase font-light">
                    <div className="absolute -z-10 w-full h-full left-0 top-0 group-hover:bg-gold-600 transition duration-300 ease-out"></div>
                    <span className="group-hover:text-white">
                        Par auteur ou titre <i className="fa-solid fa-user"></i><i className="fa-solid fa-feather"></i>
                    </span>
                </Link>
                <Link to={"/search/teaching_or_literature"} className="block py-2 px-1 relative overflow-hidden group border border-solid border-gold-600 rounded-full text-gold-600 uppercase font-light">
                    <div className="absolute -z-10 w-full h-full left-0 top-0 group-hover:bg-gold-600 transition duration-300 ease-out"></div>
                    <span className="group-hover:text-white">
                        Par enseignement/littérature <i className="fa-solid fa-book"></i>
                    </span>
                </Link>
            </div>

            <hr className="border-t border-t-gray-300 my-10" />

            <h3 className="text-xl font-light text-center my-3">
                Divers <i className="fa-solid fa-box"></i>
            </h3>
            <div className="flex flex-col justify-center items-center text-lg sm:text-2xl gap-1 text-center">
                <Link to={"/favorites"} className="block py-2 px-1 relative overflow-hidden group border border-solid border-gold-600 rounded-full text-gold-600 uppercase font-light">
                    <div className="absolute -z-10 w-full h-full left-0 top-0 group-hover:bg-gold-600 transition duration-300 ease-out"></div>
                    <span className="group-hover:text-white">
                        Mes favoris <i className="fa-solid fa-star"></i>
                    </span>
                </Link>
            </div>

        </div>
    )
}