import { useStats } from "@/src/hooks/endpoints/useStats";
import { LinesOfCode } from "@/src/types/git";

export default function LinesOfCodeSlide() {
  const { data, error, isLoading } = useStats<LinesOfCode>({
    part: "linesOfCode",
  });

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
