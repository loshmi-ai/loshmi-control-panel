import type { Passkey } from "@better-auth/passkey/client";
import { type FormEvent, useState } from "react";
import { type LoaderFunctionArgs } from "react-router";

import { AppShell } from "@src/ui/components/designSystem/app-shell";
import { Button } from "@src/ui/components/designSystem/button";
import { authClient } from "@src/ui/lib/auth";
import { getUserOrRedirectToLogin } from "@src/ui/lib/route-context.server";
import type { SettingsLoaderData } from "@src/ui/routes/settings.types";

export function meta() {
  return [{ title: "Settings | Loshmi Control Panel" }];
}

export async function loader(
  args: LoaderFunctionArgs,
): Promise<SettingsLoaderData> {
  const user = getUserOrRedirectToLogin(args);

  return {
    user,
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
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleSignOut() {
    setIsSigningOut(true);
    await authClient.signOut();
    window.location.assign("/login");
  }

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
    <AppShell
      actions={[
        { label: "Home", to: "/" },
        { label: "Dashboard", to: "/dashboard" },
      ]}
      isSigningOut={isSigningOut}
      navItems={[{ label: "Dashboard", shortLabel: "D", to: "/dashboard" }]}
      title="Settings"
      userEmail={loaderData.user.email}
      userName={loaderData.user.name}
      onSignOut={handleSignOut}
    >
      <section className="rounded-[28px] border border-slate-200 bg-white p-7">
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
          <Button className="self-end" disabled={isAddingPasskey} type="submit">
            {isAddingPasskey ? "Adding..." : "Add passkey"}
          </Button>
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
                    <Button
                      disabled={deletingPasskeyId === passkey.id}
                      variant="danger"
                      onClick={() => void handleDeletePasskey(passkey.id)}
                    >
                      {deletingPasskeyId === passkey.id
                        ? "Deleting..."
                        : "Delete"}
                    </Button>
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
                    <Button
                      className="self-end"
                      disabled={updatingPasskeyId === passkey.id}
                      type="submit"
                      variant="secondary"
                    >
                      {updatingPasskeyId === passkey.id ? "Saving..." : "Save"}
                    </Button>
                  </form>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </AppShell>
  );
}
