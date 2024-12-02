
import { useState } from "react";
import { BsFillGridFill, BsList } from "react-icons/bs";
import WordsGrid from "./WordsGrid";
import WordsList from './WordsList'
const WordsContainer = () => {
  const [layout, setLayout] = useState("grid");
  const setActiveStyles = (pattern) => {
    return `text-xl btn btn-circle btn-sm ${
      pattern === layout
        ? "btn-info text-zinc-800"
        : "btn-ghost text-zinc-800"
    }`;
  };

  return (
    <>
      {/* HEADER */}
      <div className="flex justify-end items-center mt-8 border-b border-base-300 pb-5 w-[90vw] max-w-[1120px] mx-auto">
        <div className="flex gap-x-2">
          <button
            type="button"
            onClick={() => setLayout("grid")}
            className={setActiveStyles("grid")}
          >
            <BsFillGridFill />
          </button>
          <button
            type="button"
            onClick={() => setLayout("list")}
            className={setActiveStyles("list")}
          >
            <BsList />
          </button>
        </div>
      </div>
      {/* {words} */}
      <div>{layout === "grid" ? <WordsGrid /> : <WordsList />}</div>
    </>
  );
};
export default WordsContainer;
