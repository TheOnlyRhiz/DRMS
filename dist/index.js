var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express3 from "express";

// server/routes.ts
import express from "express";
import { createServer } from "http";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  analytics: () => analytics,
  apiRegisterUserSchema: () => apiRegisterUserSchema,
  bookings: () => bookings,
  bookingsRelations: () => bookingsRelations,
  downloads: () => downloads,
  downloadsRelations: () => downloadsRelations,
  equipment: () => equipment,
  equipmentRelations: () => equipmentRelations,
  insertBookingSchema: () => insertBookingSchema,
  insertDownloadSchema: () => insertDownloadSchema,
  insertEquipmentSchema: () => insertEquipmentSchema,
  insertResourceSchema: () => insertResourceSchema,
  insertUserSchema: () => insertUserSchema,
  loginUserSchema: () => loginUserSchema,
  registerUserSchema: () => registerUserSchema,
  resources: () => resources,
  resourcesRelations: () => resourcesRelations,
  sessions: () => sessions,
  users: () => users,
  usersRelations: () => usersRelations
});
import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  boolean
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull()
  },
  (table) => [index("IDX_session_expire").on(table.expire)]
);
var users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique().notNull(),
  password: varchar("password").notNull(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role", { enum: ["student", "faculty", "admin"] }).notNull().default("student"),
  matricNumber: varchar("matric_number"),
  department: varchar("department").default("Computer Science"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var resources = pgTable("resources", {
  id: serial("id").primaryKey(),
  title: varchar("title").notNull(),
  description: text("description"),
  fileName: varchar("file_name").notNull(),
  fileUrl: varchar("file_url").notNull(),
  fileSize: integer("file_size"),
  // in bytes
  fileType: varchar("file_type").notNull(),
  category: varchar("category", {
    enum: ["lecture_notes", "past_questions", "project_reports", "reference_materials", "assignments"]
  }).notNull(),
  course: varchar("course").notNull(),
  academicYear: varchar("academic_year"),
  uploadedBy: varchar("uploaded_by").notNull().references(() => users.id),
  downloadCount: integer("download_count").default(0),
  isApproved: boolean("is_approved").default(false),
  approvedBy: varchar("approved_by").references(() => users.id),
  approvedAt: timestamp("approved_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var equipment = pgTable("equipment", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description"),
  status: varchar("status", {
    enum: ["available", "booked", "unavailable"]
  }).notNull().default("available"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  equipmentId: integer("equipment_id").notNull().references(() => equipment.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  purpose: text("purpose"),
  status: varchar("status", {
    enum: ["pending", "approved", "cancelled", "completed"]
  }).notNull().default("pending"),
  approvedBy: varchar("approved_by").references(() => users.id),
  approvedAt: timestamp("approved_at"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var downloads = pgTable("downloads", {
  id: serial("id").primaryKey(),
  resourceId: integer("resource_id").notNull().references(() => resources.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  downloadedAt: timestamp("downloaded_at").defaultNow()
});
var analytics = pgTable("analytics", {
  id: serial("id").primaryKey(),
  date: timestamp("date").notNull(),
  activeUsers: integer("active_users").default(0),
  totalLogins: integer("total_logins").default(0),
  resourcesUploaded: integer("resources_uploaded").default(0),
  resourcesDownloaded: integer("resources_downloaded").default(0),
  equipmentBookings: integer("equipment_bookings").default(0),
  createdAt: timestamp("created_at").defaultNow()
});
var usersRelations = relations(users, ({ many }) => ({
  uploadedResources: many(resources, { relationName: "uploader" }),
  approvedResources: many(resources, { relationName: "approver" }),
  bookings: many(bookings),
  downloads: many(downloads)
}));
var resourcesRelations = relations(resources, ({ one, many }) => ({
  uploader: one(users, {
    fields: [resources.uploadedBy],
    references: [users.id],
    relationName: "uploader"
  }),
  approver: one(users, {
    fields: [resources.approvedBy],
    references: [users.id],
    relationName: "approver"
  }),
  downloads: many(downloads)
}));
var equipmentRelations = relations(equipment, ({ many }) => ({
  bookings: many(bookings)
}));
var bookingsRelations = relations(bookings, ({ one }) => ({
  equipment: one(equipment, {
    fields: [bookings.equipmentId],
    references: [equipment.id]
  }),
  user: one(users, {
    fields: [bookings.userId],
    references: [users.id]
  }),
  approver: one(users, {
    fields: [bookings.approvedBy],
    references: [users.id]
  })
}));
var downloadsRelations = relations(downloads, ({ one }) => ({
  resource: one(resources, {
    fields: [downloads.resourceId],
    references: [resources.id]
  }),
  user: one(users, {
    fields: [downloads.userId],
    references: [users.id]
  })
}));
var insertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true
});
var insertResourceSchema = createInsertSchema(resources).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  downloadCount: true,
  isApproved: true,
  approvedBy: true,
  approvedAt: true
});
var insertEquipmentSchema = createInsertSchema(equipment).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertBookingSchema = z.object({
  equipmentId: z.number(),
  userId: z.string(),
  startTime: z.string().transform((val) => new Date(val)),
  endTime: z.string().transform((val) => new Date(val)),
  purpose: z.string().optional(),
  notes: z.string().optional()
});
var insertDownloadSchema = createInsertSchema(downloads).omit({
  id: true,
  downloadedAt: true
});
var registerUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  isActive: true
}).extend({
  confirmPassword: z.string().min(8, "Password must be at least 8 characters")
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});
var apiRegisterUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  isActive: true
});
var loginUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required")
});

// server/db.ts
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set.");
}
var pool = new Pool({
  connectionString: process.env.DATABASE_URL
});
var db = drizzle(pool, { schema: schema_exports });

// server/storage.ts
import { eq, desc, and, gte, lte, count, sql } from "drizzle-orm";
var DatabaseStorage = class {
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  async getUserByEmail(email) {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }
  async getAllUsers() {
    const dbUsers = await db.select().from(users).orderBy(desc(users.createdAt));
    return dbUsers.map((user) => ({
      ...user,
      status: user.isActive ? "Active" : "Disabled"
    }));
  }
  async updateUser(id, updates) {
    const [user] = await db.update(users).set({
      ...updates,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq(users.id, id)).returning();
    return user;
  }
  async createUser(userData) {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }
  async upsertUser(userData) {
    const [user] = await db.insert(users).values(userData).onConflictDoUpdate({
      target: users.id,
      set: {
        ...userData,
        updatedAt: /* @__PURE__ */ new Date()
      }
    }).returning();
    return user;
  }
  async getResources(filters) {
    const conditions = [];
    if (!filters?.uploadedBy) {
      conditions.push(eq(resources.isApproved, true));
    }
    if (filters?.category) {
      conditions.push(eq(resources.category, filters.category));
    }
    if (filters?.course) {
      conditions.push(eq(resources.course, filters.course));
    }
    if (filters?.uploadedBy) {
      conditions.push(eq(resources.uploadedBy, filters.uploadedBy));
    }
    return await db.select().from(resources).where(and(...conditions)).orderBy(desc(resources.createdAt));
  }
  async getResourceById(id) {
    const [resource] = await db.select().from(resources).where(eq(resources.id, id));
    return resource;
  }
  async createResource(resource) {
    const resourceWithApproval = {
      ...resource,
      isApproved: true,
      approvedAt: /* @__PURE__ */ new Date()
    };
    const [newResource] = await db.insert(resources).values(resourceWithApproval).returning();
    return newResource;
  }
  async updateResource(id, updates) {
    const [updatedResource] = await db.update(resources).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(resources.id, id)).returning();
    return updatedResource;
  }
  async deleteResource(id) {
    await db.delete(resources).where(eq(resources.id, id));
  }
  async approveResource(id, approvedBy) {
    const [approvedResource] = await db.update(resources).set({
      isApproved: true,
      approvedBy,
      approvedAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq(resources.id, id)).returning();
    return approvedResource;
  }
  async getEquipment() {
    return await db.select().from(equipment);
  }
  async getEquipmentById(id) {
    const [item] = await db.select().from(equipment).where(eq(equipment.id, id));
    return item;
  }
  async createEquipment(equipmentData) {
    const [newEquipment] = await db.insert(equipment).values(equipmentData).returning();
    return newEquipment;
  }
  async updateEquipment(id, updates) {
    const { createdAt, updatedAt, ...cleanUpdates } = updates;
    const [updatedEquipment] = await db.update(equipment).set({ ...cleanUpdates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(equipment.id, id)).returning();
    return updatedEquipment;
  }
  async deleteEquipment(id) {
    await db.delete(equipment).where(eq(equipment.id, id));
  }
  async getBookings(userId) {
    if (userId) {
      return await db.select().from(bookings).where(eq(bookings.userId, userId)).orderBy(desc(bookings.createdAt));
    }
    return await db.select().from(bookings).orderBy(desc(bookings.createdAt));
  }
  async getBookingById(id) {
    const [booking] = await db.select().from(bookings).where(eq(bookings.id, id));
    return booking;
  }
  async createBooking(booking) {
    const [newBooking] = await db.insert(bookings).values(booking).returning();
    return newBooking;
  }
  async updateBooking(id, updates) {
    const [updatedBooking] = await db.update(bookings).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(bookings.id, id)).returning();
    return updatedBooking;
  }
  async cancelBooking(id) {
    const [cancelledBooking] = await db.update(bookings).set({ status: "cancelled", updatedAt: /* @__PURE__ */ new Date() }).where(eq(bookings.id, id)).returning();
    return cancelledBooking;
  }
  async recordDownload(download) {
    const [newDownload] = await db.insert(downloads).values(download).returning();
    await db.update(resources).set({
      downloadCount: sql`${resources.downloadCount} + 1`,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq(resources.id, download.resourceId));
    return newDownload;
  }
  async getDownloadHistory(userId) {
    return await db.select().from(downloads).where(eq(downloads.userId, userId)).orderBy(desc(downloads.downloadedAt));
  }
  async getAnalytics(startDate, endDate) {
    if (startDate && endDate) {
      return await db.select().from(analytics).where(
        and(
          gte(analytics.date, startDate),
          lte(analytics.date, endDate)
        )
      ).orderBy(desc(analytics.date));
    }
    return await db.select().from(analytics).orderBy(desc(analytics.date));
  }
  async getUserStats(userId) {
    const [uploadedCount] = await db.select({ count: count() }).from(resources).where(eq(resources.uploadedBy, userId));
    const [downloadedCount] = await db.select({ count: count() }).from(downloads).where(eq(downloads.userId, userId));
    const activeBookings = await db.select().from(bookings).where(
      and(
        eq(bookings.userId, userId),
        sql`${bookings.status} = 'approved'`
      )
    );
    const activeBookingsCount = { count: activeBookings.length };
    return {
      resourcesUploaded: uploadedCount.count,
      resourcesDownloaded: downloadedCount.count,
      activeBookings: activeBookingsCount.count
    };
  }
  async getSystemStats() {
    const [userCount] = await db.select({ count: count() }).from(users);
    const [resourceCount] = await db.select({ count: count() }).from(resources);
    const [equipmentCount] = await db.select({ count: count() }).from(equipment);
    const activeBookings = await db.select().from(bookings).where(sql`${bookings.status} = 'approved'`);
    const activeBookingsCount = { count: activeBookings.length };
    return {
      totalUsers: userCount.count,
      totalResources: resourceCount.count,
      totalEquipment: equipmentCount.count,
      activeBookings: activeBookingsCount.count
    };
  }
};
var storage = new DatabaseStorage();

// server/jwtAuth.ts
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
var JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key-that-should-be-very-long-and-random-in-production";
var JWT_EXPIRES_IN = "7d";
var generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};
var verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};
var hashPassword = async (password) => {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
};
var comparePassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};
var authenticateJWT = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No token provided" });
    }
    const decoded = verifyToken(token);
    if (req.path === "/api/auth/user") {
      const user = await storage.getUser(decoded.userId);
      if (!user) {
        return res.status(401).json({ message: "Unauthorized - User not found" });
      }
      req.user = user;
    } else {
      req.user = {
        id: decoded.userId,
        email: decoded.email,
        role: decoded.role
      };
    }
    next();
  } catch (error) {
    console.error("JWT Authentication error:", error);
    return res.status(401).json({ message: "Unauthorized - Invalid token" });
  }
};

// server/populateData.ts
async function populateDatabase() {
  try {
    console.log("Populating database with sample data...");
    const sampleResources = [
      {
        title: "Introduction to Computer Science - Lecture Notes",
        description: "Comprehensive lecture notes covering fundamental concepts in computer science including algorithms, data structures, and programming paradigms.",
        category: "lecture_notes",
        course: "CS 101",
        fileType: "application/pdf",
        fileName: "cs101-lecture-notes.pdf",
        fileUrl: "/uploads/cs101-lecture-notes.pdf",
        fileSize: 2457600,
        tags: ["computer science", "algorithms", "programming", "fundamentals"]
      },
      {
        title: "Advanced Mathematics Problem Sets",
        description: "Collection of challenging mathematical problems with detailed solutions covering calculus, linear algebra, and differential equations.",
        category: "assignments",
        course: "MATH 301",
        fileType: "application/pdf",
        fileName: "math301-problems.pdf",
        fileUrl: "/uploads/math301-problems.pdf",
        fileSize: 1843200,
        tags: ["mathematics", "calculus", "linear algebra", "differential equations"]
      },
      {
        title: "Physics Laboratory Manual",
        description: "Complete laboratory manual for undergraduate physics experiments including mechanics, thermodynamics, and electromagnetism.",
        category: "reference_materials",
        course: "PHYS 201",
        fileType: "application/pdf",
        fileName: "physics-lab-manual.pdf",
        fileUrl: "/uploads/physics-lab-manual.pdf",
        fileSize: 3276800,
        tags: ["physics", "laboratory", "experiments", "mechanics"]
      },
      {
        title: "Data Structures and Algorithms Textbook",
        description: "Comprehensive textbook covering advanced data structures, algorithm analysis, and implementation techniques with practical examples.",
        category: "reference_materials",
        course: "CS 250",
        fileType: "application/pdf",
        fileName: "dsa-textbook.pdf",
        fileUrl: "/uploads/dsa-textbook.pdf",
        fileSize: 5242880,
        tags: ["data structures", "algorithms", "computer science", "programming"]
      },
      {
        title: "Chemistry Research Papers Collection",
        description: "Curated collection of recent research papers in organic chemistry, including synthesis methods and reaction mechanisms.",
        category: "project_reports",
        course: "CHEM 350",
        fileType: "application/pdf",
        fileName: "chemistry-research.pdf",
        fileUrl: "/uploads/chemistry-research.pdf",
        fileSize: 4194304,
        tags: ["chemistry", "research", "organic chemistry", "synthesis"]
      },
      {
        title: "Statistical Analysis Software Tutorial",
        description: "Step-by-step tutorial for using statistical software packages including R, SPSS, and Python for data analysis.",
        category: "lecture_notes",
        course: "STAT 200",
        fileType: "application/pdf",
        fileName: "stats-tutorial.pdf",
        fileUrl: "/uploads/stats-tutorial.pdf",
        fileSize: 2621440,
        tags: ["statistics", "software", "data analysis", "tutorial"]
      },
      {
        title: "English Literature Essay Collection",
        description: "Collection of exemplary student essays analyzing classic works of English literature with detailed commentary.",
        category: "assignments",
        course: "ENG 250",
        fileType: "application/pdf",
        fileName: "literature-essays.pdf",
        fileUrl: "/uploads/literature-essays.pdf",
        fileSize: 1572864,
        tags: ["literature", "essays", "analysis", "writing"]
      },
      {
        title: "Database Design Past Questions",
        description: "Collection of past examination questions with model answers for database design and SQL programming.",
        category: "past_questions",
        course: "CS 340",
        fileType: "application/pdf",
        fileName: "database-past-questions.pdf",
        fileUrl: "/uploads/database-past-questions.pdf",
        fileSize: 2097152,
        tags: ["database", "design", "sql", "examination"]
      }
    ];
    const sampleEquipment = [
      {
        name: "High-Performance Computing Cluster",
        description: "Multi-node computing cluster with 128 cores, 512GB RAM, and GPU acceleration for computational research and parallel processing.",
        category: "Computing",
        location: "Room 301, Computer Science Building",
        status: "available",
        specifications: {
          "CPU": "2x Intel Xeon Gold 6248R (48 cores total)",
          "Memory": "512GB DDR4 ECC",
          "Storage": "4TB NVMe SSD",
          "GPU": "NVIDIA A100 40GB",
          "Network": "10 Gigabit Ethernet"
        },
        bookingInstructions: "Requires faculty approval. Maximum booking duration: 72 hours. Must submit job description and resource requirements."
      },
      {
        name: "Digital Microscope System",
        description: "Advanced digital microscope with 4K imaging capabilities, automated focus, and specimen analysis software for biological research.",
        category: "Laboratory",
        location: "Room 205, Biology Laboratory",
        status: "available",
        specifications: {
          "Magnification": "40x - 1000x",
          "Resolution": "4K (3840x2160)",
          "Illumination": "LED with adjustable intensity",
          "Software": "Image analysis and measurement tools",
          "Connectivity": "USB 3.0, Ethernet"
        },
        bookingInstructions: "Available for 2-hour slots. Training session required before first use. Contact lab coordinator for scheduling."
      },
      {
        name: "3D Printer (Industrial Grade)",
        description: "Professional-grade 3D printer capable of printing with various materials including PLA, ABS, PETG, and engineering plastics.",
        category: "Manufacturing",
        location: "Room 150, Engineering Workshop",
        status: "maintenance",
        specifications: {
          "Build Volume": "300mm x 300mm x 400mm",
          "Layer Resolution": "0.1mm - 0.4mm",
          "Materials": "PLA, ABS, PETG, TPU, Wood-fill, Metal-fill",
          "Heated Bed": "Up to 120\xB0C",
          "Extruder": "All-metal hotend up to 300\xB0C"
        },
        bookingInstructions: "Submit 3D model files 24 hours in advance. Maximum print time: 48 hours. Material costs charged separately."
      },
      {
        name: "Spectrophotometer UV-Vis",
        description: "High-precision UV-Visible spectrophotometer for quantitative analysis and material characterization in chemistry research.",
        category: "Analytical",
        location: "Room 320, Chemistry Laboratory",
        status: "available",
        specifications: {
          "Wavelength Range": "190-1100 nm",
          "Bandwidth": "1.8 nm",
          "Accuracy": "\xB10.5 nm",
          "Sample Types": "Liquid, solid, powder",
          "Software": "UV-Vis Analyst Pro"
        },
        bookingInstructions: "Minimum 1-hour slots. Training certification required. Bring your own cuvettes and samples."
      },
      {
        name: "Oscilloscope (100 MHz)",
        description: "Digital storage oscilloscope with advanced triggering capabilities for electronics and signal analysis applications.",
        category: "Electronics",
        location: "Room 180, Electronics Laboratory",
        status: "available",
        specifications: {
          "Bandwidth": "100 MHz",
          "Channels": "4 analog + 16 digital",
          "Sample Rate": "1 GSa/s",
          "Memory Depth": "10 Mpts",
          "Display": '10.1" color touchscreen'
        },
        bookingInstructions: "Available for 3-hour slots. Basic electronics knowledge required. Probes and test leads provided."
      },
      {
        name: "Laser Cutter",
        description: "CO2 laser cutting and engraving system for precise cutting of wood, acrylic, fabric, and other non-metal materials.",
        category: "Manufacturing",
        location: "Room 155, Design Workshop",
        status: "available",
        specifications: {
          "Laser Power": "60W CO2",
          "Cutting Area": "600mm x 400mm",
          "Material Thickness": "Up to 20mm (varies by material)",
          "Supported Materials": "Wood, acrylic, fabric, leather, paper, cardboard",
          "Software": "LaserCut 5.3"
        },
        bookingInstructions: "Safety training mandatory. Maximum 4-hour sessions. Design files must be pre-approved for safety."
      },
      {
        name: "Centrifuge (Refrigerated)",
        description: "High-speed refrigerated centrifuge for sample preparation and separation in biological and chemical research.",
        category: "Laboratory",
        location: "Room 210, Biochemistry Laboratory",
        status: "available",
        specifications: {
          "Maximum Speed": "15,000 RPM",
          "Temperature Range": "-20\xB0C to +40\xB0C",
          "Capacity": "4 x 250ml or 12 x 50ml tubes",
          "Timer": "1 min to 99 hours",
          "Safety Features": "Imbalance detection, door lock"
        },
        bookingInstructions: "Maximum 2-hour sessions. Balanced tubes required. Clean rotor after use."
      },
      {
        name: "Network Analyzer",
        description: "Vector network analyzer for RF and microwave component testing, antenna measurements, and circuit analysis.",
        category: "Electronics",
        location: "Room 185, RF Laboratory",
        status: "available",
        specifications: {
          "Frequency Range": "10 MHz to 8.5 GHz",
          "Dynamic Range": "110 dB",
          "Ports": "2-port measurements",
          "Calibration": "Full 2-port, TRL, SOLT",
          "Interface": "USB, Ethernet, GPIB"
        },
        bookingInstructions: "Advanced training required. 2-hour minimum booking. Calibration standards provided."
      }
    ];
    const facultyUserId = "m01dZODKSxNS8G39S2JQ1";
    console.log("Inserting sample resources...");
    for (const resourceData of sampleResources) {
      await storage.createResource({
        ...resourceData,
        uploadedBy: facultyUserId
      });
    }
    console.log("Inserting sample equipment...");
    for (const equipmentData of sampleEquipment) {
      await storage.createEquipment(equipmentData);
    }
    console.log("Database populated successfully!");
    console.log(`Added ${sampleResources.length} resources and ${sampleEquipment.length} equipment items.`);
  } catch (error) {
    console.error("Error populating database:", error);
    throw error;
  }
}

// server/routes.ts
import { z as z2 } from "zod";
import multer from "multer";
import path from "path";
import fs from "fs";
import { nanoid } from "nanoid";
var uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
var upload = multer({
  dest: uploadsDir,
  limits: {
    fileSize: 50 * 1024 * 1024
    // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      // PDF files
      "application/pdf",
      // Word documents
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      // PowerPoint presentations
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      // Excel spreadsheets
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      // Text files
      "text/plain",
      "text/csv",
      "text/rtf",
      // Images
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/bmp",
      "image/webp",
      // Archives
      "application/zip",
      "application/x-rar-compressed",
      "application/x-7z-compressed",
      // Other common formats
      "application/json",
      "text/html",
      "text/xml",
      "application/xml"
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type: ${file.mimetype}. Supported formats: PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, TXT, CSV, RTF, images (JPG, PNG, GIF, etc.), ZIP, RAR, JSON, HTML, XML.`));
    }
  }
});
async function registerRoutes(app2) {
  app2.post("/api/auth/register", async (req, res) => {
    try {
      const validatedData = apiRegisterUserSchema.parse(req.body);
      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists with this email" });
      }
      const hashedPassword = await hashPassword(validatedData.password);
      const userId = nanoid();
      const userData = {
        id: userId,
        email: validatedData.email,
        password: hashedPassword,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        role: validatedData.role || "student",
        matricNumber: validatedData.matricNumber,
        department: validatedData.department || "Computer Science"
      };
      const user = await storage.createUser(userData);
      const token = generateToken({
        userId: user.id,
        email: user.email,
        role: user.role
      });
      const { password: _, ...userWithoutPassword } = user;
      res.status(201).json({ user: userWithoutPassword, token });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(400).json({ message: "Registration failed", error: error.message });
    }
  });
  app2.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = loginUserSchema.parse(req.body);
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      if (!user.isActive) {
        return res.status(401).json({ message: "Account is disabled. Please contact an administrator." });
      }
      const isValidPassword = await comparePassword(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      const token = generateToken({
        userId: user.id,
        email: user.email,
        role: user.role
      });
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword, token });
    } catch (error) {
      console.error("Login error:", error);
      res.status(400).json({ message: "Login failed", error: error.message });
    }
  });
  app2.get("/api/auth/user", authenticateJWT, async (req, res) => {
    try {
      const { password: _, ...userWithoutPassword } = req.user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  app2.put("/api/auth/change-password", authenticateJWT, async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: "Current password and new password are required" });
      }
      const user = await storage.getUser(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const isValidPassword = await comparePassword(currentPassword, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Current password is incorrect" });
      }
      const hashedNewPassword = await hashPassword(newPassword);
      await storage.updateUser(user.id, { password: hashedNewPassword });
      res.json({ message: "Password changed successfully" });
    } catch (error) {
      console.error("Password change error:", error);
      res.status(500).json({ message: "Failed to change password" });
    }
  });
  app2.get("/api/resources", authenticateJWT, async (req, res) => {
    try {
      const { category, course, search } = req.query;
      const resources2 = await storage.getResources({
        category,
        course,
        search
      });
      res.json(resources2);
    } catch (error) {
      console.error("Error fetching resources:", error);
      res.status(500).json({ message: "Failed to fetch resources" });
    }
  });
  app2.get("/api/resources/my", authenticateJWT, async (req, res) => {
    try {
      const userId = req.user.id;
      const resources2 = await storage.getResources({ uploadedBy: userId });
      res.json(resources2);
    } catch (error) {
      console.error("Error fetching user resources:", error);
      res.status(500).json({ message: "Failed to fetch user resources" });
    }
  });
  app2.get("/api/resources/:id", authenticateJWT, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const resource = await storage.getResourceById(id);
      if (!resource) {
        return res.status(404).json({ message: "Resource not found" });
      }
      res.json(resource);
    } catch (error) {
      console.error("Error fetching resource:", error);
      res.status(500).json({ message: "Failed to fetch resource" });
    }
  });
  app2.post("/api/resources", authenticateJWT, upload.single("file"), async (req, res) => {
    try {
      const userId = req.user.id;
      const file = req.file;
      if (!file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      const resourceData = {
        ...req.body,
        uploadedBy: userId,
        fileName: file.originalname,
        fileUrl: `/uploads/${file.filename}`,
        fileSize: file.size,
        fileType: file.mimetype
      };
      const validatedData = insertResourceSchema.parse(resourceData);
      const resource = await storage.createResource(validatedData);
      res.status(201).json(resource);
    } catch (error) {
      console.error("Error creating resource:", error);
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid resource data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create resource" });
    }
  });
  app2.patch("/api/resources/:id", authenticateJWT, async (req, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      if (!user || user.role !== "faculty" && user.role !== "admin") {
        return res.status(403).json({ message: "Insufficient permissions" });
      }
      const id = parseInt(req.params.id);
      const updates = req.body;
      const resource = await storage.updateResource(id, updates);
      res.json(resource);
    } catch (error) {
      console.error("Error updating resource:", error);
      res.status(500).json({ message: "Failed to update resource" });
    }
  });
  app2.patch("/api/resources/:id/approve", authenticateJWT, async (req, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      if (!user || user.role !== "faculty" && user.role !== "admin") {
        return res.status(403).json({ message: "Insufficient permissions" });
      }
      const id = parseInt(req.params.id);
      const resource = await storage.approveResource(id, userId);
      res.json(resource);
    } catch (error) {
      console.error("Error approving resource:", error);
      res.status(500).json({ message: "Failed to approve resource" });
    }
  });
  app2.post("/api/resources/:id/download", authenticateJWT, async (req, res) => {
    try {
      const userId = req.user.id;
      const resourceId = parseInt(req.params.id);
      const resource = await storage.getResourceById(resourceId);
      if (!resource) {
        return res.status(404).json({ message: "Resource not found" });
      }
      if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      await storage.recordDownload({ resourceId, userId });
      res.json({ message: "Download recorded" });
    } catch (error) {
      console.error("Error recording download:", error);
      res.status(500).json({ message: "Failed to record download" });
    }
  });
  app2.get("/api/equipment", authenticateJWT, async (req, res) => {
    try {
      const equipment2 = await storage.getEquipment();
      res.json(equipment2);
    } catch (error) {
      console.error("Error fetching equipment:", error);
      res.status(500).json({ message: "Failed to fetch equipment" });
    }
  });
  app2.post("/api/equipment", authenticateJWT, async (req, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      if (!user || user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const validatedData = insertEquipmentSchema.parse(req.body);
      const equipment2 = await storage.createEquipment(validatedData);
      res.status(201).json(equipment2);
    } catch (error) {
      console.error("Error creating equipment:", error);
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid equipment data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create equipment" });
    }
  });
  app2.patch("/api/equipment/:id", authenticateJWT, async (req, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      if (!user || user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const id = parseInt(req.params.id);
      const updates = req.body;
      const equipment2 = await storage.updateEquipment(id, updates);
      res.json(equipment2);
    } catch (error) {
      console.error("Error updating equipment:", error);
      res.status(500).json({ message: "Failed to update equipment" });
    }
  });
  app2.put("/api/equipment/:id", authenticateJWT, async (req, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      if (!user || user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const id = parseInt(req.params.id);
      const updates = req.body;
      const equipment2 = await storage.updateEquipment(id, updates);
      res.json(equipment2);
    } catch (error) {
      console.error("Error updating equipment:", error);
      res.status(500).json({ message: "Failed to update equipment" });
    }
  });
  app2.delete("/api/equipment/:id", authenticateJWT, async (req, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      if (!user || user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const id = parseInt(req.params.id);
      await storage.deleteEquipment(id);
      res.json({ message: "Equipment deleted successfully" });
    } catch (error) {
      console.error("Error deleting equipment:", error);
      res.status(500).json({ message: "Failed to delete equipment" });
    }
  });
  app2.get("/api/bookings", authenticateJWT, async (req, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      let bookings2;
      if (user?.role === "admin") {
        bookings2 = await storage.getBookings();
      } else {
        bookings2 = await storage.getBookings(userId);
      }
      res.json(bookings2);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });
  app2.post("/api/bookings", authenticateJWT, async (req, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(403).json({ message: "User not found" });
      }
      const bookingData = {
        ...req.body,
        userId
      };
      const validatedData = insertBookingSchema.parse(bookingData);
      const booking = await storage.createBooking(validatedData);
      await storage.updateEquipment(booking.equipmentId, { status: "booked" });
      res.status(201).json(booking);
    } catch (error) {
      console.error("Error creating booking:", error);
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid booking data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create booking" });
    }
  });
  app2.patch("/api/bookings/:id", authenticateJWT, async (req, res) => {
    try {
      const userId = req.user.id;
      const bookingId = parseInt(req.params.id);
      const booking = await storage.getBookingById(bookingId);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      const user = await storage.getUser(userId);
      if (!user || booking.userId !== userId && user.role !== "admin") {
        return res.status(403).json({ message: "Insufficient permissions" });
      }
      const updatedBooking = await storage.updateBooking(bookingId, req.body);
      res.json(updatedBooking);
    } catch (error) {
      console.error("Error updating booking:", error);
      res.status(500).json({ message: "Failed to update booking" });
    }
  });
  app2.patch("/api/bookings/:id/approve", authenticateJWT, async (req, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      if (!user || user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const bookingId = parseInt(req.params.id);
      const booking = await storage.getBookingById(bookingId);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      const updatedBooking = await storage.updateBooking(bookingId, {
        status: "approved",
        approvedBy: userId,
        approvedAt: /* @__PURE__ */ new Date()
      });
      res.json(updatedBooking);
    } catch (error) {
      console.error("Error approving booking:", error);
      res.status(500).json({ message: "Failed to approve booking" });
    }
  });
  app2.patch("/api/bookings/:id/cancel", authenticateJWT, async (req, res) => {
    try {
      const userId = req.user.id;
      const bookingId = parseInt(req.params.id);
      const booking = await storage.getBookingById(bookingId);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      const user = await storage.getUser(userId);
      if (!user || booking.userId !== userId && user.role !== "admin") {
        return res.status(403).json({ message: "Insufficient permissions" });
      }
      const cancelledBooking = await storage.updateBooking(bookingId, {
        status: "cancelled"
      });
      await storage.updateEquipment(booking.equipmentId, { status: "available" });
      res.json(cancelledBooking);
    } catch (error) {
      console.error("Error cancelling booking:", error);
      res.status(500).json({ message: "Failed to cancel booking" });
    }
  });
  app2.get("/api/users", authenticateJWT, async (req, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      if (!user || user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const users2 = await storage.getAllUsers();
      res.json(users2);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });
  app2.post("/api/users", authenticateJWT, async (req, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      if (!user || user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const validatedData = apiRegisterUserSchema.parse(req.body);
      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists with this email" });
      }
      const hashedPassword = await hashPassword(validatedData.password || "defaultPassword123");
      const newUser = await storage.createUser({
        id: nanoid(),
        ...validatedData,
        password: hashedPassword,
        isActive: req.body.status === "Active" ? true : false
      });
      const { password, ...userResponse } = newUser;
      res.status(201).json(userResponse);
    } catch (error) {
      console.error("Error creating user:", error);
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create user" });
    }
  });
  app2.put("/api/users/:id", authenticateJWT, async (req, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      if (!user || user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const targetUserId = req.params.id;
      const targetUser = await storage.getUser(targetUserId);
      if (!targetUser) {
        return res.status(404).json({ message: "User not found" });
      }
      const updateData = { ...req.body };
      delete updateData.password;
      if (updateData.status) {
        updateData.isActive = updateData.status === "Active" ? true : false;
        delete updateData.status;
      }
      const updatedUser = await storage.updateUser(targetUserId, updateData);
      const { password, ...userResponse } = updatedUser;
      res.json(userResponse);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Failed to update user" });
    }
  });
  app2.get("/api/analytics/user", authenticateJWT, async (req, res) => {
    try {
      const userId = req.user.id;
      const stats = await storage.getUserStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching user stats:", error);
      res.status(500).json({ message: "Failed to fetch user stats" });
    }
  });
  app2.get("/api/analytics/system", authenticateJWT, async (req, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      if (!user || user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const stats = await storage.getSystemStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching system stats:", error);
      res.status(500).json({ message: "Failed to fetch system stats" });
    }
  });
  app2.post("/api/populate", async (req, res) => {
    try {
      await populateDatabase();
      res.json({ message: "Database populated successfully!" });
    } catch (error) {
      console.error("Error populating database:", error);
      res.status(500).json({ message: "Failed to populate database" });
    }
  });
  app2.use("/uploads", express.static(uploadsDir));
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express2 from "express";
import fs2 from "fs";
import path3 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path2 from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path2.resolve(import.meta.dirname, "client", "src"),
      "@shared": path2.resolve(import.meta.dirname, "shared"),
      "@assets": path2.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path2.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path2.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid as nanoid2 } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path3.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs2.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid2()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path3.resolve(import.meta.dirname, "public");
  if (!fs2.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express2.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path3.resolve(distPath, "index.html"));
  });
}

// server/createTestAccounts.ts
import { nanoid as nanoid3 } from "nanoid";
async function createTestAccounts() {
  console.log("Creating test accounts...");
  try {
    const adminPassword = await hashPassword("admin123");
    const adminId = nanoid3();
    const adminData = {
      id: adminId,
      email: "admin@university.edu",
      password: adminPassword,
      firstName: "System",
      lastName: "Administrator",
      role: "admin",
      matricNumber: "ADM001",
      department: "Information Technology"
    };
    const existingAdmin = await storage.getUserByEmail(adminData.email);
    if (!existingAdmin) {
      await storage.createUser(adminData);
      console.log("\u2713 Admin account created");
      console.log("  Email: admin@university.edu");
      console.log("  Password: admin123");
    } else {
      console.log("\u2713 Admin account already exists");
    }
    const studentPassword = await hashPassword("student123");
    const studentId = nanoid3();
    const studentData = {
      id: studentId,
      email: "student@university.edu",
      password: studentPassword,
      firstName: "John",
      lastName: "Doe",
      role: "student",
      matricNumber: "STU001",
      department: "Computer Science"
    };
    const existingStudent = await storage.getUserByEmail(studentData.email);
    if (!existingStudent) {
      await storage.createUser(studentData);
      console.log("\u2713 Student account created");
      console.log("  Email: student@university.edu");
      console.log("  Password: student123");
    } else {
      console.log("\u2713 Student account already exists");
    }
    const existingFaculty = await storage.getUserByEmail("faculty@university.edu");
    if (existingFaculty && existingFaculty.role === "faculty") {
      console.log("\u2713 Faculty account exists but will be treated as student role");
    }
    console.log("\nTest accounts ready for login!");
    console.log("\n=== LOGIN CREDENTIALS ===");
    console.log("Admin:");
    console.log("  Email: admin@university.edu");
    console.log("  Password: admin123");
    console.log("\nStudent:");
    console.log("  Email: student@university.edu");
    console.log("  Password: student123");
    console.log("========================\n");
  } catch (error) {
    console.error("Error creating test accounts:", error);
    throw error;
  }
}

// server/index.ts
import dotenv2 from "dotenv";
dotenv2.config();
var app = express3();
app.use(express3.json());
app.use(express3.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path4 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path4.startsWith("/api")) {
      let logLine = `${req.method} ${path4} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  try {
    await createTestAccounts();
  } catch (error) {
    console.error("Failed to create test accounts:", error);
  }
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
