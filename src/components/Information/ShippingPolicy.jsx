"use client";

import React from 'react';
import LegalPage from './LegalPage';

export default function ShippingPolicy() {
    return (
        <LegalPage title="Logistics & Deployment" lastUpdated="January 2026">
            <h2>1. Deployment Zones</h2>
            <p>
                We deploy masterpieces globally. Remote sectors may require additional transit cycles.
            </p>

            <h2>2. Transit Cycles</h2>
            <p>
                Standard deployment takes 3-5 standard cycles. Express neural delivery is available for select urban hubs (1-2 cycles).
            </p>

            <h2>3. Asset Tracking</h2>
            <p>
                Once an acquisition is processed, you will receive a unique tracking frequency to monitor the deployment in real-time.
            </p>

            <h2>4. Import Fees</h2>
            <p>
                Connoisseurs are responsible for any local sector taxes or import frequencies required by their governing authorities.
            </p>
        </LegalPage>
    );
}
