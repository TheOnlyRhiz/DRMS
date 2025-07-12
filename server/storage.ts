import {
  users,
  resources,
  equipment,
  bookings,
  downloads,
  analytics,
  type User,
  type UpsertUser,
  type Resource,
  type InsertResource,
  type Equipment,
  type InsertEquipment,
  type Booking,
  type InsertBooking,
  type Download,
  type InsertDownload,
  type Analytics,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, lte, count, sql } from "drizzle-orm";

export interface IStorage {
  // User operations (JWT Auth)
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  createUser(user: UpsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Resource operations
  getResources(filters?: { category?: string; course?: string; search?: string; uploadedBy?: string }): Promise<Resource[]>;
  getResourceById(id: number): Promise<Resource | undefined>;
  createResource(resource: InsertResource): Promise<Resource>;
  updateResource(id: number, updates: Partial<Resource>): Promise<Resource>;
  deleteResource(id: number): Promise<void>;
  approveResource(id: number, approvedBy: string): Promise<Resource>;
  
  // Equipment operations
  getEquipment(): Promise<Equipment[]>;
  getEquipmentById(id: number): Promise<Equipment | undefined>;
  createEquipment(equipment: InsertEquipment): Promise<Equipment>;
  updateEquipment(id: number, updates: Partial<Equipment>): Promise<Equipment>;
  deleteEquipment(id: number): Promise<void>;
  
  // Booking operations
  getBookings(userId?: string): Promise<Booking[]>;
  getBookingById(id: number): Promise<Booking | undefined>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBooking(id: number, updates: Partial<Booking>): Promise<Booking>;
  cancelBooking(id: number): Promise<Booking>;
  
  // Download tracking
  recordDownload(download: InsertDownload): Promise<Download>;
  getDownloadHistory(userId: string): Promise<Download[]>;
  
  // Analytics
  getAnalytics(startDate?: Date, endDate?: Date): Promise<Analytics[]>;
  getUserStats(userId: string): Promise<{
    resourcesUploaded: number;
    resourcesDownloaded: number;
    activeBookings: number;
  }>;
  getSystemStats(): Promise<{
    totalUsers: number;
    totalResources: number;
    totalEquipment: number;
    activeBookings: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    const dbUsers = await db.select().from(users).orderBy(desc(users.createdAt));
    // Transform isActive to status for frontend compatibility
    return dbUsers.map(user => ({
      ...user,
      status: user.isActive ? 'Active' : 'Disabled'
    }));
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async createUser(userData: UpsertUser): Promise<User> {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getResources(filters?: { category?: string; course?: string; search?: string; uploadedBy?: string }): Promise<Resource[]> {
    const conditions = [];
    
    // If filtering by uploadedBy, don't require approval (user can see their own resources)
    if (!filters?.uploadedBy) {
      conditions.push(eq(resources.isApproved, true));
    }
    
    if (filters?.category) {
      conditions.push(eq(resources.category, filters.category as any));
    }
    
    if (filters?.course) {
      conditions.push(eq(resources.course, filters.course));
    }

    if (filters?.uploadedBy) {
      conditions.push(eq(resources.uploadedBy, filters.uploadedBy));
    }
    
    return await db.select().from(resources).where(and(...conditions)).orderBy(desc(resources.createdAt));
  }

  async getResourceById(id: number): Promise<Resource | undefined> {
    const [resource] = await db.select().from(resources).where(eq(resources.id, id));
    return resource;
  }

  async createResource(resource: InsertResource): Promise<Resource> {
    // Auto-approve resources for better user experience in educational settings
    const resourceWithApproval = {
      ...resource,
      isApproved: true,
      approvedAt: new Date(),
    };
    const [newResource] = await db.insert(resources).values(resourceWithApproval).returning();
    return newResource;
  }

  async updateResource(id: number, updates: Partial<Resource>): Promise<Resource> {
    const [updatedResource] = await db
      .update(resources)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(resources.id, id))
      .returning();
    return updatedResource;
  }

  async deleteResource(id: number): Promise<void> {
    await db.delete(resources).where(eq(resources.id, id));
  }

  async approveResource(id: number, approvedBy: string): Promise<Resource> {
    const [approvedResource] = await db
      .update(resources)
      .set({
        isApproved: true,
        approvedBy,
        approvedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(resources.id, id))
      .returning();
    return approvedResource;
  }

  async getEquipment(): Promise<Equipment[]> {
    return await db.select().from(equipment);
  }

  async getEquipmentById(id: number): Promise<Equipment | undefined> {
    const [item] = await db.select().from(equipment).where(eq(equipment.id, id));
    return item;
  }

  async createEquipment(equipmentData: InsertEquipment): Promise<Equipment> {
    const [newEquipment] = await db.insert(equipment).values(equipmentData).returning();
    return newEquipment;
  }

  async updateEquipment(id: number, updates: Partial<Equipment>): Promise<Equipment> {
    // Remove any timestamp fields from updates to avoid conflicts
    const { createdAt, updatedAt, ...cleanUpdates } = updates;
    
    const [updatedEquipment] = await db
      .update(equipment)
      .set({ ...cleanUpdates, updatedAt: new Date() })
      .where(eq(equipment.id, id))
      .returning();
    return updatedEquipment;
  }

  async deleteEquipment(id: number): Promise<void> {
    await db.delete(equipment).where(eq(equipment.id, id));
  }

  async getBookings(userId?: string): Promise<Booking[]> {
    if (userId) {
      return await db.select().from(bookings).where(eq(bookings.userId, userId)).orderBy(desc(bookings.createdAt));
    }
    
    return await db.select().from(bookings).orderBy(desc(bookings.createdAt));
  }

  async getBookingById(id: number): Promise<Booking | undefined> {
    const [booking] = await db.select().from(bookings).where(eq(bookings.id, id));
    return booking;
  }

  async createBooking(booking: InsertBooking): Promise<Booking> {
    const [newBooking] = await db.insert(bookings).values(booking).returning();
    return newBooking;
  }

  async updateBooking(id: number, updates: Partial<Booking>): Promise<Booking> {
    const [updatedBooking] = await db
      .update(bookings)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(bookings.id, id))
      .returning();
    return updatedBooking;
  }

  async cancelBooking(id: number): Promise<Booking> {
    const [cancelledBooking] = await db
      .update(bookings)
      .set({ status: "cancelled", updatedAt: new Date() })
      .where(eq(bookings.id, id))
      .returning();
    return cancelledBooking;
  }

  async recordDownload(download: InsertDownload): Promise<Download> {
    // Record the download
    const [newDownload] = await db.insert(downloads).values(download).returning();
    
    // Increment download count
    await db
      .update(resources)
      .set({
        downloadCount: sql`${resources.downloadCount} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(resources.id, download.resourceId));
    
    return newDownload;
  }

  async getDownloadHistory(userId: string): Promise<Download[]> {
    return await db
      .select()
      .from(downloads)
      .where(eq(downloads.userId, userId))
      .orderBy(desc(downloads.downloadedAt));
  }

  async getAnalytics(startDate?: Date, endDate?: Date): Promise<Analytics[]> {
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

  async getUserStats(userId: string): Promise<{
    resourcesUploaded: number;
    resourcesDownloaded: number;
    activeBookings: number;
  }> {
    const [uploadedCount] = await db
      .select({ count: count() })
      .from(resources)
      .where(eq(resources.uploadedBy, userId));

    const [downloadedCount] = await db
      .select({ count: count() })
      .from(downloads)
      .where(eq(downloads.userId, userId));

    const activeBookings = await db
      .select()
      .from(bookings)
      .where(
        and(
          eq(bookings.userId, userId),
          sql`${bookings.status} = 'approved'`
        )
      );
    const activeBookingsCount = { count: activeBookings.length };

    return {
      resourcesUploaded: uploadedCount.count,
      resourcesDownloaded: downloadedCount.count,
      activeBookings: activeBookingsCount.count,
    };
  }

  async getSystemStats(): Promise<{
    totalUsers: number;
    totalResources: number;
    totalEquipment: number;
    activeBookings: number;
  }> {
    const [userCount] = await db.select({ count: count() }).from(users);
    const [resourceCount] = await db.select({ count: count() }).from(resources);
    const [equipmentCount] = await db.select({ count: count() }).from(equipment);
    const activeBookings = await db
      .select()
      .from(bookings)
      .where(sql`${bookings.status} = 'approved'`);
    const activeBookingsCount = { count: activeBookings.length };

    return {
      totalUsers: userCount.count,
      totalResources: resourceCount.count,
      totalEquipment: equipmentCount.count,
      activeBookings: activeBookingsCount.count,
    };
  }
}

export const storage = new DatabaseStorage();
