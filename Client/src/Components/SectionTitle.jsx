const SectionTitle = ({ text }) => {
  return (
    <div className="border-b border-base-300 pb-5 w-[90vw] max-w-[1120px] mx-auto">
      <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold tracking-wider capitalize text-teal-950 ">
        {text}
      </h2>
    </div>
  );
};
export default SectionTitle;
