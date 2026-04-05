"use server";

import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";
import Review from "@/models/Review";
import { revalidatePath } from "next/cache";

/**
 * Server Action: Create a new order
 */
export async function createOrder(orderData) {
    try {
        await dbConnect();

        // 1. Validate requestId for idempotency
        const existingOrder = await Order.findOne({ requestId: orderData.requestId });
        if (existingOrder) {
            return { success: true, order: JSON.parse(JSON.stringify(existingOrder)), msg: "Idempotency catch" };
        }

        // 2. Double check stock availability
        for (const item of orderData.items) {
            const product = await Product.findOne({ id: item.productId });
            if (!product || product.stock < item.quantity) {
                throw new Error(`Insufficient stock for ${item.title}`);
            }
        }

        // 3. Generate unique order ID
        const lastOrder = await Order.findOne().sort({ createdAt: -1 });
        const nextId = (parseInt(lastOrder?.id?.split('-')[1] || '0') + 1).toString().padStart(4, '0');
        const orderId = `P-PP-${nextId}`;

        // 4. Create Order
        const newOrder = new Order({
            ...orderData,
            id: orderId,
            status: 'pending',
            paymentStatus: 'pending'
        });

        await newOrder.save();

        // 5. Update Stock (decrement)
        for (const item of orderData.items) {
            await Product.updateOne(
                { id: item.productId },
                { $inc: { stock: -item.quantity } }
            );
        }

        // 6. Return serialized order
        return { 
            success: true, 
            order: JSON.parse(JSON.stringify(newOrder)) 
        };

    } catch (error) {
        console.error("Order Action Error:", error);
        return { 
            success: false, 
            error: error.message || "Failed to place order. Please try again." 
        };
    }
}

/**
 * Server Action: Submit a product review
 */
export async function submitReview(reviewData) {
    try {
        await dbConnect();

        const newReview = new Review({
            ...reviewData,
            status: 'pending' // Always start as pending for moderation
        });

        await newReview.save();
        
        revalidatePath('/product/[slug]', 'page');
        
        return { success: true, message: "Review submitted for moderation." };
    } catch (error) {
        console.error("Review Action Error:", error);
        return { success: false, error: "Failed to submit review." };
    }
}

/**
 * Server Action: Admin - Update Order Status
 */
export async function updateOrderStatus(orderId, status) {
    try {
        await dbConnect();
        
        const order = await Order.findOneAndUpdate(
            { id: orderId },
            { $set: { status, updatedAt: new Date() } },
            { new: true }
        );

        if (!order) throw new Error("Order not found");

        revalidatePath('/admin');
        revalidatePath('/track-order');
        return { success: true, order: JSON.parse(JSON.stringify(order)) };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

/**
 * Server Action: Track Order
 */
export async function trackOrder(orderId) {
    try {
        await dbConnect();
        
        // Support both ID and Order Identifier (P-PP-XXXX)
        const order = await Order.findOne({ 
            $or: [
                { id: orderId.toUpperCase().replace('#', '') },
                { id: `P-PP-${orderId.toUpperCase().replace('#', '').split('-').pop()}` }
            ]
        });

        if (!order) {
            throw new Error("Order not found. Please check your reference number.");
        }

        return { 
            success: true, 
            order: JSON.parse(JSON.stringify(order)) 
        };
    } catch (error) {
        return { success: false, error: error.message };
    }
}
