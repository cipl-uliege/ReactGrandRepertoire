export default function SpinnerPage() {
    return (
        <div className="flex justify-center">
            <div className="text-center">
                <div className="lds-spinner-page"><div></div><div></div><div></div></div>
                <h2 className="font-raleway uppercase text-2xl font-black">Chargement de la page en cours...</h2>
            </div>
        </div>
    )
}