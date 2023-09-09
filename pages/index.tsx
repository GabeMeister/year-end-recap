import Head from "next/head";
import Navbar from "../src/components/Navbar";
import Footer from "@/src/components/Footer";
import Button from "@/src/components/Button";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { twMerge } from "tailwind-merge";
import YouTube from "react-youtube";
import Image from "next/image";

type SignUpButtonProps = {
  children: JSX.Element | string;
  className?: string;
};

function SignUpButton({ children, className = "" }: SignUpButtonProps) {
  const router = useRouter();
  const mergedCss = twMerge("px-8 py-3", className);

  return (
    <Button onClick={() => router.push("/signup")} className={mergedCss}>
      <div className="text-2xl flex">
        {children}{" "}
        <FontAwesomeIcon className="inline w-3 mb-1 ml-1" icon={faArrowRight} />
      </div>
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
      <Navbar />
      <main>
        <section className="m-auto max-w-7xl my-32">
          <h1 className="text-7xl block ml-40 text-gray-800">
            Recap the year.
          </h1>
          <h2 className="text-5xl block mt-24 text-right mr-48 text-gray-800">
            ...with <span className="italic text-red-700 ">highly</span> amusing
            Git stats.
          </h2>
        </section>

        <section className="bg-amber-50 p-16">
          <div className="m-auto max-w-7xl flex flex-col items-center">
            <h1 className="text-5xl">What is the year end recap?</h1>
            <div className="w-1/2 mt-12">
              <YouTube
                videoId="dWqNgzZwVJQ"
                opts={{
                  playerVars: {
                    color: "#fff",
                    controls: 0,
                    disablekb: 1,
                    loop: 1,
                    playlist: `dWqNgzZwVJQ,dWqNgzZwVJQ,dWqNgzZwVJQ`,
                    rel: 0,
                  },
                  width: "100%",
                }}
                className="relative z-[0]"
                iframeClassName="w-full"
                title="YouTube video player"
              />
            </div>
          </div>
        </section>

        <section className="p-16">
          <div className="m-auto max-w-7xl">
            <div className="flex justify-center items-center w-full">
              <div className="text-xl w-1/3">
                <p>
                  Of all the fun, exciting things that happen in a software
                  company, one of the most memorable is the Year End Recap. At
                  the end of the year, software teams take a step back, and
                  reflect on the progress they made. In one concise presentation
                  they can see stats like who the top committers were. And how
                  many pull requests merged. And even how many lines of code
                  were added.
                  <br />
                  <br />
                  Our goal is to allow every software team the chance to recap
                  their year of work in a hilariously fun, engaging way.
                </p>
              </div>
              <Image
                src="/images/calendar-with-coffee.jpg"
                alt="calendar"
                width={400}
                height={400}
                className="rounded-md ml-24 shadow-lg"
              />
            </div>
            <div className="m-auto text-center mt-24">
              <SignUpButton className="m-auto">Sign Up Now</SignUpButton>
            </div>
          </div>
        </section>

        <section className="bg-amber-50 p-16">
          <div className="m-auto max-w-7xl">
            <div className="text-center mb-16">
              <h1 className="text-5xl">What kind of stats do I get?</h1>
            </div>
            <div>
              <div className="flex justify-around px-24 mt-12">
                <div className="flex flex-col items-center">
                  <Image
                    src="/images/track-lanes.png"
                    width={200}
                    height={200}
                    alt="track-lanes"
                    className="rounded-md shadow-lg"
                  />
                  <span className="inline-block mt-2 font-bold text-xl">
                    Top Committers
                  </span>
                </div>
                <div className="flex flex-col items-center ml-4">
                  <Image
                    src="/images/track-lanes.png"
                    width={200}
                    height={200}
                    alt="track-lanes"
                    className="rounded-md shadow-lg"
                  />
                  <span className="inline-block mt-2 font-bold text-xl">
                    Size of codebase
                  </span>
                </div>
                <div className="flex flex-col items-center ml-4">
                  <Image
                    src="/images/track-lanes.png"
                    width={200}
                    height={200}
                    alt="track-lanes"
                    className="rounded-md shadow-lg"
                  />
                  <span className="inline-block mt-2 font-bold text-xl">
                    Commit Message Analysis
                  </span>
                </div>
              </div>

              <div className="flex justify-around px-24 mt-12">
                <div className="flex flex-col items-center">
                  <Image
                    src="/images/track-lanes.png"
                    width={200}
                    height={200}
                    alt="track-lanes"
                    className="rounded-md shadow-lg"
                  />
                  <span className="inline-block mt-2 font-bold text-xl">
                    Most Productive Days
                  </span>
                </div>
                <div className="flex flex-col items-center ml-4">
                  <Image
                    src="/images/track-lanes.png"
                    width={200}
                    height={200}
                    alt="track-lanes"
                    className="rounded-md shadow-lg"
                  />
                  <span className="inline-block mt-2 font-bold text-xl">
                    Branches Merged
                  </span>
                </div>
                <div className="flex flex-col items-center ml-4">
                  <Image
                    src="/images/track-lanes.png"
                    width={200}
                    height={200}
                    alt="track-lanes"
                    className="rounded-md shadow-lg"
                  />
                  <span className="inline-block mt-2 font-bold text-xl">
                    Team Size
                  </span>
                </div>
              </div>
              <div className="flex">
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
            <div className="text-center mt-16">
              <SignUpButton className="w-[230px]">See Your Stats</SignUpButton>
            </div>
          </div>
        </section>

        <section className="p-16">
          <div className="m-auto max-w-7xl">
            <div className="text-center mb-16">
              <h1 id="how-does-it-work" className="text-5xl">
                How does it work?
              </h1>
            </div>

            <div className="flex mt-16 px-48 justify-around items-center">
              <div className="flex flex-col">
                <h3 className="text-3xl font-bold">Step 1:</h3>
                <span className="text-xl text-gray-600">
                  Open your repo on a terminal.
                </span>
              </div>
              <Image
                src="/images/track-lanes.png"
                width={200}
                height={200}
                alt="track-lanes"
                className="rounded-md shadow-lg"
              />
            </div>

            <div className="flex mt-16 px-48 justify-around items-center">
              <Image
                src="/images/track-lanes.png"
                width={200}
                height={200}
                alt="track-lanes"
                className="rounded-md shadow-lg"
              />
              <div className="flex flex-col">
                <h3 className="text-3xl font-bold">Step 2:</h3>
                <span className="text-xl text-gray-600">Run a command</span>
              </div>
            </div>

            <div className="flex mt-16 px-48 justify-around items-center">
              <div className="flex flex-col">
                <h3 className="text-3xl font-bold">Step 3:</h3>
                <span className="text-xl text-gray-600">
                  Open the generated pdf
                </span>
              </div>
              <Image
                src="/images/track-lanes.png"
                width={200}
                height={200}
                alt="track-lanes"
                className="rounded-md shadow-lg"
              />
            </div>

            <div className="flex mt-12 px-48 justify-around items-center">
              <Image
                src="/images/track-lanes.png"
                width={200}
                height={200}
                alt="track-lanes"
                className="rounded-md shadow-lg"
              />
              <div className="flex flex-col">
                <h3 className="text-3xl font-bold">Step 4:</h3>
                <span className="text-xl text-gray-600">
                  Present to your team!
                </span>
              </div>
            </div>

            <div className="text-center mt-16">
              <SignUpButton>Try it out!</SignUpButton>
            </div>
          </div>
        </section>

        <section className="bg-amber-50 p-16">
          <div className="m-auto max-w-7xl">
            <div className="text-center mb-16">
              <h1 id="how-does-it-work" className="text-5xl">
                FAQ
              </h1>
            </div>
            <div className="m-auto w-2/3">
              <div>Is this secure?</div>
              <div>How does this all work?</div>
              <div>Does this cover multiple repos?</div>
            </div>
            <div className="text-center mt-16">
              <SignUpButton>Sign Up!</SignUpButton>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
