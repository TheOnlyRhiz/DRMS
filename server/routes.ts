import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { authenticateJWT, requireRole, generateToken, hashPassword, comparePassword } from "./jwtAuth";
import { populateDatabase } from "./populateData";
import { 
  insertResourceSchema, 
  insertBookingSchema, 
  insertDownloadSchema, 
  insertEquipmentSchema,
  registerUserSchema,
  apiRegisterUserSchema,
  loginUserSchema
} from "@shared/schema";
import { z } from "zod";
import multer from "multer";
import path from "path";
import fs from "fs";
import { nanoid } from "nanoid";

// Configure multer for file uploads
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const upload = multer({
  dest: uploadsDir,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
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
      "application/xml",
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type: ${file.mimetype}. Supported formats: PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, TXT, CSV, RTF, images (JPG, PNG, GIF, etc.), ZIP, RAR, JSON, HTML, XML.`));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // JWT Auth routes
  app.post('/api/auth/register', async (req, res) => {
    try {
      const validatedData = apiRegisterUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists with this email" });
      }

      // Hash password and create user
      const hashedPassword = await hashPassword(validatedData.password);
      const userId = nanoid();
      
      const userData = {
        id: userId,
        email: validatedData.email,
        password: hashedPassword,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        role: validatedData.role || 'student',
        matricNumber: validatedData.matricNumber,
        department: validatedData.department || 'Computer Science',
      };

      const user = await storage.createUser(userData);
      
      // Generate JWT token
      const token = generateToken({
        userId: user.id,
        email: user.email,
        role: user.role as 'student' | 'faculty' | 'admin'
      });

      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      res.status(201).json({ user: userWithoutPassword, token });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(400).json({ message: "Registration failed", error: error.message });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = loginUserSchema.parse(req.body);
      
      // Find user by email
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Check if user is active
      if (!user.isActive) {
        return res.status(401).json({ message: "Account is disabled. Please contact an administrator." });
      }

      // Verify password
      const isValidPassword = await comparePassword(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Generate JWT token
      const token = generateToken({
        userId: user.id,
        email: user.email,
        role: user.role as 'student' | 'faculty' | 'admin'
      });

      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword, token });
    } catch (error) {
      console.error("Login error:", error);
      res.status(400).json({ message: "Login failed", error: error.message });
    }
  });

  // Get current user
  app.get('/api/auth/user', authenticateJWT, async (req: any, res) => {
    try {
      const { password: _, ...userWithoutPassword } = req.user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Change password
  app.put('/api/auth/change-password', authenticateJWT, async (req: any, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: "Current password and new password are required" });
      }

      // Get current user from database
      const user = await storage.getUser(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Verify current password
      const isValidPassword = await comparePassword(currentPassword, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Current password is incorrect" });
      }

      // Hash new password
      const hashedNewPassword = await hashPassword(newPassword);
      
      // Update password in database
      await storage.updateUser(user.id, { password: hashedNewPassword });

      res.json({ message: "Password changed successfully" });
    } catch (error) {
      console.error("Password change error:", error);
      res.status(500).json({ message: "Failed to change password" });
    }
  });

  // Resource routes
  app.get("/api/resources", authenticateJWT, async (req, res) => {
    try {
      const { category, course, search } = req.query;
      const resources = await storage.getResources({
        category: category as string,
        course: course as string,
        search: search as string,
      });
      res.json(resources);
    } catch (error) {
      console.error("Error fetching resources:", error);
      res.status(500).json({ message: "Failed to fetch resources" });
    }
  });

  app.get("/api/resources/my", authenticateJWT, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const resources = await storage.getResources({ uploadedBy: userId });
      res.json(resources);
    } catch (error) {
      console.error("Error fetching user resources:", error);
      res.status(500).json({ message: "Failed to fetch user resources" });
    }
  });

  app.get("/api/resources/:id", authenticateJWT, async (req, res) => {
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

  app.post("/api/resources", authenticateJWT, upload.single("file"), async (req: any, res) => {
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
        fileType: file.mimetype,
      };

      const validatedData = insertResourceSchema.parse(resourceData);
      const resource = await storage.createResource(validatedData);
      
      res.status(201).json(resource);
    } catch (error) {
      console.error("Error creating resource:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid resource data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create resource" });
    }
  });

  app.patch("/api/resources/:id", authenticateJWT, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      
      if (!user || (user.role !== "faculty" && user.role !== "admin")) {
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

  app.patch("/api/resources/:id/approve", authenticateJWT, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      
      if (!user || (user.role !== "faculty" && user.role !== "admin")) {
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

  // Download tracking
  app.post("/api/resources/:id/download", async (req: any, res) => {
    try {
      const userId = req.user?.id || null;
      const resourceId = parseInt(req.params.id);

      const resource = await storage.getResourceById(resourceId);
      if (!resource) {
        return res.status(404).json({ message: "Resource not found" });
      }

      if (userId) {
        await storage.recordDownload({ resourceId, userId });
      }
      res.json({ message: "Download recorded" });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error recording download:", error.message);
      } else {
        console.error("Error recording download:", error);
      }
      res.status(500).json({ message: "Failed to record download" });
    }
  });

  // Equipment routes
  app.get("/api/equipment", authenticateJWT, async (req, res) => {
    try {
      const equipment = await storage.getEquipment();
      res.json(equipment);
    } catch (error) {
      console.error("Error fetching equipment:", error);
      res.status(500).json({ message: "Failed to fetch equipment" });
    }
  });

  app.post("/api/equipment", authenticateJWT, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      
      if (!user || user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }

      const validatedData = insertEquipmentSchema.parse(req.body);
      const equipment = await storage.createEquipment(validatedData);
      res.status(201).json(equipment);
    } catch (error) {
      console.error("Error creating equipment:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid equipment data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create equipment" });
    }
  });

  app.patch("/api/equipment/:id", authenticateJWT, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      
      if (!user || user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }

      const id = parseInt(req.params.id);
      const updates = req.body;
      
      const equipment = await storage.updateEquipment(id, updates);
      res.json(equipment);
    } catch (error) {
      console.error("Error updating equipment:", error);
      res.status(500).json({ message: "Failed to update equipment" });
    }
  });

  app.put("/api/equipment/:id", authenticateJWT, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      
      if (!user || user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }

      const id = parseInt(req.params.id);
      const updates = req.body;
      
      const equipment = await storage.updateEquipment(id, updates);
      res.json(equipment);
    } catch (error) {
      console.error("Error updating equipment:", error);
      res.status(500).json({ message: "Failed to update equipment" });
    }
  });

  app.delete("/api/equipment/:id", authenticateJWT, async (req: any, res) => {
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

  // Booking routes
  app.get("/api/bookings", authenticateJWT, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      
      let bookings;
      if (user?.role === "admin") {
        bookings = await storage.getBookings();
      } else {
        bookings = await storage.getBookings(userId);
      }
      
      res.json(bookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });

  app.post("/api/bookings", authenticateJWT, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(403).json({ message: "User not found" });
      }

      const bookingData = {
        ...req.body,
        userId,
      };

      const validatedData = insertBookingSchema.parse(bookingData);
      const booking = await storage.createBooking(validatedData);
      
      // Update equipment status to 'booked' when student books it
      await storage.updateEquipment(booking.equipmentId, { status: 'booked' });
      
      res.status(201).json(booking);
    } catch (error) {
      console.error("Error creating booking:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid booking data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create booking" });
    }
  });

  app.patch("/api/bookings/:id", authenticateJWT, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const bookingId = parseInt(req.params.id);
      const booking = await storage.getBookingById(bookingId);
      
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      const user = await storage.getUser(userId);
      if (!user || (booking.userId !== userId && user.role !== "admin")) {
        return res.status(403).json({ message: "Insufficient permissions" });
      }

      const updatedBooking = await storage.updateBooking(bookingId, req.body);
      res.json(updatedBooking);
    } catch (error) {
      console.error("Error updating booking:", error);
      res.status(500).json({ message: "Failed to update booking" });
    }
  });

  app.patch("/api/bookings/:id/approve", authenticateJWT, async (req: any, res) => {
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
        approvedAt: new Date(),
      });

      res.json(updatedBooking);
    } catch (error) {
      console.error("Error approving booking:", error);
      res.status(500).json({ message: "Failed to approve booking" });
    }
  });

  app.patch("/api/bookings/:id/cancel", authenticateJWT, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const bookingId = parseInt(req.params.id);
      const booking = await storage.getBookingById(bookingId);
      
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      const user = await storage.getUser(userId);
      // Students can cancel their own bookings, admins can cancel any booking
      if (!user || (booking.userId !== userId && user.role !== "admin")) {
        return res.status(403).json({ message: "Insufficient permissions" });
      }

      const cancelledBooking = await storage.updateBooking(bookingId, {
        status: "cancelled",
      });

      // Update equipment status back to available when booking is cancelled
      await storage.updateEquipment(booking.equipmentId, { status: 'available' });

      res.json(cancelledBooking);
    } catch (error) {
      console.error("Error cancelling booking:", error);
      res.status(500).json({ message: "Failed to cancel booking" });
    }
  });

  // User management routes (Admin only)
  app.get("/api/users", authenticateJWT, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      
      if (!user || user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      
      // Get all users from database
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.post("/api/users", authenticateJWT, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      
      if (!user || user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      
      const validatedData = apiRegisterUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists with this email" });
      }

      // Hash password
      const hashedPassword = await hashPassword(validatedData.password || 'defaultPassword123');
      
      const newUser = await storage.createUser({
        id: nanoid(),
        ...validatedData,
        password: hashedPassword,
        isActive: req.body.status === 'Active' ? true : false
      });
      
      // Remove password from response
      const { password, ...userResponse } = newUser;
      res.status(201).json(userResponse);
    } catch (error) {
      console.error("Error creating user:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  app.put("/api/users/:id", authenticateJWT, async (req: any, res) => {
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
      delete updateData.password; // Don't allow password updates through this route
      
      // Convert status to isActive boolean
      if (updateData.status) {
        updateData.isActive = updateData.status === 'Active' ? true : false;
        delete updateData.status;
      }
      
      const updatedUser = await storage.updateUser(targetUserId, updateData);
      
      // Remove password from response
      const { password, ...userResponse } = updatedUser;
      res.json(userResponse);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  // Analytics routes
  app.get("/api/analytics/user", authenticateJWT, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const stats = await storage.getUserStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching user stats:", error);
      res.status(500).json({ message: "Failed to fetch user stats" });
    }
  });

  app.get("/api/analytics/system", authenticateJWT, async (req: any, res) => {
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

  // Populate database with sample data (development only)
  app.post("/api/populate", async (req, res) => {
    try {
      await populateDatabase();
      res.json({ message: "Database populated successfully!" });
    } catch (error) {
      console.error("Error populating database:", error);
      res.status(500).json({ message: "Failed to populate database" });
    }
  });

  // Serve uploaded files
  app.use("/uploads", express.static(uploadsDir));

  const httpServer = createServer(app);
  return httpServer;
}
