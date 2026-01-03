"use client";

import React from 'react';
import LegalPage from './LegalPage';

export default function TermsOfService() {
    return (
        <LegalPage title="Service Terms" lastUpdated="January 2026">
            <h2>1. Platform Access</h2>
            <p>
                By accessing Vanguard, you agree to comply with our operational protocols. This platform is a curated marketplace for premium entities and masterpieces.
            </p>

            <h2>2. Acquisition Protocols</h2>
            <p>
                All "Acquisitions" (orders) are subject to availability. We reserve the right to limit quantities or terminate orders if suspicious bot activity or neural scraping is detected.
            </p>

            <h2>3. Intellectual Assets</h2>
            <p>
                All visual assets, stories, and "Neural Narratives" (AI-generated descriptions) are the property of Vanguard. Reproduction without authorization initiates a termination protocol.
            </p>

            <h2>4. Limitation of Liability</h2>
            <p>
                Vanguard is not responsible for any digital vertigo or aesthetic overload experienced while browsing our high-definition masterpieces.
            </p>
        </LegalPage>
    );
}
