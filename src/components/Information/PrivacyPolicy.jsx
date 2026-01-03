"use client";

import React from 'react';
import LegalPage from './LegalPage';

export default function PrivacyPolicy() {
    return (
        <LegalPage title="Privacy Protocol" lastUpdated="January 2026">
            <h2>1. Identity Harvesting</h2>
            <p>
                We collect personal information such as your name, contact details, and shipping address solely to facilitate the delivery of Vanguard masterpieces. Your digital identity is protected by end-to-end encryption during transit.
            </p>

            <h2>2. Data Utilization</h2>
            <p>
                Your data is used to optimize the "Vanguard OS" experience, process transactions, and provide personalized customer assistance. We do not sell or trade your personal signatures to third-party entities.
            </p>

            <h2>3. Security Matrix</h2>
            <p>
                All financial transactions are processed via secure cryptographic gateways. We do not store raw credit card data on our local servers.
            </p>

            <h2>4. Neural Cookies</h2>
            <p>
                Our platform uses cookies to maintain session persistence and analyze traffic patterns. You may calibrate your browser to reject these fragments, though some interface functionalities may be compromised.
            </p>
        </LegalPage>
    );
}
