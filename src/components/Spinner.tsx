export default function Spinner(props:{message?:string}){
    return(
        <div>
            <div className="flex justify-center">
                <div className="lds-dual-ring"></div>
            </div>
            <h3 className="text-xl text-center">{props.message ?? "Chargement en cours..."}</h3>
        </div>
    );
}