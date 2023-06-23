export default function MainMadeBy() {
    return (
        <div className="max-w-md mx-auto p-3">
            <h2 className="text-center font-raleway uppercase text-2xl font-black">Site web réalisé par</h2>
            <h3 className="text-center text-2xl font-pacifico text-gold-600">Cléver Axel</h3>
            <p className="text-center mt-3">
                Lors d'un stage en entreprise à l'Université de Liège se déroulant du 2 mai 2023 au 23 juin 2023.
            </p>
            <p className="text-center mt-3 text-xl">
                Technologies utilisées :
            </p>
            <div className="">
                <ul className="text-lg font-light">
                    <li className="px-1 py-2 flex text-center justify-center border-b border-gray-300">React avec Typescript & Tailwind CSS (Front-end)</li>
                    <li className="px-1 py-2 flex text-center justify-center border-b border-gray-300">ASP.NET Core (Back-end)</li>
                    <li className="px-1 py-2 flex text-center justify-center">Microsoft SQL Server (Base de données)</li>
                </ul>
            </div>
            <div className="flex justify-center max-w-xs mx-auto mt-4">
                <img src="/assets/images/mydog.jpg" alt="" title="Mon chien" className="rounded-xl shadow-md" />
            </div>
        </div>
    )
}