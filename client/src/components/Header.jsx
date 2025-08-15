import React from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import { useRef } from "react";

const Header = () => {
  const { setInput, input } = useAppContext();
  const inputref = useRef();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setInput(inputref.current.value);
  };

  const onClear = () => {
    setInput("");
    inputref.current.value = "";
  };
  return (
    <div className="mx-8 sm:mx-16 xl:mx-24 relative">
      <div className="text-center mt-20 mb-8">
        <div className="inline-flex items-center justify-center gap-4 px-6 py-1.5 mb-4 border border-primary/40 bg-primary/10 rounded-full text-sm text-primary">
          <p> New: AI Featuer Integrated</p>
          <img src={assets.star_icon} className="w-2.5" alt="" />
        </div>
        <h1 className="text-3xl sm:text-6xl font-semibold sm:leading-16 text-gray-700">
          {" "}
          KPT Mangalore <span className="text-primary">Blogging </span> <br />
          Platform.
        </h1>

        <p className="my-6 sm:my-8 max-w-2xl m-auto max-sm:text-xs text-gray-500">
          Your space to share the spirit of KPT Mangalore — from campus events
          and departmental highlights to research, innovation, and creative
          ideas. With 8 vibrant departments, every story here celebrates the
          life and achievements of our diploma college.
          {/* This is your space to capture the pulse of KPT Mangalore — from departmental activities and campus events to research breakthroughs and innovative projects. With 8 dynamic departments, every corner of our diploma college has a story worth telling. Whether it’s a technical achievement, a cultural celebration, or a spark of creativity, share it here for everyone to read, learn, and be inspired. */}
        </p>

        <form
          onSubmit={onSubmitHandler}
          className="flex justify-between max-w-lg max-sm:scale-75 mx-auto border border-gray-300 bg-white rounded overflow-hidden"
        >
          <input
            ref={inputref}
            type="text"
            placeholder="Search for Blogs"
            required
            className="w-full pl-4 outline-none"
          />
          <button
            type="submit"
            className="bg-primary text-white px-8 rounded hover:scale-105 transition-all cursor-pointer py-2 m-1.5"
          >
            Search
          </button>
        </form>
      </div>
      <div className="text-center">
        {input && (
          <button
            onClick={onClear}
            className="border font-light text-xs py-1 px-3 rounded-sm shadow-custom-sm cursor-pointer"
          >
            Clear Search
          </button>
        )}
      </div>

      <img
        src={assets.gradientBackground}
        alt=" "
        className="absolute -top-50 -z-1 opacity-50"
      />
    </div>
  );
};

export default Header;
