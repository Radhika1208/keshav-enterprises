import dotenv from "dotenv";
import connectDB from "./config/db.js";
import User from "./models/User.js";
import Category from "./models/Category.js";
import Product from "./models/Product.js";

dotenv.config();
connectDB();

const categories = [
  { name: "Surgical Instruments", slug: "surgical-instruments", description: "Scissors, forceps, clamps, retractors and needle holders." },
  { name: "Sutures & Wound Closure", slug: "sutures-wound-closure", description: "Absorbable and non-absorbable sutures, skin staplers." },
  { name: "Disposables & Consumables", slug: "disposables-consumables", description: "Gloves, drapes, syringes, gauze and single-use items." },
  { name: "Sterilization Supplies", slug: "sterilization-supplies", description: "Autoclave pouches, indicators and sterilization wraps." },
  { name: "Operation Theatre Essentials", slug: "ot-essentials", description: "OT gowns, caps, masks and shoe covers." },
];

const productSeeds = [
  { name: "Mayo Scissors, Straight 17cm", sku: "SI-MAYO-17S", category: "Surgical Instruments", brand: "Keshav Surgical", price: 420, mrp: 550, unit: "piece", stock: 120, isSterile: false, isReusable: true, description: "Stainless steel straight Mayo dissecting scissors, 17cm, for cutting tough tissue and sutures.", specifications: [{ key: "Material", value: "Surgical Grade Stainless Steel" }, { key: "Length", value: "17 cm" }], isFeatured: true },
  { name: "Metzenbaum Scissors, Curved 18cm", sku: "SI-METZ-18C", category: "Surgical Instruments", brand: "Keshav Surgical", price: 480, mrp: 620, unit: "piece", stock: 90, isSterile: false, isReusable: true, description: "Curved Metzenbaum scissors for delicate tissue dissection, 18cm length.", specifications: [{ key: "Material", value: "Stainless Steel" }, { key: "Length", value: "18 cm" }] },
  { name: "Kelly Forceps, Curved 14cm", sku: "SI-KELLY-14C", category: "Surgical Instruments", brand: "Keshav Surgical", price: 260, mrp: 340, unit: "piece", stock: 150, isSterile: false, isReusable: true, description: "Curved Kelly hemostatic forceps for clamping vessels, 14cm.", specifications: [{ key: "Length", value: "14 cm" }] },
  { name: "Adson Tissue Forceps, 1x2 Teeth", sku: "SI-ADSON-12", category: "Surgical Instruments", brand: "Keshav Surgical", price: 180, mrp: 230, unit: "piece", stock: 200, isSterile: false, isReusable: true, description: "Adson toothed tissue forceps, 12cm, for precise tissue handling.", specifications: [{ key: "Length", value: "12 cm" }] },
  { name: "Self-Retaining Retractor, Weitlaner", sku: "SI-WEITLANER-01", category: "Surgical Instruments", brand: "Keshav Surgical", price: 950, mrp: 1250, unit: "piece", stock: 40, isSterile: false, isReusable: true, description: "Weitlaner self-retaining retractor with 3x4 sharp prongs.", specifications: [{ key: "Length", value: "16 cm" }] },
  { name: "Needle Holder, Mayo-Hegar 16cm", sku: "SI-NH-MH16", category: "Surgical Instruments", brand: "Keshav Surgical", price: 390, mrp: 500, unit: "piece", stock: 100, isSterile: false, isReusable: true, description: "Mayo-Hegar needle holder for secure suturing, tungsten carbide inserts, 16cm.", specifications: [{ key: "Length", value: "16 cm" }] },
  { name: "Polypropylene Suture 3-0, 45cm (Box of 12)", sku: "SU-PP-30", category: "Sutures & Wound Closure", brand: "Keshav Sutures", price: 780, mrp: 950, unit: "box of 12", stock: 60, isSterile: true, isReusable: false, description: "Non-absorbable monofilament polypropylene suture with reverse cutting needle.", specifications: [{ key: "Size", value: "3-0" }, { key: "Length", value: "45 cm" }] },
  { name: "Polyglactin Suture 2-0, 70cm (Box of 12)", sku: "SU-PG-20", category: "Sutures & Wound Closure", brand: "Keshav Sutures", price: 820, mrp: 1000, unit: "box of 12", stock: 55, isSterile: true, isReusable: false, description: "Absorbable braided polyglactin suture for soft tissue approximation.", specifications: [{ key: "Size", value: "2-0" }] },
  { name: "Skin Stapler, Disposable 35W", sku: "SU-STAPLE-35W", category: "Sutures & Wound Closure", brand: "Keshav Sutures", price: 340, mrp: 420, unit: "piece", stock: 80, isSterile: true, isReusable: false, description: "Disposable skin stapler with 35 wide staples for rapid skin closure." },
  { name: "Sterile Surgical Gloves, Size 7.5 (Pair)", sku: "DC-GLOVE-75", category: "Disposables & Consumables", brand: "Keshav Disposables", price: 45, mrp: 60, unit: "pair", stock: 2000, isSterile: true, isReusable: false, description: "Powder-free latex surgical gloves, sterile, size 7.5." },
  { name: "Surgical Face Mask, 3-Ply (Box of 50)", sku: "DC-MASK-3PLY", category: "Disposables & Consumables", brand: "Keshav Disposables", price: 350, mrp: 450, unit: "box of 50", stock: 300, isSterile: false, isReusable: false, description: "3-ply surgical face masks with nose clip and ear loops, box of 50." },
  { name: "Disposable Surgical Drape, 150x200cm", sku: "DC-DRAPE-150", category: "Disposables & Consumables", brand: "Keshav Disposables", price: 65, mrp: 85, unit: "piece", stock: 500, isSterile: true, isReusable: false, description: "Fluid-resistant sterile disposable surgical drape, 150x200cm." },
  { name: "Disposable Syringe 10ml (Box of 100)", sku: "DC-SYR-10ML", category: "Disposables & Consumables", brand: "Keshav Disposables", price: 480, mrp: 600, unit: "box of 100", stock: 150, isSterile: true, isReusable: false, description: "Sterile single-use 10ml syringes with Luer lock, box of 100." },
  { name: "Absorbent Gauze Swab 10x10cm (Pack of 100)", sku: "DC-GAUZE-1010", category: "Disposables & Consumables", brand: "Keshav Disposables", price: 220, mrp: 280, unit: "pack of 100", stock: 400, isSterile: true, isReusable: false, description: "8-ply absorbent cotton gauze swabs, 10x10cm, sterile pack of 100." },
  { name: "Autoclave Sterilization Pouch 200x300mm (Pack of 200)", sku: "SS-POUCH-200300", category: "Sterilization Supplies", brand: "Keshav Sterile", price: 650, mrp: 800, unit: "pack of 200", stock: 90, isSterile: false, isReusable: false, description: "Self-sealing autoclave pouches with steam indicator, 200x300mm." },
  { name: "Chemical Indicator Strips Class 4 (Pack of 250)", sku: "SS-INDICATOR-C4", category: "Sterilization Supplies", brand: "Keshav Sterile", price: 590, mrp: 700, unit: "pack of 250", stock: 70, isSterile: false, isReusable: false, description: "Class 4 chemical indicator strips for steam sterilization monitoring." },
  { name: "Crepe Sterilization Wrap 90x90cm (Pack of 50)", sku: "SS-WRAP-9090", category: "Sterilization Supplies", brand: "Keshav Sterile", price: 1100, mrp: 1400, unit: "pack of 50", stock: 45, isSterile: false, isReusable: false, description: "Medical-grade crepe paper sterilization wrap, 90x90cm, pack of 50." },
  { name: "OT Reusable Gown, Size L", sku: "OT-GOWN-L", category: "Operation Theatre Essentials", brand: "Keshav Sterile", price: 550, mrp: 700, unit: "piece", stock: 60, isSterile: false, isReusable: true, description: "Reusable fluid-resistant operation theatre gown, size Large." },
  { name: "Disposable Bouffant Cap (Pack of 100)", sku: "OT-CAP-100", category: "Operation Theatre Essentials", brand: "Keshav Sterile", price: 260, mrp: 330, unit: "pack of 100", stock: 200, isSterile: false, isReusable: false, description: "Non-woven disposable bouffant surgical caps, pack of 100." },
  { name: "Disposable Shoe Cover (Pack of 100 pairs)", sku: "OT-SHOE-100", category: "Operation Theatre Essentials", brand: "Keshav Sterile", price: 300, mrp: 380, unit: "pack of 100 pairs", stock: 180, isSterile: false, isReusable: false, description: "Non-slip disposable shoe covers for OT and cleanroom use, pack of 100 pairs." },
];

const importData = async () => {
  try {
    await Product.deleteMany();
    await Category.deleteMany();
    await User.deleteMany({ email: "admin@keshaventerprises.com" });

    const createdCategories = await Category.insertMany(categories);
    const categoryMap = {};
    createdCategories.forEach((c) => (categoryMap[c.name] = c._id));

    const productsToInsert = productSeeds.map((p) => ({
      ...p,
      category: categoryMap[p.category],
    }));
    await Product.insertMany(productsToInsert);

    await User.create({
      name: "Keshav Admin",
      email: "admin@keshaventerprises.com",
      password: "Admin@12345",
      role: "admin",
    });

    console.log("Data imported successfully!");
    console.log("Admin login -> email: admin@keshaventerprises.com | password: Admin@12345");
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Product.deleteMany();
    await Category.deleteMany();
    console.log("Data destroyed!");
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
