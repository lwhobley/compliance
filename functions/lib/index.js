"use strict";
// ========================================
// Firebase Cloud Functions for ComplianceDaddy
// ========================================
// Deploy: firebase deploy --only functions
//
// This file goes in your Firebase Functions directory
// (functions/src/index.ts)
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripeWebhook = exports.onIncidentCreated = exports.onInspectionCreated = exports.onUserCreated = exports.checkCertExpirations = void 0;
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const stripe_1 = require("stripe");
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2023-10-16', // Add Stripe version appropriately
});
admin.initializeApp();
// ── Certification Expiry Checker ─────────────
// Runs daily at 6:00 AM CST to check for expiring certs
exports.checkCertExpirations = functions.pubsub
    .schedule('0 6 * * *')
    .timeZone('America/Chicago')
    .onRun(async () => {
    const db = admin.firestore();
    const now = Date.now();
    const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
    const thirtyDaysFromNow = admin.firestore.Timestamp.fromDate(new Date(now + thirtyDaysMs));
    // Find certs expiring within 30 days that haven't been notified
    const expiringCerts = await db
        .collectionGroup('certifications')
        .where('expiryDate', '<=', thirtyDaysFromNow)
        .where('notified', '==', false)
        .get();
    console.log(`Found ${expiringCerts.size} expiring certifications`);
    const notifications = expiringCerts.docs.map(async (doc) => {
        const data = doc.data();
        const daysLeft = Math.ceil((data.expiryDate.toDate().getTime() - now) / (24 * 60 * 60 * 1000));
        // Get the user's FCM token
        const userDoc = await db.doc(`users/${data.staffUid}`).get();
        const userData = userDoc.data();
        if (userData === null || userData === void 0 ? void 0 : userData.fcmToken) {
            await admin.messaging().send({
                token: userData.fcmToken,
                notification: {
                    title: '⚠️ Certification Expiring Soon',
                    body: `${data.type} for ${data.staffName} expires in ${daysLeft} days. Renew now to avoid fines.`,
                },
                data: {
                    type: 'cert_expiry',
                    certId: doc.id,
                    daysLeft: String(daysLeft),
                },
            });
        }
        // Also notify the venue admin
        const venueDoc = await db.doc(`venues/${data.venueId}`).get();
        const venueData = venueDoc.data();
        if (venueData === null || venueData === void 0 ? void 0 : venueData.ownerUid) {
            const ownerDoc = await db.doc(`users/${venueData.ownerUid}`).get();
            const ownerData = ownerDoc.data();
            if (ownerData === null || ownerData === void 0 ? void 0 : ownerData.fcmToken) {
                await admin.messaging().send({
                    token: ownerData.fcmToken,
                    notification: {
                        title: '📋 Staff Cert Alert',
                        body: `${data.staffName}'s ${data.type} expires in ${daysLeft} days.`,
                    },
                });
            }
        }
        // Mark as notified
        return doc.ref.update({ notified: true });
    });
    await Promise.all(notifications);
    console.log('Certification check complete');
});
// ── New User Setup ───────────────────────────
// Auto-create user profile when auth account is created
exports.onUserCreated = functions.auth.user().onCreate(async (user) => {
    var _a;
    const db = admin.firestore();
    await db.doc(`users/${user.uid}`).set({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || ((_a = user.email) === null || _a === void 0 ? void 0 : _a.split('@')[0]) || 'User',
        role: 'admin',
        venueId: '',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    console.log(`Profile created for user ${user.uid}`);
});
// ── Inspection Log Created ───────────────────
// Update venue compliance score when a new inspection is logged
exports.onInspectionCreated = functions.firestore
    .document('inspectionLogs/{logId}')
    .onCreate(async (snap) => {
    const data = snap.data();
    const db = admin.firestore();
    // Get all logs for this venue
    const logsSnap = await db
        .collection('inspectionLogs')
        .where('venueId', '==', data.venueId)
        .orderBy('timestamp', 'desc')
        .limit(30) // Last 30 inspections
        .get();
    const logs = logsSnap.docs.map((d) => d.data());
    const avgScore = logs.reduce((sum, l) => sum + (l.score || 0), 0) / logs.length;
    // Update venue stats
    await db.doc(`venues/${data.venueId}`).update({
        complianceScore: Math.round(avgScore),
        lastInspection: data.timestamp,
        totalInspections: admin.firestore.FieldValue.increment(1),
    });
    console.log(`Updated venue ${data.venueId} compliance score to ${Math.round(avgScore)}%`);
});
// ── Incident Pattern Detector (AI-ready) ─────
// Detect recurring incidents at a venue
exports.onIncidentCreated = functions.firestore
    .document('incidents/{incidentId}')
    .onCreate(async (snap) => {
    var _a, _b;
    const data = snap.data();
    const db = admin.firestore();
    // Check for similar incidents in the last 7 days
    const sevenDaysAgo = admin.firestore.Timestamp.fromDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
    const recentIncidents = await db
        .collection('incidents')
        .where('venueId', '==', data.venueId)
        .where('reportedAt', '>=', sevenDaysAgo)
        .get();
    if (recentIncidents.size >= 3) {
        // Flag as recurring issue — notify venue owner
        const venueDoc = await db.doc(`venues/${data.venueId}`).get();
        const ownerUid = (_a = venueDoc.data()) === null || _a === void 0 ? void 0 : _a.ownerUid;
        if (ownerUid) {
            const ownerDoc = await db.doc(`users/${ownerUid}`).get();
            const fcmToken = (_b = ownerDoc.data()) === null || _b === void 0 ? void 0 : _b.fcmToken;
            if (fcmToken) {
                await admin.messaging().send({
                    token: fcmToken,
                    notification: {
                        title: '🚨 Recurring Incident Pattern Detected',
                        body: `${recentIncidents.size} incidents reported at your venue in the past week. Review immediately.`,
                    },
                });
            }
        }
        // Mark venue as high-risk
        await db.doc(`venues/${data.venueId}`).update({
            riskLevel: 'high',
            lastRiskUpdate: admin.firestore.FieldValue.serverTimestamp(),
        });
    }
});
// ── Stripe Webhook (Subscription Upgrades) ───
exports.stripeWebhook = functions.https.onRequest(async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
    let event;
    try {
        if (!sig || !webhookSecret)
            throw new Error('Missing signature or webhook secret');
        event = stripe.webhooks.constructEvent(req.rawBody, sig, webhookSecret);
    }
    catch (err) {
        console.log(`Webhook signature verification failed.`, err.message);
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        // In PaywallPage, we passed user.uid as client_reference_id
        const userId = session.client_reference_id;
        if (userId) {
            const db = admin.firestore();
            // Determine tier from price ID (simplified logic for now)
            const isPro = true; // In production, evaluate session.line_items to see if Pro or Basic
            await db.doc(`users/${userId}`).update({
                subscriptionTier: isPro ? 'pro' : 'basic',
                stripeCustomerId: session.customer,
                subscriptionStatus: 'active'
            });
            console.log(`Successfully upgraded user ${userId} to Pro plan.`);
        }
    }
    res.json({ received: true });
});
//# sourceMappingURL=index.js.map