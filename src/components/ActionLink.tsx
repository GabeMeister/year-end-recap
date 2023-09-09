type ActionLinkProps = {
  onClick: () => void;
  children: JSX.Element | string;
};

export default function ActionLink({ children, onClick }: ActionLinkProps) {
  return (
    <div className="ActionLink" onClick={onClick}>
      {children}
    </div>
  );
}
