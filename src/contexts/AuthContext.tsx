// ========================================
// Auth Context — Firebase Authentication
// ========================================
import { createContext, useContext, useState, useEffect } from 'react';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    sendPasswordResetEmail,
    signOut as firebaseSignOut,
    onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import type { UserProfile, SignUpData } from '../types';

interface AuthContextType {
    user: UserProfile | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (data: SignUpData) => Promise<void>;
    signInWithGoogle: () => Promise<void>;
    forgotPassword: (email: string) => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    // Fetch profile from Firestore
                    const docRef = doc(db, 'users', firebaseUser.uid);
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        setUser({ uid: firebaseUser.uid, ...docSnap.data() } as UserProfile);
                    } else {
                        // Create minimal profile if Google Sign-In is used for the first time
                        const newProfile: UserProfile = {
                            uid: firebaseUser.uid,
                            email: firebaseUser.email || '',
                            displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
                            firstName: firebaseUser.displayName?.split(' ')[0] || '',
                            lastName: firebaseUser.displayName?.split(' ')[1] || '',
                            company: '',
                            city: '',
                            state: '',
                            zipcode: '',
                            venueType: 'bar',
                            employeeRange: '1-10',
                            auditState: '',
                            role: 'admin',
                            venueId: `venue-${firebaseUser.uid}`,
                            createdAt: new Date().toISOString() as any,
                            subscriptionTier: 'free',
                            trialEndsAt: new Date(Date.now() + 3 * 86400000).toISOString(),
                        };
                        await setDoc(docRef, newProfile);
                        setUser(newProfile);
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                    setUser(null);
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signIn = async (email: string, password: string) => {
        await signInWithEmailAndPassword(auth, email, password);
    };

    const signUp = async (data: SignUpData) => {
        const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
        const uid = userCredential.user.uid;

        const venueId = `venue-${uid}`;

        const profile: UserProfile = {
            uid,
            email: data.email,
            displayName: `${data.firstName} ${data.lastName}`,
            firstName: data.firstName,
            lastName: data.lastName,
            company: data.company,
            city: data.city,
            state: data.state,
            zipcode: data.zipcode,
            venueType: data.venueType,
            employeeRange: data.employeeRange,
            auditState: data.state, // We store state directly as requested in last iteration
            role: 'admin',
            venueId,
            createdAt: new Date().toISOString() as any,
            subscriptionTier: 'free',
            trialEndsAt: new Date(Date.now() + 3 * 86400000).toISOString(),
        };

        // Save new user profile to Firestore
        await setDoc(doc(db, 'users', uid), profile);
    };

    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
    };

    const forgotPassword = async (email: string) => {
        await sendPasswordResetEmail(auth, email);
    };

    const signOutFn = async () => {
        await firebaseSignOut(auth);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                signIn,
                signUp,
                signInWithGoogle,
                forgotPassword,
                signOut: signOutFn,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
}
