type FooterProps = {};

export default function Footer(props: FooterProps) {
  return (
    <footer className="m-auto max-w-7xl">
      <div className="flex">
        <div>
          <a>Home</a>
          <a>Contact</a>
          <a>About</a>
        </div>
        <div className="flex flex-col">
          <span>Year End Recap</span>
          <div>Social Media Icons here</div>
          <div>Copyright 2023 YearEndRecap Inc.</div>
        </div>
      </div>
    </footer>
  );
}
