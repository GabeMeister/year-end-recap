import Footer from "@/src/components/Footer";
import Navbar from "@/src/components/Navbar";
import Head from "next/head";

type SignUpPageProps = {};

export default function SignUpPage(props: SignUpPageProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>Year End Recap | Sign Up</title>
        <link rel="icon" type="image/x-icon" href="/images/favicon.ico" />
      </Head>
      <Navbar />
      <main className="flex-grow">
        <div className="p-6 max-w-7xl m-auto">This is the Sign Up page</div>
      </main>
      <Footer />
    </div>
  );
}
