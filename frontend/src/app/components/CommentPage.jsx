'use client'
import { useSelector, useDispatch } from 'react-redux';
import { useRef } from 'react';
import { IoMdClose } from 'react-icons/io';
import { Add_Comment } from "../../store/postSlice";
import CircularLoader from './CircularLoader';

const CommentPage = ({ toggle, ShowComment, id, token }) => {
  const comment_Ref = useRef();
  const dispatch = useDispatch();
  const comments = useSelector(state => state.posts.comments);

  function handle_Commenting() { 
    if(!comment_Ref.current ||comment_Ref.current.value==="" ) return;
    dispatch(Add_Comment({ post_id: id, comment: comment_Ref.current.value }));
    comment_Ref.current.value==="";
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Blurred semi-transparent backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>
      
      {/* Modal container */}
      <div className="relative w-11/12 md:w-4/5 h-4/5 bg-gradient-to-br from-gray-800 to-black text-white rounded-xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Close icon */}
        <button 
          onClick={toggle} 
          className="absolute top-4 right-4 z-10 hover:scale-110 transition-transform duration-200"
        >
          <IoMdClose size={42} color="red" />
        </button>
        
        {/* Comment List */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {comments ? (
            comments.map((comment, index) => (
              <div key={index} className="border-b border-gray-500 pb-2">
                <p className="text-xs uppercase tracking-wide text-gray-300">
                  {comment.username}
                </p>
                <p className="text-base text-gray-200">
                  {comment.comment_body}
                </p>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center w-full h-full">
              <CircularLoader />
            </div>
          )}
        </div>
        
        {/* Input and submit area */}
        <div className="p-4 bg-black bg-opacity-70">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <textarea
              ref={comment_Ref}
              className="w-full md:w-3/4 p-3 text-black  border border-gray-300 resize-none focus:outline-none focus:ring-2 focus:ring-green-400 rounded-xl"
              placeholder="Add your comment"
              rows={3}
            ></textarea>
            <button
              onClick={handle_Commenting}
              className="w-full md:w-1/4 bg-green-600 hover:bg-green-700 text-black font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
            >
              Comment
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default CommentPage;
