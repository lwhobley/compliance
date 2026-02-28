import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function SubscriptionGuard({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="p-8 text-center text-muted">Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/auth" />;
    }

    // Default to giving them 3 days if trialEndsAt is somehow missing on an old profile
    const trialEnd = user.trialEndsAt
        ? new Date(user.trialEndsAt).getTime()
        : new Date(user.createdAt).getTime() + (3 * 86400000);

    const isTrialExpired = Date.now() > trialEnd;
    const isFreeTier = user.subscriptionTier === 'free' || !user.subscriptionTier;

    if (isTrialExpired && isFreeTier) {
        return <Navigate to="/paywall" />;
    }

    return <>{children}</>;
}
