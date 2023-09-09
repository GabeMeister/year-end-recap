import Head from "next/head";
import Navbar from "../src/components/Navbar";
import Footer from "@/src/components/Footer";
import Button from "@/src/components/Button";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { twMerge } from "tailwind-merge";

type SignUpButtonProps = {
  children: JSX.Element | string;
  className?: string;
};

function SignUpButton({ children, className = "" }: SignUpButtonProps) {
  const router = useRouter();
  const mergedCss = twMerge("w-48 py-3", className);

  return (
    <Button onClick={() => router.push("/signup")} className={mergedCss}>
      <span className="text-2xl">
        {children}{" "}
        <FontAwesomeIcon className="inline w-3 mb-1 ml-1" icon={faArrowRight} />
      </span>
    </Button>
  );
}

export default function Home() {
  return (
    <>
      <Head>
        <title>Year End Recap | Home</title>
        <link rel="icon" type="image/x-icon" href="/images/favicon.ico" />
      </Head>
      <div>
        <Navbar />
        <main>
          <section className="m-auto max-w-7xl my-32">
            <h1 className="text-7xl block ml-40 text-gray-800">
              Recap the year.
            </h1>
            <h2 className="text-5xl block mt-24 text-right mr-48 text-gray-800">
              ...with <span className="italic text-red-700 ">highly</span>{" "}
              amusing Git stats.
            </h2>
          </section>

          <section className="bg-amber-50">
            <div className="m-auto max-w-7xl">
              <h1>What is the year end recap?</h1>
              <div>Video goes here</div>
            </div>
          </section>

          <section>
            <div className="m-auto max-w-7xl flex">
              <div>The year end recap description</div>
              <div>Abstract calendar artwork</div>
              <SignUpButton>Sign Up Now</SignUpButton>
            </div>
          </section>

          <section className="bg-amber-50">
            <div className="m-auto max-w-7xl flex">
              <h1>What kind of stats?</h1>
              <div>
                <div className="flex">
                  <div>Top Committers</div>
                  <div>Size of codebase</div>
                  <div>Commit Message Analysis</div>
                </div>
                <div className="flex">
                  <div>Most productive Days</div>
                  <div>Branches Merged</div>
                  <div>Team Size</div>
                </div>
              </div>
              <SignUpButton className="w-56">See Your Stats</SignUpButton>
            </div>
          </section>

          <section>
            <div className="m-auto max-w-7xl">
              <h1 id="how-does-it-work">How does it work?</h1>
              <div className="flex">
                <div>1) You are emailed a key.</div>
                <div>Picture of key</div>
              </div>
              <div className="flex">
                <div>Picture of curl command</div>
                <div>2) Run a CLI command</div>
              </div>
              <div className="flex">
                <div>3) Open the generated pdf</div>
                <div>Picture of pdf icon</div>
              </div>
              <div className="flex">
                <div>Picture of people + chart</div>
                <div>4) Present to your team!</div>
              </div>
              <SignUpButton>Sign Me Up!</SignUpButton>
            </div>
          </section>

          <section className="bg-amber-50">
            <div className="m-auto max-w-7xl">
              <h1>FAQ</h1>
              <div>Is this secure?</div>
              <div>How does this all work?</div>
              <div>Does this cover multiple repos?</div>
              <SignUpButton>Sign Up!</SignUpButton>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}
