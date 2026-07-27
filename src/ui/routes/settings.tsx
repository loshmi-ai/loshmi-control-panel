import { type LoaderFunctionArgs } from "react-router";

import { AppShell } from "@src/ui/components/designSystem/app-shell";
import { getUserOrRedirectToLogin } from "@src/ui/domain/auth.server";
import { useSettingsActions } from "@src/ui/domain/settings";
import type { SettingsLoaderData } from "@src/ui/routes/settings.types";
import { AddPasskeyForm } from "@src/ui/routes/settings/components/add-passkey-form";
import { PasskeyCard } from "@src/ui/routes/settings/components/passkey-card";

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

export default function Settings({
  loaderData,
}: {
  loaderData: SettingsLoaderData;
}) {
  const settings = useSettingsActions();

  return (
    <AppShell user={loaderData.user}>
      <p className="mb-3 text-[0.82rem] font-bold tracking-[0.08em] uppercase">
        Settings
      </p>
      <h1 className="text-4xl leading-tight font-bold">Passkeys</h1>
      <p className="mt-4 leading-relaxed">
        Signed in as <strong>{loaderData.user.name}</strong>{" "}
        <span>({loaderData.user.email})</span>.
      </p>

      <AddPasskeyForm
        isAddingPasskey={settings.isAddingPasskey}
        onAddPasskey={settings.addPasskey}
      />

      {settings.error ? <p className="mt-5 text-sm">{settings.error}</p> : null}
      {settings.message ? (
        <p className="mt-5 text-sm">{settings.message}</p>
      ) : null}

      <div className="mt-8">
        {settings.passkeys.isPending ? (
          <p className="text-sm">Loading passkeys...</p>
        ) : settings.userPasskeys.length === 0 ? (
          <p className="text-sm">No passkeys have been added yet.</p>
        ) : (
          <div className="space-y-4">
            {settings.userPasskeys.map((passkey) => (
              <PasskeyCard
                deletingPasskeyId={settings.deletingPasskeyId}
                key={passkey.id}
                passkey={passkey}
                updatingPasskeyId={settings.updatingPasskeyId}
                onDeletePasskey={settings.deletePasskey}
                onRenamePasskey={settings.renamePasskey}
              />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
