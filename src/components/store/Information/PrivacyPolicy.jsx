import LegalPage from './LegalPage';

export default function PrivacyPolicy() {
    return (
        <LegalPage title="Privacy Policy" lastUpdated="January 2026">
            <h2>1. Information Collection</h2>
            <p>
                We collect personal information such as your name, contact details, and shipping address solely to facilitate the delivery of your orders. Your data is protected by industry-standard encryption during transit and storage.
            </p>

            <h2>2. How We Use Your Data</h2>
            <p>
                Your information is used to process transactions, provide personalized customer assistance, and improve your shopping experience. We do not sell or trade your personal information to third-party entities.
            </p>

            <h2>3. Secure Payments</h2>
            <p>
                All financial transactions are processed via secure payment gateways. We do not store raw credit card data on our local servers.
            </p>

            <h2>4. Cookies & Tracking</h2>
            <p>
                Our platform uses cookies to maintain session persistence and analyze traffic patterns. You may adjust your browser settings to reject these cookies, though some features of the site may be affected.
            </p>
        </LegalPage>
    );
}
