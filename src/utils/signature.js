/**
 * Digital Signature Utility
 * Used to protect author credits from simple text searches
 */
export const getAuthorSignature = (encoded) => {
    try {
        // Works in both Browser and Node.js
        if (typeof window !== 'undefined' && window.atob) {
            return window.atob(encoded);
        }
        return Buffer.from(encoded, 'base64').toString('utf-8');
    } catch (e) {
        return 'Premium Developer';
    }
};
