type ButtonProps = {
  children: JSX.Element | string;
};

export default function Button({ children }: ButtonProps) {
  return <button className="Button">{children}</button>;
}
