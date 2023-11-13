import { useStats } from "@/src/hooks/endpoints/useStats";
import { TeamAuthorData } from "@/src/types/git";

export default function NewAuthorsSlide() {
  const { data, isLoading, error } = useStats<TeamAuthorData>({
    part: "newAuthors",
  });

  return (
    <div className="NewAuthorsSlide">
      <h1>New Engineers</h1>
      <div>
        {data && (
          <div className="overflow-y-scroll h-96">
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
    </div>
  );
}
