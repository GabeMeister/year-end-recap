import Link from "next/link";
import { twMerge } from "tailwind-merge";

type BasicLinkProps = {
  href: string;
  children: JSX.Element | string;
  className?: string;
  target?: string;
};

export default function BasicLink({
  href,
  children,
  target,
  className,
}: BasicLinkProps) {
  const mergedCss = twMerge(
    "BasicLink animate transition-colors text-blue-500 hover:text-blue-700",
    className
  );

  return (
    <Link href={href} className={mergedCss} target={target}>
      {children}
    </Link>
  );
}
