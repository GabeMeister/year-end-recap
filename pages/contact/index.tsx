import Footer from "@/src/components/Footer";
import Navbar from "@/src/components/Navbar";
import Head from "next/head";

type ContactPageProps = {};

export default function ContactPage(props: ContactPageProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>Year End Recap | Sign Up</title>
        <link rel="icon" type="image/x-icon" href="/images/favicon.ico" />
      </Head>
      <Navbar />
      <main className="flex-grow">
        <div className="p-6 max-w-7xl m-auto">
          <div className="mt-12 flex flex-col items-center">
            <h1 className="text-center text-5xl text-gray-600">
              Send any questions or comments to:
            </h1>
            <div className="mt-12">
              <pre className="text-2xl">yearendrecap@gmail.com</pre>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
