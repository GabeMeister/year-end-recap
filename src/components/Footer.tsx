import Image from "next/image";
import BasicLink from "./BasicLink";

type FooterProps = {};

export default function Footer(props: FooterProps) {
  return (
    <footer className="m-auto max-w-7xl">
      <div className="flex justify-between items-center p-16">
        <div>
          <BasicLink href="/">Home</BasicLink>
          <BasicLink className="ml-12" href="/contact">
            Contact
          </BasicLink>
          <BasicLink className="ml-12" href="/about">
            About
          </BasicLink>
          <BasicLink className="ml-12" href="/signup">
            Sign Up
          </BasicLink>
        </div>
        <div className="flex flex-col">
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
    </footer>
  );
}
