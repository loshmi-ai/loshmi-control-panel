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
    <main className="grid min-h-screen items-center px-7 py-12 sm:p-12">
      <section className="max-w-[720px]">
        <p className="mb-3 text-[0.82rem] font-bold tracking-[0.08em] text-indigo-600 uppercase">
          Loshmi Control Panel
        </p>
        <h1 className="max-w-[760px] text-[2.5rem] leading-[0.98] font-bold sm:text-[clamp(2.25rem,6vw,5rem)]">
          Workers-native control surface for Loshmi.
        </h1>
        <p className="mt-6 max-w-[600px] text-xl leading-relaxed text-slate-600">
          Hono handles the backend, React Router renders the UI, and Vite keeps
          the development loop fast.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            className="inline-flex min-h-[42px] items-center justify-center rounded-lg border border-indigo-600 bg-indigo-600 px-4 font-semibold text-white no-underline"
            to="/dashboard"
          >
            Open dashboard
          </Link>
          <a
            className="inline-flex min-h-[42px] items-center justify-center rounded-lg border border-slate-300 bg-white px-4 font-semibold text-gray-900 no-underline"
            href="/health"
          >
            Check health
          </a>
        </div>
      </section>
    </main>
  );
}
