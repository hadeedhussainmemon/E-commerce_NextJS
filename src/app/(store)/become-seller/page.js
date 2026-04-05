import BecomeSeller from "@/components/store/Auth/BecomeSeller";

import config from "@/config";

export const metadata = {
    title: `Become a Seller | ${config.appName} Marketplace`,
    description: `Start selling your products on ${config.appName} and reach thousands of customers.`,
};

export default function BecomeSellerPage() {
    return <BecomeSeller />;
}
