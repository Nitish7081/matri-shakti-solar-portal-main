import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dns from "dns";
import dotenv from "dotenv";
import { AdminModel } from "./models/Admin";
import { SolarCompanyModel } from "./models/SolarCompany";
import { SolarPackageModel } from "./models/SolarPackage";

dotenv.config();

// Ensure Atlas mongodb+srv URIs resolve on Windows without ECONNREFUSED
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch {
  // Ignore in restricted environments
}

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/matri-shakti-solar";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached!.conn) {
    return cached!.conn;
  }

  if (!cached!.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    };

    cached!.promise = (async () => {
      try {
        const m = await mongoose.connect(MONGODB_URI, opts);
        console.log("[MongoDB] Connected successfully to", MONGODB_URI.split("@").pop()?.split("?")[0] || "database");
        await seedDefaultAdmin();
        await seedSolarCatalog();
        return m;
      } catch (atlasErr) {
        console.warn("[MongoDB Atlas] Could not connect to Atlas cluster:", (atlasErr as Error).message);
        console.log("[MongoDB] Attempting fallback to local MongoDB (mongodb://127.0.0.1:27017/matri-shakti-solar)...");
        try {
          const localUri = "mongodb://127.0.0.1:27017/matri-shakti-solar";
          const localM = await mongoose.connect(localUri, opts);
          console.log("[MongoDB] Successfully connected to local MongoDB fallback!");
          await seedDefaultAdmin();
          await seedSolarCatalog();
          return localM;
        } catch (localErr) {
          console.error("[MongoDB] Both Atlas and Local MongoDB connection failed.");
          throw atlasErr;
        }
      }
    })();
  }

  try {
    cached!.conn = await cached!.promise;
  } catch (e) {
    cached!.promise = null;
    console.error("[MongoDB] Connection error:", e);
    throw e;
  }

  return cached!.conn;
}

async function seedDefaultAdmin() {
  try {
    const adminCount = await AdminModel.countDocuments();
    if (adminCount === 0) {
      const defaultEmail = (process.env.ADMIN_EMAIL || "admin@matrishakti.com").toLowerCase().trim();
      const defaultPassword = process.env.ADMIN_PASSWORD || "Admin@123456";
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);

      await AdminModel.create({
        email: defaultEmail,
        password: hashedPassword,
        name: "Super Admin",
        role: "admin",
      });
      console.log(`[MongoDB] Initial admin account created (${defaultEmail})`);
    }
  } catch (err) {
    console.warn("[MongoDB] Note: Admin seed check encountered:", (err as Error).message);
  }
}

export async function seedSolarCatalog() {
  try {
    const companyCount = await SolarCompanyModel.countDocuments();
    if (companyCount === 0) {
      console.log("[MongoDB] Seeding initial top Solar Companies...");
      const initialCompanies = [
        {
          name: "Tata Power Solar",
          slug: "tata-solar",
          logo: "https://images.unsplash.com/photo-1509391365360-2e959784a276?w=120&auto=format&fit=crop&q=60",
          description: "India's pioneer in solar rooftop technology with 34+ years of trust.",
          website: "https://www.tatapowersolar.com",
          order: 1,
        },
        {
          name: "Adani Solar",
          slug: "adani-solar",
          logo: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=120&auto=format&fit=crop&q=60",
          description: "India's first vertically integrated solar PV manufacturer with Tier-1 cells.",
          website: "https://www.adanisolar.com",
          order: 2,
        },
        {
          name: "Waaree Solar",
          slug: "waaree-solar",
          logo: "https://images.unsplash.com/photo-1497440001374-f26997328c1b?w=120&auto=format&fit=crop&q=60",
          description: "India's largest solar panel manufacturer with cutting-edge TopCon modules.",
          website: "https://www.waaree.com",
          order: 3,
        },
        {
          name: "Usha Solar",
          slug: "usha-solar",
          logo: "https://images.unsplash.com/photo-1545208942-e1c9c916524b?w=120&auto=format&fit=crop&q=60",
          description: "Reliable household brand delivering affordable & durable rooftop solar packages.",
          website: "https://www.ushasolar.com",
          order: 4,
        },
        {
          name: "Vikram Solar",
          slug: "vikram-solar",
          logo: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=120&auto=format&fit=crop&q=60",
          description: "Globally recognized solar manufacturer specialized in high-yield rooftop PV.",
          website: "https://www.vikramsolar.com",
          order: 5,
        },
        {
          name: "Loom Solar",
          slug: "loom-solar",
          logo: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=120&auto=format&fit=crop&q=60",
          description: "Premium mono PERC and bifacial solar panel specialists.",
          website: "https://www.loomsolar.com",
          order: 6,
        },
      ];

      const createdCompanies = await SolarCompanyModel.insertMany(initialCompanies);
      console.log(`[MongoDB] Created ${createdCompanies.length} solar companies.`);

      // Now Seed Packages for 1 KW to 20 KW
      const packagesToInsert = [];

      for (const comp of createdCompanies) {
        for (let kw = 1; kw <= 20; kw++) {
          // Calculate PM Surya Ghar UP subsidy:
          // 1 KW: ₹45,000 (Central 30k + State 15k)
          // 2 KW: ₹90,000 (Central 60k + State 30k)
          // 3 KW to 20 KW: ₹1,08,000 (Central 78k + State 30k max residential cap)
          let subsidy = 108000;
          if (kw === 1) subsidy = 45000;
          else if (kw === 2) subsidy = 90000;

          // Selling price formula per KW
          let pricePerKW = 58000;
          if (comp.slug === "tata-solar") pricePerKW = 62000;
          else if (comp.slug === "adani-solar") pricePerKW = 60000;
          else if (comp.slug === "usha-solar") pricePerKW = 54000;
          else if (comp.slug === "loom-solar") pricePerKW = 64000;

          // Economy of scale for higher capacities
          if (kw >= 6 && kw <= 10) pricePerKW *= 0.92;
          else if (kw >= 11) pricePerKW *= 0.86;

          const sellingPrice = Math.round((kw * pricePerKW) / 500) * 500;
          const basePrice = Math.round(sellingPrice * 1.15);
          const discount = basePrice - sellingPrice;

          const panelWattage = 550;
          const panelCount = Math.ceil((kw * 1000) / panelWattage);

          // Example: Waaree 7 KW intentionally set to unavailable for testing
          const isAvailable = !(comp.slug === "waaree-solar" && kw === 7);

          packagesToInsert.push({
            companyId: comp._id,
            companyName: comp.name,
            companySlug: comp.slug,
            model: `${comp.name} On-Grid ${kw} KW System`,
            capacityKW: kw,
            panelWattage,
            panelCount,
            inverterBrand: `${comp.name.split(" ")[0]} / Solis Smart Inverter`,
            inverterModel: `${kw}KW-OG-${panelWattage}`,
            structureType: "Hot Dip Galvanized Rooftop Structure",
            batteryIncluded: false,
            installationIncluded: true,
            netMeteringIncluded: true,
            warranty: "25 Years Panel / 5 Years Inverter / 5 Years Workmanship",
            basePrice,
            sellingPrice,
            discount,
            subsidy,
            available: isAvailable,
            active: true,
            description: `Complete ${kw} KW rooftop solar system by ${comp.name}. Includes ${panelCount} high-efficiency ${panelWattage}W Mono PERC panels, grid-tied inverter, structure, bi-directional net meter coordination, and turnkey installation under PM Surya Ghar Yojana.`,
          });
        }
      }

      await SolarPackageModel.insertMany(packagesToInsert);
      console.log(`[MongoDB] Created ${packagesToInsert.length} solar packages (1 KW to 20 KW) for all brands.`);
    }
  } catch (err) {
    console.warn("[MongoDB] Solar catalog seed note:", (err as Error).message);
  }
}
