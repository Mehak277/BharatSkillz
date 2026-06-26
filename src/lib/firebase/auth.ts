import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  User,
  Auth,
  UserCredential,
  Unsubscribe,
  AuthError,
  GoogleAuthProvider,
  signInWithPopup,
  updatePassword,
} from 'firebase/auth';
import { getFirebaseAuth } from './config';

/**
 * Error codes and user-friendly messages
 */
export const AUTH_ERROR_MESSAGES: Record<string, string> = {
  'auth/email-already-in-use': 'This email is already registered.',
  'auth/weak-password': 'Password should be at least 6 characters long.',
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/user-not-found': 'No account found with this email.',
  'auth/wrong-password': 'Incorrect password.',
  'auth/too-many-requests':
    'Too many failed login attempts. Please try again later.',
  'auth/operation-not-allowed': 'This operation is not allowed.',
  'auth/invalid-credential': 'Invalid email or password.',
};

/**
 * Custom error type for authentication errors
 */
export class FirebaseAuthError extends Error {
  constructor(
    public code: string,
    message: string,
    public originalError?: AuthError
  ) {
    super(message);
    this.name = 'FirebaseAuthError';
  }
}

/**
 * Get user-friendly error message
 */
const getErrorMessage = (error: unknown): string => {
  if (error instanceof FirebaseAuthError) {
    return AUTH_ERROR_MESSAGES[error.code] || error.message;
  }

  const authError = error as AuthError;
  return AUTH_ERROR_MESSAGES[authError.code] || 'An authentication error occurred.';
};

/**
 * Sign up with email and password
 * @param email - User email
 * @param password - User password
 * @returns User credentials
 * @throws FirebaseAuthError with user-friendly message
 */
export const signUp = async (
  email: string,
  password: string
): Promise<User> => {
  try {
    const auth = await getFirebaseAuth();
    const userCredential: UserCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    const authError = error as AuthError;
    const message = getErrorMessage(authError);
    throw new FirebaseAuthError(authError.code, message, authError);
  }
};

/**
 * Sign in with email and password
 * @param email - User email
 * @param password - User password
 * @returns User object
 * @throws FirebaseAuthError with user-friendly message
 */
export const signIn = async (
  email: string,
  password: string
): Promise<User> => {
  try {
    const auth = await getFirebaseAuth();
    const userCredential: UserCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    const authError = error as AuthError;
    const message = getErrorMessage(authError);
    throw new FirebaseAuthError(authError.code, message, authError);
  }
};

/**
 * Sign in with Google
 * @returns User object
 * @throws FirebaseAuthError with user-friendly message
 */
export const signInWithGoogle = async (): Promise<User> => {
  try {
    const auth = await getFirebaseAuth();
    const provider = new GoogleAuthProvider();
    const userCredential: UserCredential = await signInWithPopup(auth, provider);
    return userCredential.user;
  } catch (error) {
    const authError = error as AuthError;
    const message = getErrorMessage(authError);
    throw new FirebaseAuthError(authError.code, message, authError);
  }
};

/**
 * Sign out the current user
 * @throws FirebaseAuthError if sign out fails
 */
export const signOut = async (): Promise<void> => {
  try {
    const auth = await getFirebaseAuth();
    await firebaseSignOut(auth);
  } catch (error) {
    const authError = error as AuthError;
    const message = getErrorMessage(authError);
    throw new FirebaseAuthError(authError.code, message, authError);
  }
};

/**
 * Update the current user's password
 * @param newPassword - New password
 * @throws FirebaseAuthError if password update fails
 */
export const updateUserPassword = async (newPassword: string): Promise<void> => {
  try {
    const auth = await getFirebaseAuth();
    if (!auth.currentUser) throw new Error("No user is currently signed in.");
    await updatePassword(auth.currentUser, newPassword);
  } catch (error) {
    const authError = error as AuthError;
    const message = getErrorMessage(authError);
    throw new FirebaseAuthError(authError.code || 'unknown', message, authError);
  }
};

/**
 * Get the currently authenticated user
 * @returns Current user or null if not authenticated
 */
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const auth = await getFirebaseAuth();
    return auth.currentUser || null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

/**
 * Listen to authentication state changes
 * @param callback - Function to call when auth state changes
 * @returns Unsubscribe function
 */
export const onAuthStateChange = (
  callback: (user: User | null) => void
): Unsubscribe => {
  let auth: Auth | null = null;
  let unsubscribe: Unsubscribe | null = null;

  // Initialize auth asynchronously
  getFirebaseAuth()
    .then((authInstance) => {
      auth = authInstance;
      unsubscribe = firebaseOnAuthStateChanged(auth, callback);
    })
    .catch((error) => {
      console.error('Failed to initialize auth for state change listener:', error);
      // Call callback with null to indicate error state
      callback(null);
    });

  // Return unsubscribe function that handles async initialization
  return () => {
    if (unsubscribe) {
      unsubscribe();
    }
  };
};

/**
 * Type for auth state listener
 */
export type AuthStateListener = (user: User | null) => void;

/**
 * Type for auth service
 */
export interface AuthService {
  signUp: (email: string, password: string) => Promise<User>;
  signIn: (email: string, password: string) => Promise<User>;
  signInWithGoogle: () => Promise<User>;
  signOut: () => Promise<void>;
  getCurrentUser: () => Promise<User | null>;
  onAuthStateChange: (callback: AuthStateListener) => Unsubscribe;
}

// Type exports for convenience
export type { User, AuthError, Unsubscribe };
