import { useEffect, useRef } from "react";

export default function Accordion(props: { 
    button: JSX.Element, 
    children: JSX.Element, 
    classNameButton?: string,
    classNameChildren?:string,
    includeDefaultChevron?: boolean, 
    toggleAccordion?:any }) {

    const buttonAccordion = useRef<HTMLButtonElement | null>(null);

    const toggleAccordion = (button: HTMLButtonElement) => {
        let nextElement = button.nextElementSibling as HTMLDivElement;
        let chevron!:HTMLElement;

        if(props.includeDefaultChevron != false){
            chevron = button.querySelector("#chevron") as HTMLElement;
        }

        if (button.getAttribute("aria-expanded") == "false") {
            nextElement.style.maxHeight = `${nextElement.scrollHeight}px`;

            if (props.includeDefaultChevron != false) {
                chevron.style.transform = "rotate(180deg)";
            }

            button.setAttribute("aria-expanded", "true");
        }
        else if (button.getAttribute("aria-expanded") == "true") {
            nextElement.style.maxHeight = ``;
            button.setAttribute("aria-expanded", "false");

            if (props.includeDefaultChevron != false) {
                chevron.style.transform = "";
            }
        }
    }

    useEffect(() => {
        if(props.toggleAccordion){
            toggleAccordion(buttonAccordion.current!);
        }
    }, [props.toggleAccordion])

    return (
        <>
            <button ref={buttonAccordion} aria-expanded="false" aria-label="bouton accordéon" onClick={(e) => { toggleAccordion(e.currentTarget) }} className={"w-full flex items-center " + props.classNameButton} >
                {props.button}
                {
                    props.includeDefaultChevron != false &&
                    <i id="chevron" className="transition-all text-lg ml-auto fa-solid fa-chevron-down"></i>
                }
            </button>
            <div className={"transition-all max-h-0 overflow-hidden " + props.classNameChildren}>
                {props.children}
            </div>
        </>
    )
}