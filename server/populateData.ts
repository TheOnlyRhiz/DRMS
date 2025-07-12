import { storage } from './storage';

export async function populateDatabase() {
  try {
    console.log('Populating database with sample data...');

    // Sample academic resources
    const sampleResources = [
      {
        title: 'Introduction to Computer Science - Lecture Notes',
        description: 'Comprehensive lecture notes covering fundamental concepts in computer science including algorithms, data structures, and programming paradigms.',
        category: 'lecture_notes' as const,
        course: 'CS 101',
        fileType: 'application/pdf',
        fileName: 'cs101-lecture-notes.pdf',
        fileUrl: '/uploads/cs101-lecture-notes.pdf',
        fileSize: 2457600,
        tags: ['computer science', 'algorithms', 'programming', 'fundamentals']
      },
      {
        title: 'Advanced Mathematics Problem Sets',
        description: 'Collection of challenging mathematical problems with detailed solutions covering calculus, linear algebra, and differential equations.',
        category: 'assignments' as const,
        course: 'MATH 301',
        fileType: 'application/pdf',
        fileName: 'math301-problems.pdf',
        fileUrl: '/uploads/math301-problems.pdf',
        fileSize: 1843200,
        tags: ['mathematics', 'calculus', 'linear algebra', 'differential equations']
      },
      {
        title: 'Physics Laboratory Manual',
        description: 'Complete laboratory manual for undergraduate physics experiments including mechanics, thermodynamics, and electromagnetism.',
        category: 'reference_materials' as const,
        course: 'PHYS 201',
        fileType: 'application/pdf',
        fileName: 'physics-lab-manual.pdf',
        fileUrl: '/uploads/physics-lab-manual.pdf',
        fileSize: 3276800,
        tags: ['physics', 'laboratory', 'experiments', 'mechanics']
      },
      {
        title: 'Data Structures and Algorithms Textbook',
        description: 'Comprehensive textbook covering advanced data structures, algorithm analysis, and implementation techniques with practical examples.',
        category: 'reference_materials' as const,
        course: 'CS 250',
        fileType: 'application/pdf',
        fileName: 'dsa-textbook.pdf',
        fileUrl: '/uploads/dsa-textbook.pdf',
        fileSize: 5242880,
        tags: ['data structures', 'algorithms', 'computer science', 'programming']
      },
      {
        title: 'Chemistry Research Papers Collection',
        description: 'Curated collection of recent research papers in organic chemistry, including synthesis methods and reaction mechanisms.',
        category: 'project_reports' as const,
        course: 'CHEM 350',
        fileType: 'application/pdf',
        fileName: 'chemistry-research.pdf',
        fileUrl: '/uploads/chemistry-research.pdf',
        fileSize: 4194304,
        tags: ['chemistry', 'research', 'organic chemistry', 'synthesis']
      },
      {
        title: 'Statistical Analysis Software Tutorial',
        description: 'Step-by-step tutorial for using statistical software packages including R, SPSS, and Python for data analysis.',
        category: 'lecture_notes' as const,
        course: 'STAT 200',
        fileType: 'application/pdf',
        fileName: 'stats-tutorial.pdf',
        fileUrl: '/uploads/stats-tutorial.pdf',
        fileSize: 2621440,
        tags: ['statistics', 'software', 'data analysis', 'tutorial']
      },
      {
        title: 'English Literature Essay Collection',
        description: 'Collection of exemplary student essays analyzing classic works of English literature with detailed commentary.',
        category: 'assignments' as const,
        course: 'ENG 250',
        fileType: 'application/pdf',
        fileName: 'literature-essays.pdf',
        fileUrl: '/uploads/literature-essays.pdf',
        fileSize: 1572864,
        tags: ['literature', 'essays', 'analysis', 'writing']
      },
      {
        title: 'Database Design Past Questions',
        description: 'Collection of past examination questions with model answers for database design and SQL programming.',
        category: 'past_questions' as const,
        course: 'CS 340',
        fileType: 'application/pdf',
        fileName: 'database-past-questions.pdf',
        fileUrl: '/uploads/database-past-questions.pdf',
        fileSize: 2097152,
        tags: ['database', 'design', 'sql', 'examination']
      }
    ];

    // Sample departmental equipment
    const sampleEquipment = [
      {
        name: 'High-Performance Computing Cluster',
        description: 'Multi-node computing cluster with 128 cores, 512GB RAM, and GPU acceleration for computational research and parallel processing.',
        category: 'Computing',
        location: 'Room 301, Computer Science Building',
        status: 'available' as const,
        specifications: {
          'CPU': '2x Intel Xeon Gold 6248R (48 cores total)',
          'Memory': '512GB DDR4 ECC',
          'Storage': '4TB NVMe SSD',
          'GPU': 'NVIDIA A100 40GB',
          'Network': '10 Gigabit Ethernet'
        },
        bookingInstructions: 'Requires faculty approval. Maximum booking duration: 72 hours. Must submit job description and resource requirements.'
      },
      {
        name: 'Digital Microscope System',
        description: 'Advanced digital microscope with 4K imaging capabilities, automated focus, and specimen analysis software for biological research.',
        category: 'Laboratory',
        location: 'Room 205, Biology Laboratory',
        status: 'available' as const,
        specifications: {
          'Magnification': '40x - 1000x',
          'Resolution': '4K (3840x2160)',
          'Illumination': 'LED with adjustable intensity',
          'Software': 'Image analysis and measurement tools',
          'Connectivity': 'USB 3.0, Ethernet'
        },
        bookingInstructions: 'Available for 2-hour slots. Training session required before first use. Contact lab coordinator for scheduling.'
      },
      {
        name: '3D Printer (Industrial Grade)',
        description: 'Professional-grade 3D printer capable of printing with various materials including PLA, ABS, PETG, and engineering plastics.',
        category: 'Manufacturing',
        location: 'Room 150, Engineering Workshop',
        status: 'maintenance' as const,
        specifications: {
          'Build Volume': '300mm x 300mm x 400mm',
          'Layer Resolution': '0.1mm - 0.4mm',
          'Materials': 'PLA, ABS, PETG, TPU, Wood-fill, Metal-fill',
          'Heated Bed': 'Up to 120°C',
          'Extruder': 'All-metal hotend up to 300°C'
        },
        bookingInstructions: 'Submit 3D model files 24 hours in advance. Maximum print time: 48 hours. Material costs charged separately.'
      },
      {
        name: 'Spectrophotometer UV-Vis',
        description: 'High-precision UV-Visible spectrophotometer for quantitative analysis and material characterization in chemistry research.',
        category: 'Analytical',
        location: 'Room 320, Chemistry Laboratory',
        status: 'available' as const,
        specifications: {
          'Wavelength Range': '190-1100 nm',
          'Bandwidth': '1.8 nm',
          'Accuracy': '±0.5 nm',
          'Sample Types': 'Liquid, solid, powder',
          'Software': 'UV-Vis Analyst Pro'
        },
        bookingInstructions: 'Minimum 1-hour slots. Training certification required. Bring your own cuvettes and samples.'
      },
      {
        name: 'Oscilloscope (100 MHz)',
        description: 'Digital storage oscilloscope with advanced triggering capabilities for electronics and signal analysis applications.',
        category: 'Electronics',
        location: 'Room 180, Electronics Laboratory',
        status: 'available' as const,
        specifications: {
          'Bandwidth': '100 MHz',
          'Channels': '4 analog + 16 digital',
          'Sample Rate': '1 GSa/s',
          'Memory Depth': '10 Mpts',
          'Display': '10.1" color touchscreen'
        },
        bookingInstructions: 'Available for 3-hour slots. Basic electronics knowledge required. Probes and test leads provided.'
      },
      {
        name: 'Laser Cutter',
        description: 'CO2 laser cutting and engraving system for precise cutting of wood, acrylic, fabric, and other non-metal materials.',
        category: 'Manufacturing',
        location: 'Room 155, Design Workshop',
        status: 'available' as const,
        specifications: {
          'Laser Power': '60W CO2',
          'Cutting Area': '600mm x 400mm',
          'Material Thickness': 'Up to 20mm (varies by material)',
          'Supported Materials': 'Wood, acrylic, fabric, leather, paper, cardboard',
          'Software': 'LaserCut 5.3'
        },
        bookingInstructions: 'Safety training mandatory. Maximum 4-hour sessions. Design files must be pre-approved for safety.'
      },
      {
        name: 'Centrifuge (Refrigerated)',
        description: 'High-speed refrigerated centrifuge for sample preparation and separation in biological and chemical research.',
        category: 'Laboratory',
        location: 'Room 210, Biochemistry Laboratory',
        status: 'available' as const,
        specifications: {
          'Maximum Speed': '15,000 RPM',
          'Temperature Range': '-20°C to +40°C',
          'Capacity': '4 x 250ml or 12 x 50ml tubes',
          'Timer': '1 min to 99 hours',
          'Safety Features': 'Imbalance detection, door lock'
        },
        bookingInstructions: 'Maximum 2-hour sessions. Balanced tubes required. Clean rotor after use.'
      },
      {
        name: 'Network Analyzer',
        description: 'Vector network analyzer for RF and microwave component testing, antenna measurements, and circuit analysis.',
        category: 'Electronics',
        location: 'Room 185, RF Laboratory',
        status: 'available' as const,
        specifications: {
          'Frequency Range': '10 MHz to 8.5 GHz',
          'Dynamic Range': '110 dB',
          'Ports': '2-port measurements',
          'Calibration': 'Full 2-port, TRL, SOLT',
          'Interface': 'USB, Ethernet, GPIB'
        },
        bookingInstructions: 'Advanced training required. 2-hour minimum booking. Calibration standards provided.'
      }
    ];

    // Use a default faculty user ID for uploads - you can adjust this based on your user setup
    const facultyUserId = 'm01dZODKSxNS8G39S2JQ1'; // Use the existing faculty user

    // Insert sample resources
    console.log('Inserting sample resources...');
    for (const resourceData of sampleResources) {
      await storage.createResource({
        ...resourceData,
        uploadedBy: facultyUserId
      });
    }

    // Insert sample equipment
    console.log('Inserting sample equipment...');
    for (const equipmentData of sampleEquipment) {
      await storage.createEquipment(equipmentData);
    }

    console.log('Database populated successfully!');
    console.log(`Added ${sampleResources.length} resources and ${sampleEquipment.length} equipment items.`);

  } catch (error) {
    console.error('Error populating database:', error);
    throw error;
  }
}