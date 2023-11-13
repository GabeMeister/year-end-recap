import { useStats } from "@/src/hooks/endpoints/useStats";
import { LongestFiles } from "@/src/types/git";

export default function LongestFilesSlide() {
  const { data, error, isLoading } = useStats<LongestFiles>({
    part: "longestFiles",
  });

  return (
    <div className="LongestFilesSlide">
      <h1>This is the LongestFilesSlide component!</h1>
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
