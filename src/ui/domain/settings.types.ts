import type { Passkey } from "@better-auth/passkey/client";

export type SettingsState = {
  deletingPasskeyId: Passkey["id"] | null;
  error: string | null;
  isAddingPasskey: boolean;
  message: string | null;
  updatingPasskeyId: Passkey["id"] | null;
};

export type SettingsActions = {
  deletingPasskeyId: Passkey["id"] | null;
  error: string | null;
  isAddingPasskey: boolean;
  message: string | null;
  passkeys: ReturnType<
    typeof import("@src/ui/domain/auth").authClient.useListPasskeys
  >;
  updatingPasskeyId: Passkey["id"] | null;
  userPasskeys: Passkey[];
  addPasskey: (name: string) => Promise<boolean>;
  deletePasskey: (id: Passkey["id"]) => Promise<boolean>;
  renamePasskey: (id: Passkey["id"], name: string) => Promise<boolean>;
};
