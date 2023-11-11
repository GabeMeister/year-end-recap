import { useAboutRepo } from "@/src/hooks/endpoints/useAboutRepo";
import { useRouter } from "next/router";

export default function AboutSlide() {
  const router = useRouter();
  const { data, isLoading, error } = useAboutRepo({
    id: parseInt((router.query?.project_id as string) ?? "0"),
  });

  return (
    <div className="AboutSlide">
      <h1>About this Repo</h1>
      <div>
        {data && (
          <div>
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
