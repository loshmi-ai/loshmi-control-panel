import type { Passkey } from "@better-auth/passkey/client";
import type { ComponentProps } from "react";

import { Button } from "@src/ui/components/designSystem/button";
import { Input } from "@src/ui/components/designSystem/input";
import { Intent } from "@src/ui/components/designSystem/intents";
import { Variant } from "@src/ui/components/designSystem/variants";

type PasskeyCardProps = {
  deletingPasskeyId: Passkey["id"] | null;
  passkey: Passkey;
  updatingPasskeyId: Passkey["id"] | null;
  onDeletePasskey: (id: Passkey["id"]) => Promise<boolean>;
  onRenamePasskey: (id: Passkey["id"], name: string) => Promise<boolean>;
};

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

export function PasskeyCard({
  deletingPasskeyId,
  passkey,
  updatingPasskeyId,
  onDeletePasskey,
  onRenamePasskey,
}: PasskeyCardProps) {
  const handleRenamePasskey: ComponentProps<"form">["onSubmit"] = async (
    event,
  ) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();

    await onRenamePasskey(passkey.id, name);
  };

  return (
    <article className="rounded-md border border-slate-200 p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-bold">{getPasskeyLabel(passkey)}</h2>
          <p className="mt-1 text-sm">Added {getPasskeyCreatedAt(passkey)}</p>
          <p className="mt-1 text-sm">
            {passkey.deviceType}
            {passkey.backedUp ? " backed up" : ""}
          </p>
        </div>
        <Button
          intent={Intent.Danger}
          loading={deletingPasskeyId === passkey.id}
          variant={Variant.Outline}
          onClick={() => void onDeletePasskey(passkey.id)}
        >
          Delete
        </Button>
      </div>
      <form
        className="mt-4 flex flex-col gap-3 sm:flex-row"
        onSubmit={handleRenamePasskey}
      >
        <Input
          className="min-w-0 flex-1"
          defaultValue={passkey.name ?? ""}
          label="Rename"
          name="name"
          required
          type="text"
        />
        <Button
          className="self-end"
          loading={updatingPasskeyId === passkey.id}
          type="submit"
          variant={Variant.Secondary}
        >
          Save
        </Button>
      </form>
    </article>
  );
}
