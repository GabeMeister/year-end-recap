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
        <FontAwesomeIcon className="inline w-3 ml-1" icon={faArrowRight} />
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
        <section className="m-auto max-w-7xl my-12 md:my-32">
          <h1 className="text-4xl md:text-5xl lg:text-7xl block ml-12 md:ml-24 lg:ml-40 text-gray-800">
            Recap the year,
          </h1>
          <h2 className="text-2xl md:text-3xl lg:text-5xl block mt-6 md:mt-24 text-right mr-6 md:mr-32 lg:mr-42 text-gray-600">
            with <span className="italic text-red-700 ">highly</span> amusing
            Git stats.
          </h2>
          <div className="flex justify-center p-6 mt-12 md:mt-32">
            <img
              src="/images/terminal-lg.png"
              alt="terminal"
              className="rounded-md"
            />
          </div>
          <div className="m-auto text-center mt-12">
            <SignUpButton className="m-auto w-56">Sign Up Now</SignUpButton>
          </div>
        </section>

        <section className="bg-amber-50 p-12 lg:p-16">
          <div className="m-auto max-w-7xl flex flex-col items-center">
            <h1 className="text-3xl lg:text-5xl text-center">
              What is the year end recap?
            </h1>
            <div className="w-full md:w-2/3 lg:w-1/2 mt-12">
              <YouTube
                videoId="Cvq0DUCrOJI"
                opts={{
                  playerVars: {
                    color: "#fff",
                    // controls: 0,
                    disablekb: 1,
                    loop: 1,
                    rel: 0,
                  },
                  width: "100%",
                }}
                className="relative z-[0]"
                iframeClassName="w-full h-48 md:h-80 lg:h-96"
                title="YouTube video player"
              />
            </div>
          </div>
        </section>

        <section className="p-12 lg:p-16">
          <div className="m-auto max-w-7xl">
            <div className="flex flex-col lg:flex-row justify-center items-center w-full">
              <div className="text-xl w-full md:w-1/3">
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
                className="rounded-md mt-12 lg:mt-0 ml-0 lg:ml-24 shadow-lg"
              />
            </div>
            <div className="m-auto text-center mt-24">
              <SignUpButton className="m-auto w-56">Sign Up Now</SignUpButton>
            </div>
          </div>
        </section>

        <section className="bg-amber-50 p-12 lg:p-16">
          <div className="m-auto max-w-7xl">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl">
                What kind of stats do I get?
              </h1>
            </div>
            <div>
              {/* FIRST ROW */}
              <div className="flex flex-col lg:flex-row justify-around items-end px-0 md:px-24 mt-12 gap-12 lg:gap-16">
                <div className="flex flex-col items-center">
                  <img
                    src="/images/git-commit.png"
                    alt="track-lanes"
                    className="rounded-md shadow-lg w-full sm:w-3/4 lg:w-[300px]"
                  />
                  <span className="inline-block mt-2 font-bold text-xl">
                    Top Committers
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <img
                    src="/images/file-directory.png"
                    alt="track-lanes"
                    className="rounded-md shadow-lg w-full sm:w-3/4 lg:w-[300px]"
                  />
                  <span className="inline-block mt-2 font-bold text-xl">
                    Size of codebase
                  </span>
                </div>

                <div className="flex flex-col items-center">
                  <img
                    src="/images/team-size.png"
                    alt="track-lanes"
                    className="rounded-md shadow-lg w-full sm:w-3/4 lg:w-[300px]"
                  />
                  <span className="inline-block mt-2 font-bold text-xl">
                    Team Growth Over Time
                  </span>
                </div>
              </div>

              {/* SECOND ROW */}
              <div className="flex flex-col lg:flex-row justify-around items-end px-0 md:px-24 mt-12 gap-12 lg:gap-16">
                <div className="flex flex-col items-center">
                  <img
                    src="/images/git-bubbles.png"
                    alt="track-lanes"
                    className="rounded-md shadow-lg w-full sm:w-3/4 lg:w-[300px]"
                  />
                  <span className="inline-block mt-2 font-bold text-xl">
                    Branches Merged
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <img
                    src="/images/days-chart.png"
                    alt="track-lanes"
                    className="rounded-md shadow-lg w-full sm:w-3/4 lg:w-[300px]"
                  />
                  <span className="inline-block mt-2 font-bold text-xl">
                    Most Productive Days
                  </span>
                </div>

                <div className="flex flex-col items-center">
                  <img
                    src="/images/word-cloud.png"
                    alt="track-lanes"
                    className="rounded-md shadow-lg w-full sm:w-3/4 lg:w-[300px]"
                  />
                  <span className="inline-block mt-2 font-bold text-xl">
                    Commit Message Analysis
                  </span>
                </div>
              </div>
            </div>
            <div className="text-center mt-16 flex justify-center">
              <SignUpButton className="w-[270px]">See Your Stats</SignUpButton>
            </div>
          </div>
        </section>

        <section className="p-12 lg:p-16">
          <div className="m-auto max-w-7xl">
            <div className="text-center mb-16">
              <h1 id="how-does-it-work" className="text-4xl md:text-5xl">
                How does it work?
              </h1>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 mt-16 px-0 lg:px-48 justify-around items-start lg:items-center">
              <div className="flex flex-col">
                <h3 className="text-3xl font-bold">Step 1:</h3>
                <span className="text-xl text-gray-600">
                  Open your repo on a terminal
                </span>
              </div>
              <img
                src="/images/cd-my-repo.png"
                alt="track-lanes"
                className="rounded-md shadow-lg w-full lg:w-80"
              />
            </div>

            <div className="flex flex-col-reverse lg:flex-row gap-6 mt-16 px-0 lg:px-48 justify-around items-start lg:items-center">
              <img
                src="/images/curl.png"
                alt="track-lanes"
                className="rounded-md shadow-lg w-full lg:w-96"
              />
              <div className="flex flex-col">
                <h3 className="text-3xl font-bold">Step 2:</h3>
                <span className="text-xl text-gray-600">
                  Curl and run the script
                </span>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 mt-16 px-0 lg:px-48 justify-around items-start lg:items-center">
              <div className="flex flex-col">
                <h3 className="text-3xl font-bold">Step 3:</h3>
                <span className="text-xl text-gray-600">
                  Open the generated pdf
                </span>
              </div>
              <img
                src="/images/pdf-icon.png"
                alt="track-lanes"
                className="rounded-md shadow-lg w-1/2 lg:w-64 m-auto lg:m-0"
              />
            </div>

            <div className="flex flex-col-reverse lg:flex-row gap-6 mt-16 px-0 lg:px-48 justify-around items-start lg:items-center">
              <img
                src="/images/present-to-team.png"
                alt="track-lanes"
                className="rounded-md shadow-lg w-full lg:w-80 border-2 border-black"
              />
              <div className="flex flex-col">
                <h3 className="text-3xl font-bold">Step 4:</h3>
                <span className="text-xl text-gray-600">
                  Present to your team!
                </span>
              </div>
            </div>

            <div className="text-center mt-16 flex justify-center">
              <SignUpButton className="w-[230px]">Try It Out</SignUpButton>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
