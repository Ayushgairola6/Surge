'use client'
import {useSelector,useDispatch} from 'react-redux';
import {useRef} from 'react';
import {IoMdClose} from 'react-icons/io'; 
import {Add_Comment} from "../../store/postSlice"
import LoadingCard from './LoadingCard'
import CircularLoader from './CircularLoader'
const CommentPage =({toggle,ShowComment,id,token})=>{

      const comment_Ref = useRef();
 
    const dispatch = useDispatch();
    const comments = useSelector(state=>state.posts.comments);

 function handle_Commenting() { 
    // const textCmnt = comment_Ref.current.value; 
    dispatch(Add_Comment({ Post_id: id, Comment: comment_Ref.current.value }));
     }




    return <>


{/*main div which contains everything*/}
       <div className="h-full w-full flex items-center justify-center  absolute left-0 top-0 font-mono font-bold bg-opacity-2  ">
       <IoMdClose color="red" onClick={toggle} className="absolute right-4 top-4" size={42}/>
   {/*div to render others comment with input*/}

        <div className={`h-4/5 w-4/5 m-auto  bg-black text-white relative rounded-xl shadow-md shadow-green-500`}>
       {/* div that contains others comment*/}
      {comments? <div className="max-h-[83%] min-h-[83%] overflow-y-scroll hide-scrollbar">
                 {comments.map((comment,index)=>{
                  return <>
                      <div key={index} className=" border-b border-white/30   flex flex-col  items-normal justify-center p-1  ">
                      <ul className="text-left uppercase">{comment.username}</ul>
                      <ul className="text-center">{comment.comment_body}</ul>
                  </div>
                  </>
                 })}
             </div>:<div className="h-full w-full flex items-center justify-center"><CircularLoader /></div>}
        
       {/*input and button*/}
        <div className="  absolute bottom-0 left-0 w-full flex items-center justify-evenly p-2">
            <textarea ref={comment_Ref} className="border border-black w-4/5 text-black texl-lg p-2" type="text" placeholder="Add you comments">
            </textarea>
            <button onClick={handle_Commenting} className="bg-green-600 py-1 px-2 rounded-xl font-bold text-black ">Comment</button> 
        </div>

        </div>
     

       </div>

    </>
}
	


export default CommentPage;