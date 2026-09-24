import mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/saint-lawrence";

async function runSeed() {
  console.log("Connecting to MongoDB...", MONGODB_URI);
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db!;

  const usersCollection = db.collection("users");
  const adminUser = await usersCollection.findOne({});
  const adminId = adminUser?._id || new mongoose.Types.ObjectId();

  const pagesCollection = db.collection("pages");
  const menusCollection = db.collection("menus");
  const disclosureCategoriesCollection = db.collection("disclosurecategories");
  const disclosureSectionsCollection = db.collection("disclosuresections");

  console.log("1. Seeding Dynamic Pages...");

  const dummyPages = [
    {
      title: "About Our School",
      slug: "about-us",
      description:
        "Saint Lawrence Public School is a leading CBSE English-medium institution in Jaipur, dedicated to holistic education, character building, and academic excellence.",
      banner: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=1600&auto=format&fit=crop",
      status: "published",
      template: "default",
      seoTitle: "About Us | Saint Lawrence Public School Jaipur",
      seoDescription: "Learn about Saint Lawrence Public School, our history, philosophy, and commitment to nurturing tomorrow's leaders.",
      blocks: [
        {
          type: "rich-text",
          order: 0,
          content: {
            html: `<h2>Welcome to Saint Lawrence Public School</h2>
<p>Established with a vision to deliver world-class schooling on Goner Road, Jaipur, <strong>Saint Lawrence Public School (SLPS)</strong> has grown to become one of Rajasthan's most trusted educational institutions.</p>
<p>We blend rigorous CBSE academics with sports, arts, STEM innovation, and character development to ensure every child discovers their inner brilliance.</p>`,
          },
        },
        {
          type: "content-block",
          order: 1,
          content: {
            title: "Our Core Mission & Philosophy",
            subtitle: "LIGHTING THE PATH TO EXCELLENCE",
            body: "At SLPS, we nurture empathy, integrity, perseverance, and autonomy in every child. We empower young minds to think independently, solve real-world challenges, and lead with compassion.",
          },
        },
        {
          type: "image",
          order: 2,
          content: {
            url: "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=1200&auto=format&fit=crop",
            alt: "Classroom Learning at Saint Lawrence",
            caption: "Interactive smart classrooms designed for dynamic and collaborative learning.",
          },
        },
        {
          type: "button",
          order: 3,
          content: {
            text: "Explore Admissions 2026-27",
            url: "/admissions",
          },
        },
      ],
      isDeleted: false,
      createdBy: adminId,
      updatedBy: adminId,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: "Management & Board of Trustees",
      slug: "management-and-board",
      description:
        "Meet the visionary leaders, management committee, and trustees guiding Saint Lawrence Public School with wisdom, dedication, and educational foresight.",
      banner: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?q=80&w=1600&auto=format&fit=crop",
      status: "published",
      template: "wide",
      seoTitle: "Management & Board | Saint Lawrence Public School Jaipur",
      seoDescription: "Meet the Chairman, Director, Principal, and Board of Trustees of Saint Lawrence Public School Jaipur.",
      blocks: [
        {
          type: "rich-text",
          order: 0,
          content: {
            html: `<h2>Visionary Governance & Educational Leadership</h2>
<p>At Saint Lawrence Public School, leadership is grounded in integrity, accountability, and an uncompromising commitment to students' holistic growth. Our Governing Body and Board of Trustees bring decades of distinguished experience in academics, institutional governance, and public service to steer the school towards enduring excellence.</p>`,
          },
        },
        {
          type: "team-grid",
          order: 1,
          content: {
            title: "Board of Management & Key Leaders",
            subtitle: "Guiding future generations towards global excellence and grounded values",
            members: [
              {
                name: "Shri V. K. Gupta",
                designation: "CHAIRMAN & FOUNDER",
                image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop",
                bio: "An eminent educationist and philanthropist with over 35 years of visionary leadership in academic institutions.",
              },
              {
                name: "Mr. Vikram Singh Rajawat",
                designation: "DIRECTOR",
                image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop",
                bio: "Leading strategic innovation, modern campus infrastructure, and futuristic STEM programs at SLPS.",
              },
              {
                name: "Dr. Sunita Sharma",
                designation: "PRINCIPAL (M.Sc., M.Ed., Ph.D.)",
                image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop",
                bio: "Distinguished CBSE educator and pedagogical mentor fostering child-centric experiential learning.",
              },
              {
                name: "Mrs. Meenakshi Rathore",
                designation: "VICE PRINCIPAL & ACADEMIC HEAD",
                image: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?q=80&w=800&auto=format&fit=crop",
                bio: "Overseeing curriculum planning, teacher development, and continuous student evaluation systems.",
              },
              {
                name: "Mr. Rajesh Saxena",
                designation: "MANAGING TRUSTEE",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop",
                bio: "Ensuring regulatory compliance, transparent financial governance, and scholarship access for deserving students.",
              },
              {
                name: "Dr. Arvind K. Sharma",
                designation: "HONORARY ADVISOR (EX-CBSE DIRECTOR)",
                image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop",
                bio: "National education consultant advising the board on NEP 2020 alignment and international accreditations.",
              },
            ],
          },
        },
        {
          type: "button",
          order: 2,
          content: {
            text: "Explore Mandatory Public Disclosure",
            url: "/mandatory-disclosure",
          },
        },
      ],
      isDeleted: false,
      createdBy: adminId,
      updatedBy: adminId,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: "Our Campus & Infrastructure",
      slug: "campus-infrastructure",
      description:
        "Explore our spacious campus featuring smart classrooms, cutting-edge science and computer labs, digital library, and multi-sport grounds.",
      banner: "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1600&auto=format&fit=crop",
      status: "published",
      template: "wide",
      seoTitle: "Campus & Infrastructure | Saint Lawrence Public School",
      seoDescription: "Discover state-of-the-art campus facilities, laboratories, libraries, and athletic arenas at Saint Lawrence Public School.",
      blocks: [
        {
          type: "rich-text",
          order: 0,
          content: {
            html: `<h2>A Campus Built for Inspired Learning</h2>
<p>Spread across lush green acres on Goner Road, our campus provides a secure, inspiring, and eco-friendly environment where students feel encouraged to explore and excel.</p>`,
          },
        },
        {
          type: "content-block",
          order: 1,
          content: {
            title: "Smart Classrooms & Digital Labs",
            subtitle: "MODERN LEARNING SPACES",
            body: "All classrooms are equipped with interactive smart boards, audio-visual learning aids, ergonomic furniture, and climate control to provide the optimal learning environment.",
          },
        },
        {
          type: "image",
          order: 2,
          content: {
            url: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?q=80&w=1200&auto=format&fit=crop",
            alt: "STEM and Robotics Lab",
            caption: "High-tech Physics, Chemistry, Biology, and AI Robotics Laboratories.",
          },
        },
      ],
      isDeleted: false,
      createdBy: adminId,
      updatedBy: adminId,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: "Vision & Philosophy",
      slug: "vision-and-philosophy",
      description:
        "Our 5 developmental stages — Chetna, Ananda, Kalpana, Jigyasa, and Sadhana — guide every child's growth from early years to senior secondary.",
      banner: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1600&auto=format&fit=crop",
      status: "published",
      template: "default",
      seoTitle: "Vision & Philosophy | Saint Lawrence Public School",
      seoDescription: "The educational philosophy and developmental roadmap of Saint Lawrence Public School Jaipur.",
      blocks: [
        {
          type: "rich-text",
          order: 0,
          content: {
            html: `<h2>5 Stages of Student Development</h2>
<p>At Saint Lawrence, education is not a race; it is a transformative journey that unfolds across five harmonized developmental stages:</p>
<ul>
  <li><strong>1. Chetna (Early Years I, II, III):</strong> Fostering sensory consciousness and foundational curiosity.</li>
  <li><strong>2. Ananda (Grades I-II):</strong> Igniting joyous learning, discovery, and literacy.</li>
  <li><strong>3. Kalpana (Grades III-V):</strong> Fueling imagination, bold exploration, and creative thinking.</li>
  <li><strong>4. Jigyasa (Grades VI-VIII):</strong> Cultivating scientific enquiry, analytical reasoning, and problem solving.</li>
  <li><strong>5. Sadhana (Grades IX-XII):</strong> Mastering specialized disciplines, perseverance, and ethical leadership.</li>
</ul>`,
          },
        },
      ],
      isDeleted: false,
      createdBy: adminId,
      updatedBy: adminId,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: "Admission Guidelines 2026-27",
      slug: "admission-guidelines",
      description:
        "Comprehensive information on eligibility criteria, required documents, admission age guidelines, and online registration steps for the session 2026-27.",
      banner: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1600&auto=format&fit=crop",
      status: "published",
      template: "default",
      seoTitle: "Admission Guidelines 2026-27 | Saint Lawrence Public School",
      seoDescription: "Official admission guidelines, age criteria, and document requirements for Saint Lawrence Public School Jaipur.",
      blocks: [
        {
          type: "rich-text",
          order: 0,
          content: {
            html: `<h2>Admission Guidelines & Procedure</h2>
<p>We welcome applications from parents seeking a values-driven, academically rigorous CBSE education for their children.</p>
<h3>1. Age Criteria (As of 31st March 2026)</h3>
<ul>
  <li><strong>Nursery:</strong> 3+ Years</li>
  <li><strong>LKG:</strong> 4+ Years</li>
  <li><strong>UKG:</strong> 5+ Years</li>
  <li><strong>Grade I:</strong> 6+ Years</li>
</ul>
<h3>2. Required Documents</h3>
<ul>
  <li>Original Birth Certificate with 1 self-attested copy</li>
  <li>Previous Year's Report Card (Grade II and above)</li>
  <li>Original Transfer Certificate (TC) countersigned by the competent authority</li>
  <li>Aadhar Card copies of Student and Parents</li>
  <li>4 Passport-sized recent photographs of the student</li>
</ul>`,
          },
        },
        {
          type: "attachment",
          order: 1,
          content: {
            label: "Download Official Admission Form & Prospectus (PDF)",
            url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
          },
        },
        {
          type: "button",
          order: 2,
          content: {
            text: "Apply for Online Admission",
            url: "/admissions",
          },
        },
      ],
      isDeleted: false,
      createdBy: adminId,
      updatedBy: adminId,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: "Fee Structure 2026-27",
      slug: "fee-structure",
      description:
        "Transparent fee schedule for Early Years, Primary, Middle, and Senior Secondary classes for the academic session 2026-27.",
      banner: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1600&auto=format&fit=crop",
      status: "published",
      template: "default",
      seoTitle: "Fee Structure 2026-27 | Saint Lawrence Public School",
      seoDescription: "View transparent tuition, lab, and transport fee schedules for Saint Lawrence Public School Jaipur.",
      blocks: [
        {
          type: "rich-text",
          order: 0,
          content: {
            html: `<h2>Transparent & All-Inclusive Fee Schedule</h2>
<p>Saint Lawrence Public School maintains an honest and clear fee structure without hidden charges. Fees cover classroom tuition, smart learning facilities, basic sports coaching, and library access.</p>`,
          },
        },
        {
          type: "attachment",
          order: 1,
          content: {
            label: "Download Detailed Fee Schedule 2026-27 (PDF)",
            url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
          },
        },
      ],
      isDeleted: false,
      createdBy: adminId,
      updatedBy: adminId,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: "Facilities & Laboratories",
      slug: "facilities",
      description:
        "World-class facilities supporting all-round development including science labs, sports arena, digitized library, and transport.",
      banner: "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1600&auto=format&fit=crop",
      status: "published",
      template: "wide",
      seoTitle: "Facilities & Labs | Saint Lawrence Public School",
      seoDescription: "Learn about modern laboratories, sports complex, smart classes, and transport at Saint Lawrence Public School.",
      blocks: [
        {
          type: "rich-text",
          order: 0,
          content: {
            html: `<h2>World-Class Infrastructure for Excellence</h2>
<p>Our campus offers specialized facilities crafted to nurture both intellectual enquiry and athletic discipline.</p>`,
          },
        },
        {
          type: "content-block",
          order: 1,
          content: {
            title: "Advanced Science & Computer Labs",
            subtitle: "HANDS-ON EXPERIMENTATION",
            body: "Individual workstations with modern apparatus, optical microscopes, chemical testing benches, and high-speed networked computers.",
          },
        },
        {
          type: "content-block",
          order: 2,
          content: {
            title: "Sports & Fitness Complex",
            subtitle: "ATHLETIC EXCELLENCE",
            body: "Full-size cricket pitch, football turf, basketball court, badminton arenas, and indoor table tennis & chess rooms under certified coaches.",
          },
        },
        {
          type: "content-block",
          order: 3,
          content: {
            title: "Safe GPS-Tracked Transportation",
            subtitle: "PEACE OF MIND FOR PARENTS",
            body: "Fleet of modern buses equipped with GPS tracking, CCTV cameras, speed governors, and trained female attendants covering all major Jaipur routes.",
          },
        },
      ],
      isDeleted: false,
      createdBy: adminId,
      updatedBy: adminId,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  for (const p of dummyPages) {
    await pagesCollection.updateOne(
      { slug: p.slug },
      { $set: p },
      { upsert: true }
    );
    console.log(`✓ Seeded page: /${p.slug}`);
  }

  console.log("2. Seeding Header Navigation Menu (with Dropdowns)...");

  const headerMenu = {
    name: "Main Navigation",
    slug: "main-navigation",
    location: "header",
    isActive: true,
    createdBy: adminId,
    updatedBy: adminId,
    items: [
      {
        label: "Home",
        url: "/",
        target: "_self",
        isEnabled: true,
        order: 0,
        children: [],
      },
      {
        label: "About Us",
        url: "/about-us",
        target: "_self",
        isEnabled: true,
        order: 1,
        children: [
          {
            label: "About School",
            url: "/about-us",
            target: "_self",
            isEnabled: true,
            order: 0,
            children: [],
          },
          {
            label: "Management & Board",
            url: "/management-and-board",
            target: "_self",
            isEnabled: true,
            order: 1,
            children: [],
          },
          {
            label: "Campus & Infrastructure",
            url: "/campus-infrastructure",
            target: "_self",
            isEnabled: true,
            order: 2,
            children: [],
          },
          {
            label: "Vision & Philosophy",
            url: "/vision-and-philosophy",
            target: "_self",
            isEnabled: true,
            order: 3,
            children: [],
          },
        ],
      },
      {
        label: "Admissions",
        url: "/admissions",
        target: "_self",
        isEnabled: true,
        order: 2,
        children: [
          {
            label: "Admission Process",
            url: "/admissions",
            target: "_self",
            isEnabled: true,
            order: 0,
            children: [],
          },
          {
            label: "Admission Guidelines",
            url: "/admission-guidelines",
            target: "_self",
            isEnabled: true,
            order: 1,
            children: [],
          },
          {
            label: "Fee Structure 2026-27",
            url: "/fee-structure",
            target: "_self",
            isEnabled: true,
            order: 2,
            children: [],
          },
        ],
      },
      {
        label: "Facilities",
        url: "/facilities",
        target: "_self",
        isEnabled: true,
        order: 3,
        children: [],
      },
      {
        label: "Mandatory Public Disclosure",
        url: "/mandatory-disclosure",
        target: "_self",
        isEnabled: true,
        order: 4,
        children: [],
      },
      {
        label: "Contact Us",
        url: "/contact",
        target: "_self",
        isEnabled: true,
        order: 5,
        children: [],
      },
    ],
    updatedAt: new Date(),
  };

  await menusCollection.updateOne(
    { location: "header" },
    { $set: headerMenu },
    { upsert: true }
  );
  console.log("✓ Seeded Header Menu with Parent and Child dropdowns!");

  console.log("3. Seeding Mandatory Public Disclosure Data (CBSE Format)...");

  // Create or update Disclosure Category
  let category = await disclosureCategoriesCollection.findOne({ slug: "cbse-mandatory-disclosure" });
  if (!category) {
    const catRes = await disclosureCategoriesCollection.insertOne({
      name: "CBSE Mandatory Public Disclosure",
      slug: "cbse-mandatory-disclosure",
      description: "Official documents and statutory information as mandated by the Central Board of Secondary Education (CBSE), New Delhi.",
      order: 0,
      status: "published",
      createdBy: adminId,
      updatedBy: adminId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    category = { _id: catRes.insertedId };
  }

  const categoryId = category._id;

  // Clear previous sections for this category to ensure clean structure
  await disclosureSectionsCollection.deleteMany({ category: categoryId });

  const dummyPdfUrl = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";

  const disclosureSections = [
    {
      category: categoryId,
      title: "A. General Information",
      slug: "general-information",
      description: "Official school identification, affiliation, and administrative contact details.",
      order: 0,
      status: "published",
      fields: [
        { label: "Name of the School", type: "text", value: "Saint Lawrence Public School", order: 0 },
        { label: "CBSE Affiliation Number", type: "text", value: "1730999 (Senior Secondary)", order: 1 },
        { label: "School Code", type: "text", value: "11223", order: 2 },
        { label: "Complete Address with Pin Code", type: "text", value: "Goner Road, Near Ring Road Flyover, Jaipur, Rajasthan - 303905", order: 3 },
        { label: "Principal Name & Qualification", type: "text", value: "Dr. Sunita Sharma (M.Sc., M.Ed., Ph.D.)", order: 4 },
        { label: "School Official Email ID", type: "text", value: "info@saintlawrenceschool.com", order: 5 },
        { label: "Contact Details (Landline / Mobile)", type: "text", value: "+91 98765 43210, 0141-2789012", order: 6 },
      ],
      createdBy: adminId,
      updatedBy: adminId,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      category: categoryId,
      title: "B. Documents and Information",
      slug: "documents-and-information",
      description: "Official statutory certifications, affiliation orders, safety approvals, and government approvals (Click to view or download).",
      order: 1,
      status: "published",
      fields: [
        {
          label: "1. Copies of Affiliation / Upgradation Letter and Recent Extension of Affiliation",
          type: "document",
          value: dummyPdfUrl,
          order: 0,
        },
        {
          label: "2. Copies of Societies / Trust / Company Registration / Renewal Certificate",
          type: "document",
          value: dummyPdfUrl,
          order: 1,
        },
        {
          label: "3. Copy of No Objection Certificate (NOC) Issued by State Government",
          type: "document",
          value: dummyPdfUrl,
          order: 2,
        },
        {
          label: "4. Copy of Recognition Certificate under RTE Act, 2009 & its Renewal",
          type: "document",
          value: dummyPdfUrl,
          order: 3,
        },
        {
          label: "5. Copy of Valid Building Safety Certificate as per National Building Code",
          type: "document",
          value: dummyPdfUrl,
          order: 4,
        },
        {
          label: "6. Copy of Valid Fire Safety Certificate Issued by Competent Authority",
          type: "document",
          value: dummyPdfUrl,
          order: 5,
        },
        {
          label: "7. Copy of Self Certification Submitted by the School for Affiliation",
          type: "document",
          value: dummyPdfUrl,
          order: 6,
        },
        {
          label: "8. Copies of Valid Water, Health and Sanitation Certificates",
          type: "document",
          value: dummyPdfUrl,
          order: 7,
        },
      ],
      createdBy: adminId,
      updatedBy: adminId,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      category: categoryId,
      title: "C. Result and Academics",
      slug: "result-and-academics",
      description: "Fee schedule, annual school calendar, management committee, PTA members, and board examination achievements.",
      order: 2,
      status: "published",
      fields: [
        {
          label: "1. Fee Structure of the School (Session 2026-27)",
          type: "document",
          value: dummyPdfUrl,
          order: 0,
        },
        {
          label: "2. Annual Academic Calendar (Session 2026-27)",
          type: "document",
          value: dummyPdfUrl,
          order: 1,
        },
        {
          label: "3. List of School Management Committee (SMC)",
          type: "document",
          value: dummyPdfUrl,
          order: 2,
        },
        {
          label: "4. List of Parents Teachers Association (PTA) Members",
          type: "document",
          value: dummyPdfUrl,
          order: 3,
        },
        {
          label: "5. Last Three-Year Result of the Board Examination (Class X & XII)",
          type: "text",
          value: "100% Pass Percentage with 45+ Subject Distinctions and School Topper at 98.4%",
          order: 4,
        },
      ],
      createdBy: adminId,
      updatedBy: adminId,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      category: categoryId,
      title: "D. Staff (Teaching) & School Infrastructure",
      slug: "staff-and-infrastructure",
      description: "Staffing breakdown, teacher-student ratios, special educator credentials, and physical infrastructure specifications.",
      order: 3,
      status: "published",
      fields: [
        { label: "Total Number of Teachers", type: "text", value: "64 Teaching Faculty", order: 0 },
        { label: "PGT Teachers", type: "text", value: "16", order: 1 },
        { label: "TGT Teachers", type: "text", value: "24", order: 2 },
        { label: "PRT Teachers", type: "text", value: "20", order: 3 },
        { label: "Teachers-Section Ratio", type: "text", value: "1:1.5", order: 4 },
        { label: "Details of Special Educator", type: "text", value: "Ms. Priyanka Sen (B.Ed. in Special Education, RCI Certified)", order: 5 },
        { label: "Details of Counselor & Wellness Teacher", type: "text", value: "Dr. Rekha Verma (M.A. Clinical Psychology)", order: 6 },
        { label: "Total Campus Area (in Sq. Mtrs)", type: "text", value: "12,500 Sq. Meters", order: 7 },
        { label: "Total Built-Up Area (in Sq. Mtrs)", type: "text", value: "6,800 Sq. Meters", order: 8 },
        { label: "Total Play Ground Area (in Sq. Mtrs)", type: "text", value: "5,700 Sq. Meters", order: 9 },
        { label: "Number of Smart Classrooms", type: "text", value: "48 Fully Air-Cooled & Smart Board Equipped", order: 10 },
        { label: "Number of Laboratories", type: "text", value: "8 Labs (Physics, Chem, Bio, Computer, Maths, Robotics, Composite, Language)", order: 11 },
        { label: "Internet Facility & Bandwidth", type: "text", value: "Yes (High-Speed 100 Mbps Dedicated Fiber Link)", order: 12 },
      ],
      createdBy: adminId,
      updatedBy: adminId,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  await disclosureSectionsCollection.insertMany(disclosureSections);
  console.log("✓ Seeded 4 Mandatory Public Disclosure sections with documents!");

  await mongoose.disconnect();
  console.log("All dynamic pages, menus, and disclosure data successfully seeded!");
}

runSeed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
