'use client'
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import { Add_Comment,AddNewCommentIn } from "../../store/postSlice";
import CircularLoader from './CircularLoader';
import { UseStore } from '@/store/store';

const CommentPage = ({ toggle, ShowComment, id }) => {

  const comment_Ref = useRef();
  const dispatch = useDispatch();
  const [newComment, setNewComment] = useState([]);
  const comments = useSelector(state => state.posts.comments);
  const user = useSelector(state => state.auth.user.User[0])

  const { socket } = UseStore();

  useEffect(() => {
    if (!socket.current) return;

    const handleComment =  (data) => {
      dispatch(AddNewCommentIn(data));
    }
    const handleError = (data) => {
      console.log(data)
    }
    socket.current.on("New_comment", handleComment)
    socket.current.on("comment_error", handleError)

    return () => {
      socket.current.off("New_comment", handleComment);
      socket.current.off("comment_error", handleError);
    }
  }, [])

  function handle_Commenting() {
    if (!comment_Ref.current || comment_Ref.current.value === "" || !socket.current) return;
    socket.current.emit("comment", { text: comment_Ref.current.value, user_name: user.username, post_id: id });
    // dispatch(Add_Comment({ post_id: id, comment: comment_Ref.current.value }));
    comment_Ref.current.value = "";
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 ">
      {/* Blurred semi-transparent backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>

      {/* Modal container */}
      <div className="relative w-11/12 md:w-4/5 h-4/5 bg-black  rounded-xl  overflow-y-auto flex flex-col">

        {/* Close icon */}
        <button
          onClick={toggle}
          className="absolute top-2 right-4 z-10 hover:scale-110 transition-transform duration-200"
        >
          <IoMdClose size={22} color="white" />
        </button>

        {/* Comment List */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4  border border-purple-900">
          {comments ? (
            comments.map((comment, index) => (
              <div key={index} className="bg-gray-300 p-2 rounded-xl">
                <p className="text-xs uppercase tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-700 font-bold">
                  {comment.username}
                </p>
                <p className="text-base text-black">
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
              className="w-full md:w-3/4 py-1 px-3 text-purple-800 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded-xl"
              placeholder="Your comment"
            ></textarea>
            <button
              onClick={handle_Commenting}
              className="w-full md:w-1/4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-purple-600 hover:to-sky-600  text-black font-semibold py-3 px-6 rounded-xl transition-colors duration-500"
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
