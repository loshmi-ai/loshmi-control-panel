import type { Passkey } from "@better-auth/passkey/client";
import { type FormEvent, useState } from "react";
import { Link, type LoaderFunctionArgs } from "react-router";

import { requireAuthSession } from "@src/api/lib/auth";
import { rrContext } from "@src/api/lib/rr-context";
import { authClient } from "@src/ui/lib/auth";

export function meta() {
  return [{ title: "Settings | Loshmi Control Panel" }];
}

type SettingsLoaderData = {
  user: {
    name: string;
    email: string;
  };
};

export async function loader({
  context,
  request,
}: LoaderFunctionArgs): Promise<SettingsLoaderData> {
  const rrContextValue = context.get(rrContext);
  const session = requireAuthSession(rrContextValue.authSession, request);

  return {
    user: {
      name: session.user.name,
      email: session.user.email,
    },
  };
}

function getPasskeyLabel(passkey: Passkey) {
  return passkey.name || "Passkey";
}

function getPasskeyCreatedAt(passkey: Passkey) {
  if (!passkey.createdAt) {
    return "Unknown creation date";
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(passkey.createdAt));
}

export default function Settings({
  loaderData,
}: {
  loaderData: SettingsLoaderData;
}) {
  const passkeys = authClient.useListPasskeys();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isAddingPasskey, setIsAddingPasskey] = useState(false);
  const [updatingPasskeyId, setUpdatingPasskeyId] = useState<string | null>(
    null,
  );
  const [deletingPasskeyId, setDeletingPasskeyId] = useState<string | null>(
    null,
  );

  async function handleAddPasskey(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setError(null);
    setMessage(null);
    setIsAddingPasskey(true);

    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "").trim();

    const result = await authClient.passkey.addPasskey({
      name: name || undefined,
    });

    setIsAddingPasskey(false);

    if (result.error) {
      setError(result.error.message ?? "Could not add passkey.");
      return;
    }

    form.reset();
    setMessage("Passkey added.");
  }

  async function handleRenamePasskey(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);

    const formData = new FormData(event.currentTarget);
    const id = String(formData.get("id") ?? "");
    const name = String(formData.get("name") ?? "").trim();

    if (!id || !name) {
      setError("Passkey name is required.");
      return;
    }

    setUpdatingPasskeyId(id);

    const result = await authClient.passkey.updatePasskey({
      id,
      name,
    });

    setUpdatingPasskeyId(null);

    if (result.error) {
      setError(result.error.message ?? "Could not rename passkey.");
      return;
    }

    setMessage("Passkey renamed.");
  }

  async function handleDeletePasskey(id: string) {
    setError(null);
    setMessage(null);
    setDeletingPasskeyId(id);

    const result = await authClient.passkey.deletePasskey({ id });

    setDeletingPasskeyId(null);

    if (result.error) {
      setError(result.error.message ?? "Could not delete passkey.");
      return;
    }

    setMessage("Passkey deleted.");
  }

  const userPasskeys = passkeys.data ?? [];

  return (
    <main className="min-h-screen max-w-[840px] px-7 py-12 sm:p-12">
      <nav className="mb-8 flex flex-wrap items-center gap-4">
        <Link className="text-gray-900" to="/dashboard">
          Dashboard
        </Link>
        <Link className="text-gray-900" to="/">
          Home
        </Link>
      </nav>

      <section className="rounded-lg border border-slate-200 bg-white p-7">
        <p className="mb-3 text-[0.82rem] font-bold tracking-[0.08em] text-indigo-600 uppercase">
          Settings
        </p>
        <h1 className="text-4xl leading-tight font-bold">Passkeys</h1>
        <p className="mt-4 leading-relaxed text-slate-600">
          Signed in as <strong>{loaderData.user.name}</strong>{" "}
          <span className="text-slate-500">({loaderData.user.email})</span>.
        </p>

        <form
          className="mt-7 flex flex-col gap-3 sm:flex-row"
          onSubmit={handleAddPasskey}
        >
          <label className="min-w-0 flex-1">
            <span className="text-sm font-semibold text-slate-700">
              New passkey name
            </span>
            <input
              autoComplete="off"
              className="mt-2 min-h-11 w-full rounded-md border border-slate-300 px-3 text-base"
              name="name"
              placeholder="MacBook Touch ID"
              type="text"
            />
          </label>
          <button
            className="inline-flex min-h-11 cursor-pointer items-center justify-center self-end rounded-md bg-gray-950 px-4 font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-400"
            disabled={isAddingPasskey}
            type="submit"
          >
            {isAddingPasskey ? "Adding..." : "Add passkey"}
          </button>
        </form>

        {error ? <p className="mt-5 text-sm text-red-700">{error}</p> : null}
        {message ? (
          <p className="mt-5 text-sm text-emerald-700">{message}</p>
        ) : null}

        <div className="mt-8">
          {passkeys.isPending ? (
            <p className="text-sm text-slate-600">Loading passkeys...</p>
          ) : userPasskeys.length === 0 ? (
            <p className="text-sm text-slate-600">
              No passkeys have been added yet.
            </p>
          ) : (
            <div className="space-y-4">
              {userPasskeys.map((passkey) => (
                <article
                  className="rounded-md border border-slate-200 p-4"
                  key={passkey.id}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-gray-950">
                        {getPasskeyLabel(passkey)}
                      </h2>
                      <p className="mt-1 text-sm text-slate-600">
                        Added {getPasskeyCreatedAt(passkey)}
                      </p>
                      <p className="mt-1 text-sm text-slate-600">
                        {passkey.deviceType}
                        {passkey.backedUp ? " backed up" : ""}
                      </p>
                    </div>
                    <button
                      className="inline-flex min-h-10 cursor-pointer items-center justify-center rounded-md border border-red-200 bg-white px-3 text-sm font-semibold text-red-700 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
                      disabled={deletingPasskeyId === passkey.id}
                      type="button"
                      onClick={() => void handleDeletePasskey(passkey.id)}
                    >
                      {deletingPasskeyId === passkey.id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </div>
                  <form
                    className="mt-4 flex flex-col gap-3 sm:flex-row"
                    onSubmit={handleRenamePasskey}
                  >
                    <input name="id" type="hidden" value={passkey.id} />
                    <label className="min-w-0 flex-1">
                      <span className="text-sm font-semibold text-slate-700">
                        Rename
                      </span>
                      <input
                        className="mt-2 min-h-10 w-full rounded-md border border-slate-300 px-3 text-base"
                        defaultValue={passkey.name ?? ""}
                        name="name"
                        required
                        type="text"
                      />
                    </label>
                    <button
                      className="inline-flex min-h-10 cursor-pointer items-center justify-center self-end rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-gray-950 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
                      disabled={updatingPasskeyId === passkey.id}
                      type="submit"
                    >
                      {updatingPasskeyId === passkey.id ? "Saving..." : "Save"}
                    </button>
                  </form>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
