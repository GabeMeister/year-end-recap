import Navbar from "@/src/components/Navbar";
import Head from "next/head";

type AboutPageProps = {};

export default function AboutPage(props: AboutPageProps) {
  return (
    <>
      <Head>
        <title>Year End Recap | About</title>
        <link rel="icon" type="image/x-icon" href="/images/favicon.ico" />
      </Head>
      <div className="text-xl p-3">
        <Navbar />
        <main>This is the about page</main>
      </div>
    </>
  );
}
