import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="nav">
      <h1>
        <Link to="/">AI Tech Blog</Link>
      </h1>
    </nav>
  );
}
