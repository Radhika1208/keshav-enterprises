import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    sku: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    brand: { type: String, default: "Keshav Enterprises" },
    price: { type: Number, required: true, min: 0 },
    mrp: { type: Number, required: true, min: 0 },
    unit: { type: String, default: "piece" }, // e.g. piece, box of 10, pack of 100
    stock: { type: Number, required: true, default: 0, min: 0 },
    images: [{ type: String }],
    isSterile: { type: Boolean, default: false },
    isReusable: { type: Boolean, default: true },
    hsnCode: { type: String, default: "" },
    specifications: [
      {
        key: { type: String },
        value: { type: String },
      },
    ],
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    ratingsAverage: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

productSchema.index({ name: "text", description: "text", sku: "text" });

export default mongoose.model("Product", productSchema);
