import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import ClipboardCopyInput from "@/src/components/ClipboardCopyInput";

export default function MobileWarningPage() {
  return (
    <>
      <Head>
        <title>Year End Recap</title>
        <link rel="icon" type="image/x-icon" href="/images/favicon.ico" />
      </Head>
      <div className="bg-gray-800 text-gray-300 h-screen w-screen flex flex-col justify-center items-center ">
        <Link href="/" className="absolute top-2">
          <div className="flex p-3">
            <Image
              src="/images/logo-full-size-green.png"
              alt="logo"
              width={30}
              height={30}
            />
            <span className="inline-block ml-3 text-3xl text-white">
              Year End Recap
            </span>
          </div>
        </Link>
        <h1 className="text-5xl font-bold text-yellow-300">Wait!</h1>
        <h1 className="text-lg px-6 mt-6 max-w-[400px] text-center">
          The Year End Recap will look{" "}
          <span className="italic underline font-bold">a lot</span> better on a{" "}
          <span className="font-bold">desktop</span> browser. (Trust us!)
        </h1>
        <div className="mt-16 flex flex-col justify-start">
          <span className="text-gray-300">Here&apos;s the url:</span>
          <div className="mt-1 w-64">
            <ClipboardCopyInput text={window.location.href} />
          </div>
        </div>
      </div>
    </>
  );
}
