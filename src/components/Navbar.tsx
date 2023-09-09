import Image from "next/image";
import Link from "next/link";
import Button from "./Button";
import ActionLink from "./ActionLink";
import { useRouter } from "next/router";
import BasicLink from "./BasicLink";

type NavbarProps = {};

export default function Navbar(props: NavbarProps) {
  const router = useRouter();

  return (
    <nav className="m-auto max-w-7xl py-3 flex justify-between items-center">
      <Link className="cursor-pointer" href="/">
        <div className="flex p-3">
          <Image
            src="/images/logo-full-size.png"
            alt="logo"
            width={30}
            height={30}
          />
          <span className="inline-block ml-3 text-3xl">Year End Recap</span>
        </div>
      </Link>
      <div>
        <BasicLink href="/#how-does-it-work" className="text-lg mr-6">
          How it works
        </BasicLink>
        <BasicLink href="/about" className="text-lg mr-8">
          About
        </BasicLink>
        <Button
          onClick={() => {
            router.push("/signup");
          }}
        >
          Sign Up
        </Button>
      </div>
    </nav>
  );
}
