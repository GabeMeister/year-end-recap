import { useStats } from "@/src/hooks/endpoints/useStats";
import { FileCount } from "@/src/types/git";

export default function FileCountSlide() {
  const { data, error, isLoading } = useStats<FileCount>({
    part: "fileCount",
  });

  return (
    <div className="FileCountSlide">
      <h1>This is the FileCountSlide component!</h1>
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
