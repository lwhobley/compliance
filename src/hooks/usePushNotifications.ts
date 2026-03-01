// ========================================
// Push Notifications Hook
// Manage FCM tokens and browser notifications
// ========================================

import { useState, useEffect, useCallback } from 'react';
import { getMessaging, getToken, onMessage, deleteToken } from 'firebase/messaging';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

interface PushNotificationState {
    permission: NotificationPermission | 'unsupported';
    fcmToken: string | null;
    isSubscribed: boolean;
    isLoading: boolean;
    error: string | null;
}

export function usePushNotifications() {
    const { user } = useAuth();
    const [state, setState] = useState<PushNotificationState>({
        permission: 'default',
        fcmToken: null,
        isSubscribed: false,
        isLoading: false,
        error: null
    });

    // Check initial permission state
    useEffect(() => {
        if (!('Notification' in window)) {
            setState(prev => ({ ...prev, permission: 'unsupported' }));
            return;
        }

        setState(prev => ({ ...prev, permission: Notification.permission }));
    }, []);

    // Request permission and get FCM token
    const requestPermission = useCallback(async (): Promise<boolean> => {
        if (!('Notification' in window)) {
            setState(prev => ({ ...prev, error: 'Notifications not supported in this browser' }));
            return false;
        }

        setState(prev => ({ ...prev, isLoading: true, error: null }));

        try {
            // Request browser permission
            const permission = await Notification.requestPermission();

            if (permission !== 'granted') {
                setState(prev => ({
                    ...prev,
                    permission,
                    isLoading: false,
                    error: 'Notification permission denied'
                }));
                return false;
            }

            // Get FCM token
            const messaging = getMessaging();
            const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;

            const token = await getToken(messaging, {
                vapidKey: vapidKey || undefined
            });

            if (token) {
                // Save token to Firestore
                if (user) {
                    await setDoc(doc(db, 'users', user.uid, 'tokens', 'fcm'), {
                        token,
                        platform: 'web',
                        createdAt: new Date().toISOString(),
                        userAgent: navigator.userAgent
                    });
                }

                setState(prev => ({
                    ...prev,
                    permission: 'granted',
                    fcmToken: token,
                    isSubscribed: true,
                    isLoading: false
                }));

                return true;
            } else {
                setState(prev => ({
                    ...prev,
                    permission: 'granted',
                    isLoading: false,
                    error: 'No registration token available'
                }));
                return false;
            }
        } catch (error) {
            console.error('Error requesting notification permission:', error);
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            }));
            return false;
        }
    }, [user]);

    // Unsubscribe from notifications
    const unsubscribe = useCallback(async (): Promise<boolean> => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));

        try {
            const messaging = getMessaging();
            await deleteToken(messaging);

            // Remove token from Firestore
            if (user && state.fcmToken) {
                await deleteDoc(doc(db, 'users', user.uid, 'tokens', 'fcm'));
            }

            setState(prev => ({
                ...prev,
                fcmToken: null,
                isSubscribed: false,
                isLoading: false
            }));

            return true;
        } catch (error) {
            console.error('Error unsubscribing:', error);
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            }));
            return false;
        }
    }, [user, state.fcmToken]);

    // Listen for foreground messages
    useEffect(() => {
        if (!('Notification' in window) || Notification.permission !== 'granted') {
            return;
        }

        const messaging = getMessaging();

        const unsubscribe = onMessage(messaging, (payload) => {
            console.log('Foreground message received:', payload);

            // Show notification manually when app is in foreground
            if (Notification.permission === 'granted') {
                const notification = new Notification(
                    payload.notification?.title || 'ComplianceDaddy',
                    {
                        body: payload.notification?.body,
                        icon: '/icon-192x192.png',
                        badge: '/icon-72x72.png',
                        tag: payload.data?.type || 'default',
                        data: payload.data
                    }
                );

                notification.onclick = () => {
                    window.focus();
                    notification.close();

                    // Navigate based on type
                    if (payload.data?.type === 'cert_expiry') {
                        window.location.href = '/certifications';
                    } else if (payload.data?.type === 'incident') {
                        window.location.href = '/incidents';
                    }
                };
            }
        });

        return () => unsubscribe();
    }, []);

    return {
        ...state,
        requestPermission,
        unsubscribe,
        isSupported: 'Notification' in window && 'serviceWorker' in navigator
    };
}

export default usePushNotifications;