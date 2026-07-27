import type { Passkey } from "@better-auth/passkey/client";
import { atom, useAtom } from "jotai";

import { authClient } from "@src/ui/domain/auth";
import type {
  SettingsActions,
  SettingsState,
} from "@src/ui/domain/settings.types";

const initialSettingsState: SettingsState = {
  deletingPasskeyId: null,
  error: null,
  isAddingPasskey: false,
  message: null,
  updatingPasskeyId: null,
};

export const settingsAtom = atom<SettingsState>(initialSettingsState);

function getAuthErrorMessage(
  result: { error?: { message?: string | null } | null },
  fallback: string,
) {
  return result.error?.message ?? fallback;
}

export function useSettingsActions(): SettingsActions {
  const passkeys = authClient.useListPasskeys();
  const [settingsState, setSettingsState] = useAtom(settingsAtom);

  async function addPasskey(name: string) {
    setSettingsState((state) => ({
      ...state,
      error: null,
      isAddingPasskey: true,
      message: null,
    }));

    const result = await authClient.passkey.addPasskey({
      name: name.trim() || undefined,
    });

    setSettingsState((state) => ({
      ...state,
      error: result.error
        ? getAuthErrorMessage(result, "Could not add passkey.")
        : null,
      isAddingPasskey: false,
      message: result.error ? null : "Passkey added.",
    }));

    return !result.error;
  }

  async function renamePasskey(id: Passkey["id"], name: string) {
    const nextName = name.trim();

    if (!id || !nextName) {
      setSettingsState((state) => ({
        ...state,
        error: "Passkey name is required.",
        message: null,
      }));
      return false;
    }

    setSettingsState((state) => ({
      ...state,
      error: null,
      message: null,
      updatingPasskeyId: id,
    }));

    const result = await authClient.passkey.updatePasskey({
      id,
      name: nextName,
    });

    setSettingsState((state) => ({
      ...state,
      error: result.error
        ? getAuthErrorMessage(result, "Could not rename passkey.")
        : null,
      message: result.error ? null : "Passkey renamed.",
      updatingPasskeyId: null,
    }));

    return !result.error;
  }

  async function deletePasskey(id: Passkey["id"]) {
    setSettingsState((state) => ({
      ...state,
      deletingPasskeyId: id,
      error: null,
      message: null,
    }));

    const result = await authClient.passkey.deletePasskey({ id });

    setSettingsState((state) => ({
      ...state,
      deletingPasskeyId: null,
      error: result.error
        ? getAuthErrorMessage(result, "Could not delete passkey.")
        : null,
      message: result.error ? null : "Passkey deleted.",
    }));

    return !result.error;
  }

  return {
    deletingPasskeyId: settingsState.deletingPasskeyId,
    error: settingsState.error,
    isAddingPasskey: settingsState.isAddingPasskey,
    message: settingsState.message,
    passkeys,
    updatingPasskeyId: settingsState.updatingPasskeyId,
    userPasskeys: passkeys.data ?? [],
    addPasskey,
    deletePasskey,
    renamePasskey,
  };
}
