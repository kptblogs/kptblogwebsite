import React, { useEffect, useRef, useState } from "react";
import { assets, blogCategories } from "../../assets/assets";
import Quill from "quill";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";

const UpdateBlog = () => {
  const { token, axios } = useAppContext();
  const { id } = useParams(); // blogId from route
  const navigate = useNavigate();

  const editorRef = useRef(null);
  const quillRef = useRef(null);

  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [category, setCategory] = useState("Startup");
  const [isPublished, setIsPublished] = useState(false);

  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  // fetch existing blog by id
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/blog/${id}`);
        if (data.success) {
          const blog = data.blog;
          setTitle(blog.title);
          setSubTitle(blog.subTitle);
          setCategory(blog.category);
          setIsPublished(blog.isPublished);
          setPreviewImage(blog.image);
          if (quillRef.current) {
            quillRef.current.root.innerHTML = blog.description;
          }
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id, axios]);

  // init quill once
  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, { theme: "snow" });
    }
  }, []);

  // 🔐 if no token, kick back to login
  useEffect(() => {
    if (!token) {
      toast.error("Please login to access this page");
      navigate("/admin"); // goes to login since /admin → <Login />
    }
  }, [token, navigate]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const blog = {
        title,
        subTitle,
        description: quillRef.current.root.innerHTML,
        category,
        isPublished,
      };

      const formData = new FormData();
      formData.append("blog", JSON.stringify(blog));
      if (image) {
        formData.append("image", image); // only send new image if chosen
      }

      const { data } = await axios.put(`/api/blog/update/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (data.success) {
        toast.success(data.message);
        navigate("/admin"); // redirect back to blogs list
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex-1 bg-blue-50/50 text-gray-600 h-full overflow-scroll"
    >
      <div className="bg-white w-full max-w-3xl p-4 md:p-10 sm:m-10 shadow rounded">
        <p>Update thumbnail</p>
        <label htmlFor="image">
          <img
            src={
              image
                ? URL.createObjectURL(image)
                : previewImage || assets.upload_area
            }
            alt=""
            className="mt-2 h-16 rounded cursor-pointer"
          />
          <input
            onChange={(e) => setImage(e.target.files[0])}
            type="file"
            id="image"
            hidden
          />
        </label>

        <p className="mt-4">Blog Title</p>
        <input
          type="text"
          placeholder="Type here"
          required
          className="w-full max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />

        <p className="mt-4">Sub Title</p>
        <input
          type="text"
          placeholder="Type here"
          required
          className="w-full max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded"
          onChange={(e) => setSubTitle(e.target.value)}
          value={subTitle}
        />

        <p className="mt-4">Blog Description</p>
        <div className="max-w-lg h-74 pb-16 sm:pb-10 pt-2 relative">
          <div ref={editorRef}></div>
        </div>

        <p className="mt-4">Blog category</p>
        <select
          onChange={(e) => setCategory(e.target.value)}
          name="category"
          value={category}
          className="mt-2 px-3 py-2 border text-gray-500 border-gray-300 outline-none rounded"
        >
          <option value=""> Select Category</option>
          {blogCategories.map((item, index) => (
            <option key={index} value={item}>
              {item}
            </option>
          ))}
        </select>

        <div className="mt-4">
          <p>Publish Now</p>
          <input
            type="checkbox"
            checked={isPublished}
            className="scale-125 cursor-pointer"
            onChange={(e) => setIsPublished(e.target.checked)}
          />
        </div>

        <button
          disabled={updating}
          type="submit"
          className="mt-8 w-40 h-10 bg-primary text-white rounded cursor-pointer text-sm"
        >
          {updating ? "Updating..." : "Update Blog"}
        </button>
      </div>
    </form>
  );
};

export default UpdateBlog;
