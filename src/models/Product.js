import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a product title'],
        maxlength: [60, 'Title cannot be more than 60 characters'],
    },
    slug: {
        type: String,
        unique: true,
        sparse: true, // Allow older docs to lack it initially (though we should migrate them)
    },
    description: {
        type: String,
        required: [true, 'Please provide a product description'],
    },
    price: {
        type: Number,
        required: [true, 'Please provide a product price'],
    },
    image: {
        type: String,
        required: [true, 'Please provide an image URL'],
    },
    category: {
        type: [String],
        required: [true, 'Please provide a category'],
    },
    colors: {
        type: [String],
        default: [],
    },
    stock: {
        type: Number,
        default: 10, // Default stock for now
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
