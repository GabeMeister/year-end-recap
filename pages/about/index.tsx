import BasicLink from "@/src/components/BasicLink";
import Footer from "@/src/components/Footer";
import Navbar from "@/src/components/Navbar";
import Head from "next/head";

type AboutPageProps = {};

export default function AboutPage(props: AboutPageProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>Year End Recap | About</title>
        <link rel="icon" type="image/x-icon" href="/images/favicon.ico" />
      </Head>
      <Navbar />
      <main className="flex-grow">
        <div className="p-6 max-w-7xl m-auto">
          <div className="mt-12">
            <h1 className="text-center text-5xl">
              Hey! My name is Gabe Jensen.
            </h1>
          </div>
          <div className="flex justify-center">
            <img
              src="/images/gabe-with-sunglasses.png"
              alt="sunglasses-gabe"
              className="w-72 rounded-full shadow-lg mt-12"
            />
          </div>
          <div className="mt-12 mx-0 lg:mx-96">
            <p className="text-center">
              Besides wearing my hat backwards to{" "}
              <span className="italic">try</span> to look cool, I&apos;m a
              software developer working for{" "}
              <BasicLink href="https://www.redballoon.work/">
                RedBalloon.work
              </BasicLink>
              , and I like making developer productivity tools in my free time.
              Feel free to message me on{" "}
              <BasicLink href="https://twitter.com/gabe_jensen">
                Twitter
              </BasicLink>
              , always love chatting with other devs!
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
