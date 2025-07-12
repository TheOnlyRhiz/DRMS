import { storage } from "./storage";

const realCourses = [
  "Computer Science",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
  "History",
  "Economics",
  "Statistics",
  "Software Engineering"
];

const resourceTitles = [
  // Computer Science
  "Data Structures and Algorithms Comprehensive Guide",
  "Object-Oriented Programming Principles",
  "Database Management Systems Tutorial",
  "Web Development Best Practices",
  "Machine Learning Fundamentals",
  "Network Security Essentials",
  "Software Testing Methodologies",
  "Artificial Intelligence Introduction",
  // Mathematics
  "Calculus Problem Solving Techniques",
  "Linear Algebra Applications",
  "Discrete Mathematics for Computer Science",
  "Statistical Methods in Research",
  "Advanced Mathematical Modeling",
  "Number Theory and Cryptography",
  // Physics
  "Quantum Mechanics Laboratory Manual",
  "Classical Mechanics Equations",
  "Thermodynamics Experimental Procedures",
  "Electromagnetic Theory Applications",
  // Chemistry
  "Organic Chemistry Reaction Mechanisms",
  "Analytical Chemistry Laboratory Techniques",
  "Physical Chemistry Calculations",
  // Biology
  "Molecular Biology Research Methods",
  "Genetics and Heredity Studies",
  "Cell Biology Microscopy Techniques",
  // Other subjects
  "Academic Writing Guidelines",
  "Research Methodology Handbook",
  "Presentation Skills for Students",
  "Time Management for Academic Success"
];

const categories = [
  "lecture_notes",
  "assignment",
  "textbook",
  "research_paper",
  "tutorial",
  "exam_preparation",
  "laboratory_manual",
  "presentation"
];

const fileTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation"
];

const descriptions = [
  "Comprehensive study material covering all essential topics with practical examples and exercises.",
  "Detailed explanations with step-by-step solutions and real-world applications.",
  "Essential reading material for understanding key concepts and theories.",
  "Complete guide with illustrations, diagrams, and interactive examples.",
  "Advanced material for in-depth understanding and research purposes.",
  "Practical handbook with hands-on exercises and problem-solving techniques.",
  "Updated content reflecting current industry standards and best practices.",
  "Collaborative study resource developed by faculty and peer reviewers."
];

const academicYears = ["2023-2024", "2024-2025"];

const equipmentItems = [
  {
    name: "Dell OptiPlex Desktop Computer",
    description: "High-performance desktop computer for academic projects and research",
    category: "computers",
    isAvailable: true,
    specifications: "Intel i7, 16GB RAM, 512GB SSD, Windows 11",
    location: "Computer Lab A"
  },
  {
    name: "MacBook Pro 14-inch",
    description: "Premium laptop for software development and design work",
    category: "laptops",
    isAvailable: true,
    specifications: "Apple M2 Pro, 16GB RAM, 512GB SSD",
    location: "Mobile Computing Center"
  },
  {
    name: "HP LaserJet Pro Printer",
    description: "High-speed laser printer for documents and reports",
    category: "printers",
    isAvailable: true,
    specifications: "Duplex printing, 30 ppm, Network enabled",
    location: "Printing Station"
  },
  {
    name: "Digital Oscilloscope",
    description: "Advanced oscilloscope for electrical engineering experiments",
    category: "lab_equipment",
    isAvailable: true,
    specifications: "4-channel, 100MHz bandwidth, Digital storage",
    location: "Electronics Lab"
  },
  {
    name: "Microscope with Camera",
    description: "High-resolution microscope for biological research",
    category: "lab_equipment",
    isAvailable: false,
    specifications: "1000x magnification, Digital imaging, LED illumination",
    location: "Biology Lab"
  },
  {
    name: "3D Printer",
    description: "Professional 3D printer for prototyping and projects",
    category: "manufacturing",
    isAvailable: true,
    specifications: "FDM technology, 220x220x250mm build volume",
    location: "Maker Space"
  },
  {
    name: "Arduino Development Kit",
    description: "Complete kit for microcontroller programming projects",
    category: "electronics",
    isAvailable: true,
    specifications: "Arduino Uno, sensors, actuators, breadboard",
    location: "Electronics Lab"
  },
  {
    name: "Projector - BenQ MW632ST",
    description: "Short-throw projector for presentations and lectures",
    category: "av_equipment",
    isAvailable: true,
    specifications: "3200 lumens, WXGA resolution, HDMI/VGA inputs",
    location: "Conference Room B"
  }
];

export async function populateRealData() {
  try {
    console.log("🌱 Starting to populate real educational data...");

    // Get existing users to assign as uploaders
    const adminUser = await storage.getUserByEmail("admin@university.edu");
    const studentUser = await storage.getUserByEmail("student@university.edu");
    
    if (!adminUser || !studentUser) {
      throw new Error("Required test users not found");
    }

    const uploaders = [adminUser.id, studentUser.id];

    // Create realistic resources
    console.log("📚 Creating educational resources...");
    const resourcePromises = resourceTitles.slice(0, 20).map(async (title, index) => {
      const course = realCourses[index % realCourses.length];
      const category = categories[index % categories.length];
      const fileType = fileTypes[index % fileTypes.length];
      const description = descriptions[index % descriptions.length];
      const uploader = uploaders[index % uploaders.length];
      const academicYear = academicYears[index % academicYears.length];

      const fileName = `${title.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '')}.pdf`;
      const fileSize = Math.floor(Math.random() * 5000000) + 100000; // 100KB to 5MB

      return storage.createResource({
        title,
        description,
        fileName,
        fileUrl: `/uploads/${fileName}`,
        fileSize,
        fileType,
        category: category as any,
        course,
        academicYear,
        uploadedBy: uploader,
      });
    });

    await Promise.all(resourcePromises);
    console.log(`✅ Created ${resourceTitles.slice(0, 20).length} educational resources`);

    // Create equipment
    console.log("🔧 Creating equipment inventory...");
    const equipmentPromises = equipmentItems.map(async (item) => {
      return storage.createEquipment({
        name: item.name,
        description: item.description,
        category: item.category as any,
        isAvailable: item.isAvailable,
        specifications: item.specifications,
        location: item.location,
      });
    });

    await Promise.all(equipmentPromises);
    console.log(`✅ Created ${equipmentItems.length} equipment items`);

    // Create sample bookings
    console.log("📅 Creating sample bookings...");
    const now = new Date();
    const bookings = [
      {
        equipmentId: 1,
        userId: studentUser.id,
        startTime: new Date(now.getTime() + 24 * 60 * 60 * 1000), // Tomorrow
        endTime: new Date(now.getTime() + 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // +2 hours
        purpose: "Software development project for CSC 301",
        status: "approved" as any,
      },
      {
        equipmentId: 4,
        userId: adminUser.id,
        startTime: new Date(now.getTime() + 48 * 60 * 60 * 1000), // Day after tomorrow
        endTime: new Date(now.getTime() + 48 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000), // +3 hours
        purpose: "Electronics lab experiment demonstration",
        status: "approved" as any,
      },
      {
        equipmentId: 2,
        userId: studentUser.id,
        startTime: new Date(now.getTime() + 72 * 60 * 60 * 1000), // 3 days from now
        endTime: new Date(now.getTime() + 72 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000), // +4 hours
        purpose: "Mobile app development and testing",
        status: "pending" as any,
      }
    ];

    const bookingPromises = bookings.map(booking => storage.createBooking(booking));
    await Promise.all(bookingPromises);
    console.log(`✅ Created ${bookings.length} equipment bookings`);

    // Create download records for analytics
    console.log("📊 Creating download analytics...");
    const downloadPromises = [];
    for (let i = 1; i <= 10; i++) {
      downloadPromises.push(
        storage.recordDownload({
          resourceId: i,
          userId: Math.random() > 0.5 ? adminUser.id : studentUser.id,
        })
      );
    }
    await Promise.all(downloadPromises);
    console.log(`✅ Created download records for analytics`);

    console.log("🎉 Real educational data population completed successfully!");
    
  } catch (error) {
    console.error("❌ Error populating real data:", error);
    throw error;
  }
}