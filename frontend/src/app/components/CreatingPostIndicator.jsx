import { MdCancel, MdOutlineSmsFailed, MdPending } from "react-icons/md";
import { FaCheckDouble } from 'react-icons/fa';
import { useState, useEffect } from 'react';

const PostcreationIndicator = ({ status }) => {
  const [isVisible, setIsVisible] = useState(false);

  // Manage the visibility of the toast based on status
  useEffect(() => {
    if (status !== "idle") {
      setIsVisible(true);
      const timeout = setTimeout(() => {
        setIsVisible(false);
      }, 3000); // Toast disappears after 3 seconds
      return () => clearTimeout(timeout);
    }
  }, [status]); // Trigger when status changes

  return (
    <>
      <div
        className={`fixed top-4 right-4 py-10 px-4 rounded-xl text-white  shadow-lg transition-all duration-300 ease-in-out transform ${
          isVisible ? "opacity-100" : "hidden"
        } bg-black/80`}
      >
        <MdCancel className="absolute top-4 right-4 cursor-pointer" onClick={() => setIsVisible(false)} />
        <div className={`flex items-center space-x-3 justify-center ${
          status === "error"
            ? "text-red-600"
            : status === "done"
            ? "text-green-600"
            : "text-sky-600"
        }`}>
          <span>
            {status === "error" ? (
              <MdOutlineSmsFailed color="red" />
            ) : status === "pending" ? (
              <MdPending color="skyblue"/>
            ) : (
              <FaCheckDouble color="green" />
            )}
          </span>
          <p >
            {status === "error"
              ? "There was some error!"
              : status === "pending"
              ? "Posting please wait..."
              : "Post has been created!"}
          </p>
        </div>
      </div>
    </>
  );
};

export default PostcreationIndicator;
