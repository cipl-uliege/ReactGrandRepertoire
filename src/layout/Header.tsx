import { useRef } from "react"
import NavMobile from "./NavMobile";
import { Link } from "react-router-dom";
import NavDesktop from "./NavDesktop";

export default function Header() {

    const refNavMobile = useRef<HTMLDivElement | null>(null);

    const toggleNavMobile = () => {
        if (refNavMobile.current == null) {
            return;
        }

        let isNavMobileHidden = refNavMobile.current.getAttribute("aria-hidden") == "true" ? true : false;

        if (isNavMobileHidden) {
            refNavMobile.current.setAttribute("aria-hidden", "false");
            refNavMobile.current.style.transform = "translateX(0%)";
        } else {
            refNavMobile.current.setAttribute("aria-hidden", "true");
            refNavMobile.current.style.transform = "";
        }
    }

    return (
        <header className="bg-black shadow-lg">
            <div className="max-w-5xl mx-auto flex items-center px-1 py-3">
                <Link to={"/"}>
                    <div className="w-10 relative">
                        <div className="w-full h-full absolute top-0 left-0 rounded-full border-r-4 border-solid border-r-gold-600 rotate-3"></div>
                        <img src="/assets/images/flute-icon.png" alt="" />
                    </div>
                </Link>
                <h1 className="ml-2 text-white font-raleway font-black text-lg uppercase">
                    Le grand
                    <p className="ml-4">
                        Répertoire de la <span className="font-pacifico text-gold-600 lowercase text-xl">flûte</span>
                    </p>
                </h1>
                <div className="ml-auto">
                    <div className="hidden md:block">
                        <NavDesktop></NavDesktop>
                    </div>
                    <button className="text-white w-12 h-12 text-5xl flex items-center md:hidden" onClick={toggleNavMobile}>
                        <i className="fa-solid fa-bars"></i>
                    </button>
                    <NavMobile toggleNavMobile={toggleNavMobile} refNavMobile={refNavMobile}></NavMobile>
                </div>
            </div>
        </header>
    )
}