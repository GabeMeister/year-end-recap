import { useLinesOfCode } from "@/src/hooks/endpoints/useLinesOfCode";

export default function LinesOfCodeSlide() {
  const { data, error, isLoading } = useLinesOfCode();

  return (
    <div className="LinesOfCodeSlide">
      <h1>This is the LinesOfCodeSlide component!</h1>
      {data && (
        <div className="overflow-hidden w-[600px]">
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
      {isLoading && (
        <div>
          <div>Loading...</div>
        </div>
      )}
      {error && (
        <div>
          <div>Error happened!</div>
        </div>
      )}
    </div>
  );
}
