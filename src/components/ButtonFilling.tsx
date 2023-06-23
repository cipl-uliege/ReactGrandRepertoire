export default function ButtonFilling(props: {
    children: JSX.Element,
    onClick?: () => void,
}) {
    return (
        <button onClick={() => {
            if(props.onClick)
                props.onClick();
                
        }} className="p-2 relative overflow-hidden text-center border border-solid border-gold-600 rounded-full group bg-white">
            <div className="absolute w-full h-full z-10 bg-gold-600 scale-x-50 mx-auto top-0 left-0 right-0 opacity-0 group-hover:opacity-100 group-hover:scale-x-100 transition duration-200 ease-out"></div>
            <div className="text-gold-600 group-hover:text-white transition duration-150 ease-out relative z-10">
                {props.children}
            </div>
        </button>
    )
}