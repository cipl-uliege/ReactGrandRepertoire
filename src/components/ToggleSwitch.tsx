export default function ToggleSwitch(props:{
    check:boolean,
    setCheck: React.Dispatch<React.SetStateAction<boolean>>,
    disable?:boolean
}) {

    const setIcon = () => {
        if(props.check){
            return <i className="fa-solid fa-check text-gold-600"></i>
        }else{
            return <i className="fa-solid fa-x text-gray-400"></i>
        }
    }
    return (
        <button disabled={props.disable} className="relative w-16 h-8 shrink-0">
            <input disabled={props.disable} className="sr-only peer" type="checkbox" id="shouldContainOrchOrEnsemb" checked={props.check} onChange={() => props.setCheck(prev => !prev)}/>
            <label htmlFor="shouldContainOrchOrEnsemb" 
            className="block h-full cursor-pointer rounded-full bg-gray-400 peer-checked:bg-cu_yellow-100 transition-all"></label>
            <div className="transition-all pointer-events-none absolute w-6 h-6 rounded-full bg-white top-1 left-1 peer-checked:translate-x-[calc(100%+7px)]">
                {setIcon()}
            </div>
        </button>
    );
}