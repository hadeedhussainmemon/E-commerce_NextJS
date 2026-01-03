// Utility function to check if product is new (within 30 days)
export const isNewProduct = (createdAt) => {
    if (!createdAt) return false;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return new Date(createdAt) > thirtyDaysAgo;
};

// Utility function to check if product is on sale
export const isOnSale = (price, originalPrice) => {
    if (!originalPrice || !price) return false;
    return originalPrice > price;
};

// Calculate discount percentage
export const getDiscountPercentage = (price, originalPrice) => {
    if (!originalPrice || !price) return 0;
    return Math.round(((originalPrice - price) / originalPrice) * 100);
};
