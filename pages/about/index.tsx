import Footer from "@/src/components/Footer";
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
      <main>
        <Navbar />
        <div>This is the About page</div>
        <Footer />
      </main>
    </>
  );
}
