import { db } from './db';
import { resources, equipment, users } from '@shared/schema';
import { eq } from 'drizzle-orm';

export async function seedDatabase() {
  try {
    console.log('Seeding database with sample data...');

    // Sample academic resources
    const sampleResources = [
      {
        title: 'Introduction to Computer Science - Lecture Notes',
        description: 'Comprehensive lecture notes covering fundamental concepts in computer science including algorithms, data structures, and programming paradigms.',
        category: 'lecture_notes' as const,
        fileType: 'application/pdf',
        course: 'CS 101',
        fileUrl: '/uploads/cs101-lecture-notes.pdf',
        fileName: 'cs101-lecture-notes.pdf',
        fileSize: 2457600,
        uploadedBy: 'faculty-user-1',
        isApproved: true,
        approvedBy: 'admin-user-1',
        tags: ['computer science', 'algorithms', 'programming', 'fundamentals']
      },
      {
        title: 'Advanced Mathematics Problem Sets',
        description: 'Collection of challenging mathematical problems with detailed solutions covering calculus, linear algebra, and differential equations.',
        category: 'Problem Sets',
        course: 'MATH 301',
        fileUrl: '/uploads/math301-problems.pdf',
        fileName: 'math301-problems.pdf',
        fileSize: 1843200,
        uploadedBy: 'faculty-user-2',
        approved: true,
        approvedBy: 'admin-user-1',
        tags: ['mathematics', 'calculus', 'linear algebra', 'differential equations']
      },
      {
        title: 'Physics Laboratory Manual',
        description: 'Complete laboratory manual for undergraduate physics experiments including mechanics, thermodynamics, and electromagnetism.',
        category: 'Lab Manual',
        course: 'PHYS 201',
        fileUrl: '/uploads/physics-lab-manual.pdf',
        fileName: 'physics-lab-manual.pdf',
        fileSize: 3276800,
        uploadedBy: 'faculty-user-3',
        approved: true,
        approvedBy: 'admin-user-1',
        tags: ['physics', 'laboratory', 'experiments', 'mechanics']
      },
      {
        title: 'Data Structures and Algorithms Textbook',
        description: 'Comprehensive textbook covering advanced data structures, algorithm analysis, and implementation techniques with practical examples.',
        category: 'Textbook',
        course: 'CS 250',
        fileUrl: '/uploads/dsa-textbook.pdf',
        fileName: 'dsa-textbook.pdf',
        fileSize: 5242880,
        uploadedBy: 'faculty-user-1',
        approved: true,
        approvedBy: 'admin-user-1',
        tags: ['data structures', 'algorithms', 'computer science', 'programming']
      },
      {
        title: 'Chemistry Research Papers Collection',
        description: 'Curated collection of recent research papers in organic chemistry, including synthesis methods and reaction mechanisms.',
        category: 'Research Papers',
        course: 'CHEM 350',
        fileUrl: '/uploads/chemistry-research.pdf',
        fileName: 'chemistry-research.pdf',
        fileSize: 4194304,
        uploadedBy: 'faculty-user-4',
        approved: true,
        approvedBy: 'admin-user-1',
        tags: ['chemistry', 'research', 'organic chemistry', 'synthesis']
      },
      {
        title: 'Statistical Analysis Software Tutorial',
        description: 'Step-by-step tutorial for using statistical software packages including R, SPSS, and Python for data analysis.',
        category: 'Tutorial',
        course: 'STAT 200',
        fileUrl: '/uploads/stats-tutorial.pdf',
        fileName: 'stats-tutorial.pdf',
        fileSize: 2621440,
        uploadedBy: 'faculty-user-2',
        approved: true,
        approvedBy: 'admin-user-1',
        tags: ['statistics', 'software', 'data analysis', 'tutorial']
      },
      {
        title: 'English Literature Essay Collection',
        description: 'Collection of exemplary student essays analyzing classic works of English literature with detailed commentary.',
        category: 'Essays',
        course: 'ENG 250',
        fileUrl: '/uploads/literature-essays.pdf',
        fileName: 'literature-essays.pdf',
        fileSize: 1572864,
        uploadedBy: 'faculty-user-5',
        approved: true,
        approvedBy: 'admin-user-1',
        tags: ['literature', 'essays', 'analysis', 'writing']
      },
      {
        title: 'Database Design Principles',
        description: 'Comprehensive guide to database design principles including normalization, entity-relationship modeling, and query optimization.',
        category: 'Study Guide',
        course: 'CS 340',
        fileUrl: '/uploads/database-design.pdf',
        fileName: 'database-design.pdf',
        fileSize: 2097152,
        uploadedBy: 'faculty-user-1',
        approved: false,
        tags: ['database', 'design', 'normalization', 'sql']
      }
    ];

    // Sample departmental equipment
    const sampleEquipment = [
      {
        name: 'High-Performance Computing Cluster',
        description: 'Multi-node computing cluster with 128 cores, 512GB RAM, and GPU acceleration for computational research and parallel processing.',
        category: 'Computing',
        location: 'Room 301, Computer Science Building',
        status: 'available',
        specifications: {
          'CPU': '2x Intel Xeon Gold 6248R (48 cores total)',
          'Memory': '512GB DDR4 ECC',
          'Storage': '4TB NVMe SSD',
          'GPU': 'NVIDIA A100 40GB',
          'Network': '10 Gigabit Ethernet'
        },
        maintenanceSchedule: 'First Sunday of each month, 2:00 AM - 6:00 AM',
        bookingInstructions: 'Requires faculty approval. Maximum booking duration: 72 hours. Must submit job description and resource requirements.'
      },
      {
        name: 'Digital Microscope System',
        description: 'Advanced digital microscope with 4K imaging capabilities, automated focus, and specimen analysis software for biological research.',
        category: 'Laboratory',
        location: 'Room 205, Biology Laboratory',
        status: 'available',
        specifications: {
          'Magnification': '40x - 1000x',
          'Resolution': '4K (3840x2160)',
          'Illumination': 'LED with adjustable intensity',
          'Software': 'Image analysis and measurement tools',
          'Connectivity': 'USB 3.0, Ethernet'
        },
        maintenanceSchedule: 'Weekly calibration on Fridays, 5:00 PM - 6:00 PM',
        bookingInstructions: 'Available for 2-hour slots. Training session required before first use. Contact lab coordinator for scheduling.'
      },
      {
        name: '3D Printer (Industrial Grade)',
        description: 'Professional-grade 3D printer capable of printing with various materials including PLA, ABS, PETG, and engineering plastics.',
        category: 'Manufacturing',
        location: 'Room 150, Engineering Workshop',
        status: 'maintenance',
        specifications: {
          'Build Volume': '300mm x 300mm x 400mm',
          'Layer Resolution': '0.1mm - 0.4mm',
          'Materials': 'PLA, ABS, PETG, TPU, Wood-fill, Metal-fill',
          'Heated Bed': 'Up to 120°C',
          'Extruder': 'All-metal hotend up to 300°C'
        },
        maintenanceSchedule: 'Currently under maintenance - estimated completion: Next Tuesday',
        bookingInstructions: 'Submit 3D model files 24 hours in advance. Maximum print time: 48 hours. Material costs charged separately.'
      },
      {
        name: 'Spectrophotometer UV-Vis',
        description: 'High-precision UV-Visible spectrophotometer for quantitative analysis and material characterization in chemistry research.',
        category: 'Analytical',
        location: 'Room 320, Chemistry Laboratory',
        status: 'available',
        specifications: {
          'Wavelength Range': '190-1100 nm',
          'Bandwidth': '1.8 nm',
          'Accuracy': '±0.5 nm',
          'Sample Types': 'Liquid, solid, powder',
          'Software': 'UV-Vis Analyst Pro'
        },
        maintenanceSchedule: 'Monthly calibration on the 15th, 9:00 AM - 11:00 AM',
        bookingInstructions: 'Minimum 1-hour slots. Training certification required. Bring your own cuvettes and samples.'
      },
      {
        name: 'Oscilloscope (100 MHz)',
        description: 'Digital storage oscilloscope with advanced triggering capabilities for electronics and signal analysis applications.',
        category: 'Electronics',
        location: 'Room 180, Electronics Laboratory',
        status: 'available',
        specifications: {
          'Bandwidth': '100 MHz',
          'Channels': '4 analog + 16 digital',
          'Sample Rate': '1 GSa/s',
          'Memory Depth': '10 Mpts',
          'Display': '10.1" color touchscreen'
        },
        maintenanceSchedule: 'Quarterly calibration - next due in 3 months',
        bookingInstructions: 'Available for 3-hour slots. Basic electronics knowledge required. Probes and test leads provided.'
      },
      {
        name: 'Laser Cutter',
        description: 'CO2 laser cutting and engraving system for precise cutting of wood, acrylic, fabric, and other non-metal materials.',
        category: 'Manufacturing',
        location: 'Room 155, Design Workshop',
        status: 'available',
        specifications: {
          'Laser Power': '60W CO2',
          'Cutting Area': '600mm x 400mm',
          'Material Thickness': 'Up to 20mm (varies by material)',
          'Supported Materials': 'Wood, acrylic, fabric, leather, paper, cardboard',
          'Software': 'LaserCut 5.3'
        },
        maintenanceSchedule: 'Weekly lens cleaning on Sundays, 6:00 PM - 7:00 PM',
        bookingInstructions: 'Safety training mandatory. Maximum 4-hour sessions. Design files must be pre-approved for safety.'
      },
      {
        name: 'Centrifuge (Refrigerated)',
        description: 'High-speed refrigerated centrifuge for sample preparation and separation in biological and chemical research.',
        category: 'Laboratory',
        location: 'Room 210, Biochemistry Laboratory',
        status: 'available',
        specifications: {
          'Maximum Speed': '15,000 RPM',
          'Temperature Range': '-20°C to +40°C',
          'Capacity': '4 x 250ml or 12 x 50ml tubes',
          'Timer': '1 min to 99 hours',
          'Safety Features': 'Imbalance detection, door lock'
        },
        maintenanceSchedule: 'Bi-weekly service on alternate Thursdays, 8:00 AM - 10:00 AM',
        bookingInstructions: 'Maximum 2-hour sessions. Balanced tubes required. Clean rotor after use.'
      },
      {
        name: 'Network Analyzer',
        description: 'Vector network analyzer for RF and microwave component testing, antenna measurements, and circuit analysis.',
        category: 'Electronics',
        location: 'Room 185, RF Laboratory',
        status: 'available',
        specifications: {
          'Frequency Range': '10 MHz to 8.5 GHz',
          'Dynamic Range': '110 dB',
          'Ports': '2-port measurements',
          'Calibration': 'Full 2-port, TRL, SOLT',
          'Interface': 'USB, Ethernet, GPIB'
        },
        maintenanceSchedule: 'Annual calibration - last performed 3 months ago',
        bookingInstructions: 'Advanced training required. 2-hour minimum booking. Calibration standards provided.'
      }
    ];

    // Insert sample resources
    console.log('Inserting sample resources...');
    await db.insert(resources).values(sampleResources);

    // Insert sample equipment
    console.log('Inserting sample equipment...');
    await db.insert(equipment).values(sampleEquipment);

    console.log('Database seeded successfully!');
    console.log(`Added ${sampleResources.length} resources and ${sampleEquipment.length} equipment items.`);

  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}