import Image from "next/image";

type LoadingSpinnerProps = {
  width?: number;
  height?: number;
};

export default function LoadingSpinner({
  width = 50,
  height = 50,
}: LoadingSpinnerProps) {
  return (
    <div className="LoadingSpinner">
      <Image
        priority
        src="/images/loading-spinner.svg"
        width={width}
        height={height}
        alt="loading-spinner"
      />
    </div>
  );
}
