import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  boolean,
  decimal,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table
export const users = pgTable("users", {
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
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Academic resources table
export const resources = pgTable("resources", {
  id: serial("id").primaryKey(),
  title: varchar("title").notNull(),
  description: text("description"),
  fileName: varchar("file_name").notNull(),
  fileUrl: varchar("file_url").notNull(),
  fileSize: integer("file_size"), // in bytes
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
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Equipment table
export const equipment = pgTable("equipment", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description"),
  status: varchar("status", { 
    enum: ["available", "booked", "unavailable"] 
  }).notNull().default("available"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Equipment bookings table
export const bookings = pgTable("bookings", {
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
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Resource downloads tracking
export const downloads = pgTable("downloads", {
  id: serial("id").primaryKey(),
  resourceId: integer("resource_id").notNull().references(() => resources.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  downloadedAt: timestamp("downloaded_at").defaultNow(),
});

// System analytics table
export const analytics = pgTable("analytics", {
  id: serial("id").primaryKey(),
  date: timestamp("date").notNull(),
  activeUsers: integer("active_users").default(0),
  totalLogins: integer("total_logins").default(0),
  resourcesUploaded: integer("resources_uploaded").default(0),
  resourcesDownloaded: integer("resources_downloaded").default(0),
  equipmentBookings: integer("equipment_bookings").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Define relations
export const usersRelations = relations(users, ({ many }) => ({
  uploadedResources: many(resources, { relationName: "uploader" }),
  approvedResources: many(resources, { relationName: "approver" }),
  bookings: many(bookings),
  downloads: many(downloads),
}));

export const resourcesRelations = relations(resources, ({ one, many }) => ({
  uploader: one(users, {
    fields: [resources.uploadedBy],
    references: [users.id],
    relationName: "uploader",
  }),
  approver: one(users, {
    fields: [resources.approvedBy],
    references: [users.id],
    relationName: "approver",
  }),
  downloads: many(downloads),
}));

export const equipmentRelations = relations(equipment, ({ many }) => ({
  bookings: many(bookings),
}));

export const bookingsRelations = relations(bookings, ({ one }) => ({
  equipment: one(equipment, {
    fields: [bookings.equipmentId],
    references: [equipment.id],
  }),
  user: one(users, {
    fields: [bookings.userId],
    references: [users.id],
  }),
  approver: one(users, {
    fields: [bookings.approvedBy],
    references: [users.id],
  }),
}));

export const downloadsRelations = relations(downloads, ({ one }) => ({
  resource: one(resources, {
    fields: [downloads.resourceId],
    references: [resources.id],
  }),
  user: one(users, {
    fields: [downloads.userId],
    references: [users.id],
  }),
}));

// Zod schemas
export const insertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true,
});

export const insertResourceSchema = createInsertSchema(resources).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  downloadCount: true,
  isApproved: true,
  approvedBy: true,
  approvedAt: true,
});

export const insertEquipmentSchema = createInsertSchema(equipment).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBookingSchema = z.object({
  equipmentId: z.number(),
  userId: z.string(),
  startTime: z.string().transform((val) => new Date(val)),
  endTime: z.string().transform((val) => new Date(val)),
  purpose: z.string().optional(),
  notes: z.string().optional(),
});

export const insertDownloadSchema = createInsertSchema(downloads).omit({
  id: true,
  downloadedAt: true,
});

// Authentication schemas
export const registerUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  isActive: true,
}).extend({
  confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// API registration schema without password confirmation
export const apiRegisterUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  isActive: true,
});

export const loginUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// Types
export type UpsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type RegisterUser = z.infer<typeof registerUserSchema>;
export type LoginUser = z.infer<typeof loginUserSchema>;
export type InsertResource = z.infer<typeof insertResourceSchema>;
export type Resource = typeof resources.$inferSelect;
export type InsertEquipment = z.infer<typeof insertEquipmentSchema>;
export type Equipment = typeof equipment.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookings.$inferSelect;
export type InsertDownload = z.infer<typeof insertDownloadSchema>;
export type Download = typeof downloads.$inferSelect;
export type Analytics = typeof analytics.$inferSelect;
