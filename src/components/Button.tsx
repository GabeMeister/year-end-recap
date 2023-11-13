import { twMerge } from "tailwind-merge";

type ButtonProps = {
  children: JSX.Element | string;
  onClick?: () => void;
  className?: string;
  loading?: boolean;
};

export default function Button({
  children,
  onClick,
  className = "",
  loading = false,
}: ButtonProps) {
  const mergedCss = twMerge(
    "Button py-2 px-4 text-white hover:bg-yer-blue-500 bg-yer-blue-400 animate transition-colors rounded-lg w-32 flex items-center justify-center",
    className
  );
  const content = loading ? (
    <img src="/images/loading-spinner.svg" alt="loading-spinner" />
  ) : (
    children
  );

  return (
    <button onClick={onClick} className={mergedCss}>
      {content}
    </button>
  );
}
