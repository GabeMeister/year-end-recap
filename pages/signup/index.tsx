import Footer from "@/src/components/Footer";
import Navbar from "@/src/components/Navbar";
import { useForm } from "react-hook-form";
import Head from "next/head";
import TextInput from "@/src/components/TextInput";
import Button from "@/src/components/Button";
import { useState } from "react";
import Api from "@/src/utils/Api";

type SignUpPageProps = {};

export default function SignUpPage(props: SignUpPageProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [isSubmitted, setIsSubmitted] = useState(false);

  async function onFormSubmit(data: any) {
    const signupData = await Api.post(
      "/api/signup",
      {},
      {
        email: data.email,
      }
    );
    console.log("\n\n***** signupData *****\n", signupData, "\n\n");
    setIsSubmitted(true);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>Year End Recap | Sign Up</title>
        <link rel="icon" type="image/x-icon" href="/images/favicon.ico" />
      </Head>
      <Navbar />
      <main className="flex-grow">
        <div className="p-6 max-w-7xl m-auto">
          <div className="mt-12">
            <h1 className="text-5xl text-center">Sign Up</h1>
          </div>
          <div className="p-6 w-full lg:w-[500px] m-auto mt-6 text-center">
            <p className="text-gray-600 italic">
              The Year End Recap script is nearing the final stages of
              development and will be ready before the end of the year. Enter
              your email below to be notified as soon as it&apos;s available to
              use!
            </p>
          </div>
          {isSubmitted ? (
            <div className="mt-6 text-center">
              <h1 className="text-3xl">Thank you!</h1>
              <span className="text-gray-600 italic inline-block mt-2">
                You will be emailed as soon as the script is available.
              </span>
            </div>
          ) : (
            <div className="mt-6 bg-gray-50 border-2 border-gray-100 shadow-xl p-6 md:p-12 w-full md:w-1/2 m-auto rounded-lg">
              <form onSubmit={handleSubmit(onFormSubmit)}>
                <input
                  className="w-full text-xl bg-transparent py-1 px-3 border-b-2 border-yer-green-500 focus:border-yes-green-600 outline-0"
                  id="email"
                  type="text"
                  placeholder="Enter your email"
                  {...register("email", {
                    required: { value: true, message: "Email is required" },
                  })}
                />
                {!!errors["email"] && (
                  <span className="text-red-700">
                    {errors["email"].message?.toString() || ""}
                  </span>
                )}
                <div className="flex justify-center mt-6">
                  <Button className="w-32">Sign Up</Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
