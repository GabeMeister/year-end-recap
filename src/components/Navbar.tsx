import Image from "next/image";
import Link from "next/link";
import Button from "./Button";

type NavbarProps = {};

export default function Navbar(props: NavbarProps) {
  return (
    <nav className="flex justify-between">
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
        <span>How it works</span>
        <Link href="/about">About</Link>
        <Button>Sign Up</Button>
      </div>
    </nav>
  );
}
