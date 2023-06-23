import { toast } from "react-toastify";

export class Toast {
    public static warn(msg:string, duration:number = 5000) {
        toast.warn(msg, {
            position: "top-right",
            autoClose: duration,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
            theme: "light",
        });
    }

    public static error(msg:string, duration:number = 5000){
        toast.error(msg, {
            position: "top-right",
            autoClose: duration,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
            theme: "light",
        });
    }

    public static success(msg:string, duration:number = 5000){
        toast.success(msg, {
            position: "top-right",
            autoClose: duration,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
            theme: "light",
        });
    }
}