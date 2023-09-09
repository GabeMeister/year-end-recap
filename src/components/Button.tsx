import { twMerge } from "tailwind-merge";

type ButtonProps = {
  children: JSX.Element | string;
  onClick: () => void;
  className?: string;
};

export default function Button({
  children,
  onClick,
  className = "",
}: ButtonProps) {
  const mergedCss = twMerge(
    "Button py-2 px-4 text-white hover:bg-blue-700 bg-blue-500 animate transition-colors rounded-lg",
    className
  );

  return (
    <button onClick={onClick} className={mergedCss}>
      {children}
    </button>
  );
}
