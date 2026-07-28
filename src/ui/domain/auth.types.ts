export type AuthState = {
  error: string | null;
  isLoggingIn: boolean;
  isSigningInWithPasskey: boolean;
  isSigningOut: boolean;
  isSigningUp: boolean;
};

export type LoginWithEmailInput = {
  email: string;
  password: string;
  redirectTo: string;
};

export type LoginWithPasskeyInput = {
  redirectTo: string;
};

export type SignupWithEmailInput = {
  email: string;
  name: string;
  password: string;
  redirectTo: string;
};

export type AuthActions = AuthState & {
  clearAuthError: () => void;
  loginWithEmail: (input: LoginWithEmailInput) => Promise<boolean>;
  loginWithPasskey: (input: LoginWithPasskeyInput) => Promise<boolean>;
  signOut: () => Promise<void>;
  signupWithEmail: (input: SignupWithEmailInput) => Promise<boolean>;
  startConditionalPasskeySignIn: (
    input: LoginWithPasskeyInput,
  ) => Promise<boolean>;
};
