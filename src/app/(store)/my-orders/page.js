import MyOrders from "@/components/store/MyOrders/MyOrders";

import config from "@/config";

export const metadata = {
    title: `My Orders | ${config.appName} - Order History`,
    description: "Track and manage your orders",
};

export default function MyOrdersPage() {
    return <MyOrders />;
}
