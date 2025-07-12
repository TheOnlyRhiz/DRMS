import { storage } from "./storage";
import { hashPassword } from "./jwtAuth";
import { nanoid } from "nanoid";

export async function createTestAccounts() {
  console.log("Creating test accounts...");

  try {
    // Admin account
    const adminPassword = await hashPassword("admin123");
    const adminId = nanoid();
    
    const adminData = {
      id: adminId,
      email: "admin@university.edu",
      password: adminPassword,
      firstName: "System",
      lastName: "Administrator",
      role: "admin" as const,
      matricNumber: "ADM001",
      department: "Information Technology",
    };

    // Check if admin already exists
    const existingAdmin = await storage.getUserByEmail(adminData.email);
    if (!existingAdmin) {
      await storage.createUser(adminData);
      console.log("✓ Admin account created");
      console.log("  Email: admin@university.edu");
      console.log("  Password: admin123");
    } else {
      console.log("✓ Admin account already exists");
    }

    // Student account
    const studentPassword = await hashPassword("student123");
    const studentId = nanoid();
    
    const studentData = {
      id: studentId,
      email: "student@university.edu",
      password: studentPassword,
      firstName: "John",
      lastName: "Doe",
      role: "student" as const,
      matricNumber: "STU001",
      department: "Computer Science",
    };

    // Check if student already exists
    const existingStudent = await storage.getUserByEmail(studentData.email);
    if (!existingStudent) {
      await storage.createUser(studentData);
      console.log("✓ Student account created");
      console.log("  Email: student@university.edu");
      console.log("  Password: student123");
    } else {
      console.log("✓ Student account already exists");
    }

    // Update any existing faculty accounts to student role
    const existingFaculty = await storage.getUserByEmail("faculty@university.edu");
    if (existingFaculty && existingFaculty.role === "faculty") {
      // Note: In a real system, you'd implement an update user method
      console.log("✓ Faculty account exists but will be treated as student role");
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