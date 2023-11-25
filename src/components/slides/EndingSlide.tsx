type EndingSlideProps = {
  part: string;
};

export default function EndingSlide({ part }: EndingSlideProps) {
  return (
    <div className="EndingSlide">
      {part === "main" && (
        <div>
          <h1 className="text-7xl slide-fade-in">The End</h1>
        </div>
      )}
    </div>
  );
}
