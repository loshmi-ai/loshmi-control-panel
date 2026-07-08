import { Link } from "react-router";

export function meta() {
  return [
    { title: "Loshmi Control Panel" },
    {
      name: "description",
      content: "A Workers-native Hono and React Router control panel.",
    },
  ];
}

export default function Landing() {
  return (
    <main className="page hero">
      <section className="hero-copy">
        <p className="eyebrow">Loshmi Control Panel</p>
        <h1>Workers-native control surface for Loshmi.</h1>
        <p className="lede">
          Hono handles the backend, React Router renders the UI, and Vite keeps
          the development loop fast.
        </p>
        <div className="actions">
          <Link className="button button-primary" to="/dashboard">
            Open dashboard
          </Link>
          <a className="button" href="/health">
            Check health
          </a>
        </div>
      </section>
    </main>
  );
}
