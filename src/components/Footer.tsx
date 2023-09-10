import Image from "next/image";
import BasicLink from "./BasicLink";

type FooterProps = {};

export default function Footer(props: FooterProps) {
  return (
    <footer className="bg-gray-50">
      <div className="m-auto max-w-7xl ">
        <div className="flex flex-col lg:flex-row justify-between p-16">
          <div className="flex flex-col lg:flex-row gap-2 lg:gap-12">
            <BasicLink href="/">Home</BasicLink>
            <BasicLink href="/contact">Contact</BasicLink>
            <BasicLink href="/about">About</BasicLink>
            <BasicLink href="/signup">Sign Up</BasicLink>
          </div>
          <div className="flex flex-col items-center mt-12 lg:mt-0">
            <div className="flex">
              <Image
                src="/images/logo-full-size.png"
                alt="logo"
                width={30}
                height={30}
              />
              <span className="text-2xl inline-block ml-2">Year End Recap</span>
            </div>
            <div className="text-gray-600 mt-1">Copyright 2023</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
