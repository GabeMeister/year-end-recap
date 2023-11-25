import BasicLink from "@/src/components/BasicLink";
import db from "@/src/db/client";

export default function ProjectsPage({ repos }) {
  return (
    <div className="ProjectsPage p-6 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold inline-block my-6">All Projects</h1>
      <ul>
        {repos.map((r) => (
          <li key={r.id} className="mb-1">
            <BasicLink className="text-blue-500" href={`/presentation/${r.id}`}>
              {r.name}
            </BasicLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

export async function getServerSideProps() {
  const repos = await db
    .selectFrom("repos")
    .select(["id", "name"])
    .orderBy(["name"])
    .execute();

  return {
    props: {
      repos,
    },
  };
}
