import { passkeyClient } from "@better-auth/passkey/client";
import { createAuthClient } from "better-auth/react";
import { atom, useAtom } from "jotai";
import { useCallback, useMemo } from "react";

import { DEFAULT_AUTH_REDIRECT } from "@src/constants";
import type {
  AuthActions,
  AuthState,
  LoginWithEmailInput,
  LoginWithPasskeyInput,
  SignupWithEmailInput,
} from "@src/ui/domain/auth.types";

export const authClient = createAuthClient({
  plugins: [passkeyClient()],
});

const initialAuthState: AuthState = {
  error: null,
  isLoggingIn: false,
  isSigningInWithPasskey: false,
  isSigningOut: false,
  isSigningUp: false,
};

export const authAtom = atom<AuthState>(initialAuthState);

export function safeRedirectTo(value: string | null | undefined) {
  if (typeof value !== "string") {
    return DEFAULT_AUTH_REDIRECT;
  }

  if (!value.startsWith("/") || value.startsWith("//")) {
    return DEFAULT_AUTH_REDIRECT;
  }

  return value;
}

function getAuthErrorMessage(
  result: { error?: { message?: string | null } | null },
  fallback: string,
) {
  return result.error?.message ?? fallback;
}

function getCaughtAuthErrorMessage(caughtError: unknown, fallback: string) {
  return caughtError instanceof Error ? caughtError.message : fallback;
}

async function canUseConditionalPasskeySignIn() {
  if (
    typeof PublicKeyCredential === "undefined" ||
    !PublicKeyCredential.isConditionalMediationAvailable
  ) {
    return false;
  }

  return PublicKeyCredential.isConditionalMediationAvailable();
}

export function useAuthActions(): AuthActions {
  const [authState, setAuthState] = useAtom(authAtom);

  const clearAuthError = useCallback(() => {
    setAuthState((state) => ({
      ...state,
      error: null,
    }));
  }, [setAuthState]);

  const loginWithEmail = useCallback(
    async ({ email, password, redirectTo }: LoginWithEmailInput) => {
      setAuthState((state) => ({
        ...state,
        error: null,
        isLoggingIn: true,
      }));

      try {
        const result = await authClient.signIn.email({
          email,
          password,
          callbackURL: redirectTo,
        });

        setAuthState((state) => ({
          ...state,
          error: result.error
            ? getAuthErrorMessage(result, "Could not log in.")
            : null,
          isLoggingIn: false,
        }));

        if (result.error) {
          return false;
        }

        window.location.assign(redirectTo);
        return true;
      } catch (caughtError) {
        setAuthState((state) => ({
          ...state,
          error: getCaughtAuthErrorMessage(caughtError, "Could not log in."),
          isLoggingIn: false,
        }));
        return false;
      }
    },
    [setAuthState],
  );

  const loginWithPasskey = useCallback(
    async ({ redirectTo }: LoginWithPasskeyInput) => {
      setAuthState((state) => ({
        ...state,
        error: null,
        isSigningInWithPasskey: true,
      }));

      try {
        const result = await authClient.signIn.passkey();

        setAuthState((state) => ({
          ...state,
          error: result.error
            ? getAuthErrorMessage(result, "Could not log in with passkey.")
            : null,
          isSigningInWithPasskey: false,
        }));

        if (result.error) {
          return false;
        }

        window.location.assign(redirectTo);
        return true;
      } catch (caughtError) {
        setAuthState((state) => ({
          ...state,
          error: getCaughtAuthErrorMessage(
            caughtError,
            "Could not log in with passkey.",
          ),
          isSigningInWithPasskey: false,
        }));
        return false;
      }
    },
    [setAuthState],
  );

  const startConditionalPasskeySignIn = useCallback(
    async ({ redirectTo }: LoginWithPasskeyInput) => {
      if (!(await canUseConditionalPasskeySignIn())) {
        return false;
      }

      const result = await authClient.signIn.passkey({ autoFill: true });

      if (result.error) {
        return false;
      }

      window.location.assign(redirectTo);
      return true;
    },
    [],
  );

  const signupWithEmail = useCallback(
    async ({ email, name, password, redirectTo }: SignupWithEmailInput) => {
      setAuthState((state) => ({
        ...state,
        error: null,
        isSigningUp: true,
      }));

      try {
        const result = await authClient.signUp.email({
          name,
          email,
          password,
          callbackURL: redirectTo,
        });

        setAuthState((state) => ({
          ...state,
          error: result.error
            ? getAuthErrorMessage(result, "Could not create your account.")
            : null,
          isSigningUp: false,
        }));

        if (result.error) {
          return false;
        }

        window.location.assign(redirectTo);
        return true;
      } catch (caughtError) {
        setAuthState((state) => ({
          ...state,
          error: getCaughtAuthErrorMessage(
            caughtError,
            "Could not create your account.",
          ),
          isSigningUp: false,
        }));
        return false;
      }
    },
    [setAuthState],
  );

  const signOut = useCallback(async () => {
    setAuthState((state) => ({
      ...state,
      error: null,
      isSigningOut: true,
    }));
    await authClient.signOut();
    window.location.assign("/login");
  }, [setAuthState]);

  return useMemo(
    () => ({
      error: authState.error,
      isLoggingIn: authState.isLoggingIn,
      isSigningInWithPasskey: authState.isSigningInWithPasskey,
      isSigningOut: authState.isSigningOut,
      isSigningUp: authState.isSigningUp,
      clearAuthError,
      loginWithEmail,
      loginWithPasskey,
      signOut,
      signupWithEmail,
      startConditionalPasskeySignIn,
    }),
    [
      authState.error,
      authState.isLoggingIn,
      authState.isSigningInWithPasskey,
      authState.isSigningOut,
      authState.isSigningUp,
      clearAuthError,
      loginWithEmail,
      loginWithPasskey,
      signOut,
      signupWithEmail,
      startConditionalPasskeySignIn,
    ],
  );
}
