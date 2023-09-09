import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>Year End Recap | Home</title>
        <link rel="icon" type="image/x-icon" href="/images/favicon.ico" />
      </Head>
      <div className="text-xl p-3">
        <div>Nav Bar</div>
        <div>
          <div>Recap the year with highly amusing Git stats.</div>
          <div>Sign Up Button</div>
          <div>
            <h1>What is the year end recap?</h1>
            <div>Video goes here</div>
          </div>
          <div className="flex">
            <div>The year end recap description</div>
            <div>Abstract calendar artwork</div>
          </div>
          <div>Sign up button</div>
          <div>
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
          </div>
          <div>See your stats</div>
        </div>
        <div>
          <h1>How does it work?</h1>
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
        </div>
        <div>Sign Me Up! button</div>
        <div>
          <h1>FAQ</h1>
          <div>Is this secure?</div>
          <div>How does this all work?</div>
          <div>Does this cover multiple repos?</div>
        </div>
        <footer>
          <div className="flex">
            <div>
              <a>Home</a>
              <a>Contact</a>
              <a>About</a>
            </div>
            <div className="flex flex-col">
              <span>Year End Recap</span>
              <div>Social Media Icons here</div>
              <div>Copyright 2023 YearEndRecap Inc.</div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
