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
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import type { UserProfile, SignUpData, VenueType, EmployeeRange } from '../types';

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
        let unsubscribeFromFirestore: (() => void) | null = null;

        const unsubscribeFromAuth = onAuthStateChanged(auth, async (firebaseUser) => {
            // Clean up previous listener
            if (unsubscribeFromFirestore) {
                unsubscribeFromFirestore();
                unsubscribeFromFirestore = null;
            }

            if (firebaseUser) {
                // Listen to profile in real-time
                const docRef = doc(db, 'users', firebaseUser.uid);
                unsubscribeFromFirestore = onSnapshot(docRef, (docSnap) => {
                    if (docSnap.exists()) {
                        setUser({ uid: firebaseUser.uid, ...docSnap.data() } as UserProfile);
                    } else {
                        // Partial user object for redirected completion form
                        // This user has authenticated but has not completed their profile
                        const partialUser: UserProfile = {
                            uid: firebaseUser.uid,
                            email: firebaseUser.email || '',
                            displayName: firebaseUser.displayName || '',
                            firstName: firebaseUser.displayName?.split(' ')[0] || '',
                            lastName: firebaseUser.displayName?.split(' ')[1] || '',
                            company: '', // Missing required field - triggers completion flow
                            city: '',
                            state: '',
                            zipcode: '',
                            venueType: 'bar' as VenueType,
                            employeeRange: '1-10' as EmployeeRange,
                            auditState: '',
                            role: 'admin',
                            venueId: `venue-${firebaseUser.uid}`,
                            subscriptionTier: 'free',
                            createdAt: new Date().toISOString(),
                            trialEndsAt: new Date(Date.now() + 3 * 86400000).toISOString(),
                        };
                        setUser(partialUser);
                    }
                    setLoading(false);
                }, (error) => {
                    console.error("Firestore listener error:", error);
                    setLoading(false);
                });
            } else {
                setUser(null);
                setLoading(false);
            }
        });

        return () => {
            unsubscribeFromAuth();
            if (unsubscribeFromFirestore) unsubscribeFromFirestore();
        };
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
