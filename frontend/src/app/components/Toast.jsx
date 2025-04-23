import { IoAlert } from "react-icons/io5";
const Toast = () => {
    return <>
        <div id="toast-default" className="flex items-center w-full max-w-xs p-4   shadow bg-red-200 border-red-500 absolute top-5 right-10  text-red-600 rounded-xl" role="alert">
            <IoAlert color="red" size={25}/>
            <div className="ms-3 text-lg font-bold ">Something went wrong</div>
            {/* <button type="button" className="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" data-dismiss-target="#toast-default" aria-label="Close">
        <span className="sr-only">Close</span>
    </button> */}
        </div>


    </>
}

export default Toast;