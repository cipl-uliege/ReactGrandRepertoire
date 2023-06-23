import { useEffect } from "react";

export default function ScrollIntoView(props:{idToScroll:string, dependenciesToWatch:any[], block?:ScrollLogicalPosition}){
    useEffect(() => {
        document.getElementById(props.idToScroll)?.scrollIntoView({behavior: "smooth", block: props.block ?? "start"})
        
    },props.dependenciesToWatch)
    return(<></>);
}