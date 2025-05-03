import { Trash } from "lucide-react";
import { FaPen } from "react-icons/fa";
const PostMenu = ({DeleteImage,post_id}) => {
    return (<>
        <div className="absolute top-2  right-5 bg-black py-3 px-2 flex flex-col items-center justify-center gap-2 rounded-xl z-[9999]">
          <ul onClick={()=>DeleteImage(post_id)} className="text-red-700 py-1 px-3 hover:bg-white font-bold text-left cursor-pointer w-full rounded-xl transition-all duration-500 flex items-center justify-between gap-2">Delete <Trash/></ul>
          <ul className="text-white py-1 px-3 hover:bg-white hover:text-black text-left cursor-pointer w-full rounded-xl transition-all duration-500 flex items-center justify-between gap-2">Edit <FaPen/></ul>
        </div>
    </>)
}

export default PostMenu;