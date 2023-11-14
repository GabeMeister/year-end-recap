import { useAboutRepo } from "@/src/hooks/endpoints/useAboutRepo";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDatabase } from "@fortawesome/free-solid-svg-icons";
import LoadingSpinner from "../LoadingSpinner";

export default function AboutSlide() {
  const router = useRouter();
  const { data, isLoading, error } = useAboutRepo({
    id: parseInt((router.query?.project_id as string) ?? "0"),
  });

  return (
    <div className="AboutSlide">
      <>
        {data && (
          <div className="flex items-center slide-fade-in">
            <FontAwesomeIcon className="h-16 mr-6" icon={faDatabase} />
            <h1 className="text-5xl">{data.name}</h1>
          </div>
        )}
        {isLoading && (
          <div>
            <LoadingSpinner />
          </div>
        )}
        {error && (
          <div>
            <div>Error happened!</div>
          </div>
        )}
      </>
    </div>
  );
}
