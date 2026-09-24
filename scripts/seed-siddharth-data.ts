import mongoose, { Types } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("MONGODB_URI is not set");
  process.exit(1);
}

async function seedSiddharthData() {
  await mongoose.connect(MONGODB_URI!);
  console.log("Connected to MongoDB successfully");

  const db = mongoose.connection.db!;
  const user = await db.collection("users").findOne({});
  const adminId = user?._id || new Types.ObjectId("6ab500d6788dd3bf077c8249");
  const now = new Date();

  console.log("Using Admin ID:", adminId);

  // 1. SITE SETTINGS
  console.log("Seeding Site Settings...");
  const siteSettings = [
    {
      key: "site_name",
      value: "Siddharth International School",
      group: "general",
      label: "School Name",
      type: "text",
    },
    {
      key: "header_subtitle",
      value: "Co-Educational English Medium School (CBSE)",
      group: "header",
      label: "Header Subtitle",
      type: "text",
    },
    {
      key: "tagline",
      value: "Sky is the limit | A Premier English Medium School in Udaipurwati",
      group: "general",
      label: "Tagline",
      type: "text",
    },
    {
      key: "footer_text",
      value: "Managed by Shree Shyam Shiksha Samiti (Reg. 68/झूं/11-12). Committed to nurturing intellect, character, and lifelong leadership under the guidance of Chairman Mr. Ajeet Singh Shekhawat, Director Mr. Pradhuman Singh Shekhawat, and Principal Mrs. Sunita Rathore.",
      group: "footer",
      label: "Footer Text",
      type: "textarea",
    },
    {
      key: "address",
      value: "Sikar Road, Tehsil Nangal, Udaipurwati, Jhunjhunu, Rajasthan 333307",
      group: "contact",
      label: "Address",
      type: "textarea",
    },
    {
      key: "contact_address",
      value: "Sikar Road, Tehsil Nangal, Udaipurwati, Jhunjhunu, Rajasthan 333307",
      group: "contact",
      label: "Contact Address",
      type: "textarea",
    },
    {
      key: "phone",
      value: "+91 7568419751, 7568419752",
      group: "contact",
      label: "Phone",
      type: "text",
    },
    {
      key: "topbar_phone",
      value: "+91 7568419751",
      group: "topbar",
      label: "Top Bar Phone",
      type: "text",
    },
    {
      key: "contact_phone",
      value: "+91 7568419751, +91 7568419752, +91 9351449752",
      group: "contact",
      label: "Contact Phone Numbers",
      type: "text",
    },
    {
      key: "email",
      value: "siddharthinternationalschool15@gmail.com",
      group: "contact",
      label: "Email",
      type: "text",
    },
    {
      key: "topbar_email",
      value: "siddharthinternationalschool15@gmail.com",
      group: "topbar",
      label: "Top Bar Email",
      type: "text",
    },
    {
      key: "contact_email",
      value: "siddharthinternationalschool15@gmail.com",
      group: "contact",
      label: "Contact Email",
      type: "text",
    },
    {
      key: "facebook",
      value: "https://www.facebook.com/profile.php?id=100078106855197&sk=photos",
      group: "social",
      label: "Facebook Page",
      type: "url",
    },
    {
      key: "topbar_show",
      value: true,
      group: "topbar",
      label: "Show Top Bar",
      type: "boolean",
    },
    {
      key: "topbar_announcement",
      value: "Admissions Open for Session 2026–27 | Nursery to Class XII",
      group: "topbar",
      label: "Top Bar Announcement",
      type: "text",
    },
    {
      key: "topbar_cta_show",
      value: true,
      group: "topbar",
      label: "Show CTA Button",
      type: "boolean",
    },
    {
      key: "topbar_cta_text",
      value: "Apply Now",
      group: "topbar",
      label: "CTA Text",
      type: "text",
    },
    {
      key: "topbar_cta_link",
      value: "/admissions",
      group: "topbar",
      label: "CTA Link",
      type: "url",
    },
    {
      key: "copyright_text",
      value: `© ${now.getFullYear()} Siddharth International School, Nangal. All rights reserved.`,
      group: "footer",
      label: "Copyright Text",
      type: "text",
    },
  ];

  for (const s of siteSettings) {
    await db.collection("sitesettings").updateOne(
      { key: s.key },
      {
        $set: {
          key: s.key,
          value: s.value,
          group: s.group,
          label: s.label,
          type: s.type,
          updatedBy: adminId,
          updatedAt: now,
        },
        $setOnInsert: {
          createdAt: now,
        },
      },
      { upsert: true }
    );
  }

  // 2. HOMEPAGE CONFIG (Follows Modi World School Layout exactly, keeping slider)
  console.log("Seeding Homepage Configuration matching Modi World School layout...");
  const homepageSections = [
    // Section 1: Hero Banner Slider (Kept per user instruction)
    {
      type: "hero",
      title: "Hero Banner",
      isEnabled: true,
      order: 1,
      content: {
        banners: [
          {
            badge: "SKY IS THE LIMIT",
            title: "Siddharth International School",
            description:
              "A Premier Co-Educational English Medium CBSE Institution in Nangal, Udaipurwati. Nurturing Academic Brilliance, Character, and 21st Century Skills.",
            image: "/uploads/campus/siddharth-campus-main.jpg",
            primaryButtonText: "Apply for Admission",
            primaryButtonUrl: "/admissions",
            secondaryButtonText: "Explore Campus",
            secondaryButtonUrl: "/gallery",
          },
          {
            badge: "MANAGED BY SHREE SHYAM SHIKSHA SAMITI",
            title: "One Campus, Limitless Opportunities",
            description:
              "Equipped with modern science & IT labs, spacious smart classrooms, expansive sports grounds, and safe GPS-enabled transport across Shekhawati.",
            image: "/uploads/campus/siddharth-academic-block.jpg",
            primaryButtonText: "Mandatory Disclosure",
            primaryButtonUrl: "/mandatory-disclosure",
            secondaryButtonText: "Contact Us",
            secondaryButtonUrl: "/contact",
          },
          {
            badge: "HOLISTIC EDUCATION & SPORTS EXCELLENCE",
            title: "Nurturing Champions on the Sports Field & in Life",
            description:
              "Home of the Spectra Annual Sports Meet, vibrant cultural festivals, and disciplined morning assemblies fostering character, patriotism, and unity.",
            image: "/uploads/campus/morning-assembly-ground.jpg",
            primaryButtonText: "View Gallery",
            primaryButtonUrl: "/gallery",
            secondaryButtonText: "Admissions 2026-27",
            secondaryButtonUrl: "/admissions",
          },
        ],
      },
    },

    // Section 2 (Modi World School Section 2): Academics - 4 Developmental Stages
    {
      type: "vision",
      title: "Four Developmental Stages",
      isEnabled: true,
      order: 2,
      content: {
        description:
          "Aligned with the National Education Policy and CBSE guidelines, our structured four-stage academic framework guarantees progressive, joyful, and rigorous growth for every student.",
        items: [
          {
            title: "Foundation Stage",
            tag: "Class Nursery to II (Ages 3 to 8 Years)",
            description:
              "Early childhood division. Play-based, joyful, and experiential pedagogy focused on phonics, foundational numeracy, and sensory development.",
            image: "/uploads/events/sports-day-races.jpg",
          },
          {
            title: "Preparatory Stage",
            tag: "Class III to V (Ages 8 to 11 Years)",
            description:
              "CBSE - NCERT Curriculum. Conceptual foundations in Mathematics, Science, and Languages (English/Hindi). Sports & Creative Arts.",
            image: "/uploads/campus/morning-assembly-ground.jpg",
          },
          {
            title: "Middle Stage",
            tag: "Class VI to VIII (Ages 11 to 14 Years)",
            description:
              "CBSE - NCERT Curriculum. Science laboratory experiments, computer coding & digital literacy, athletics training, and ethical leadership.",
            image: "/uploads/campus/siddharth-academic-block.jpg",
          },
          {
            title: "Secondary Stage",
            tag: "Class IX to XII (Ages 14 to 18 Years)",
            description:
              "CBSE - NCERT Curriculum. Rigorous board examination excellence, specialized Science & Commerce streams, and career mentoring.",
            image: "/uploads/campus/siddharth-campus-main.jpg",
          },
        ],
      },
    },

    // Section 3 (Modi World School Section 3): Why School / One Campus Multiple Opportunities
    {
      type: "why-choose-us",
      title: "One Campus, Multiple Opportunities",
      isEnabled: true,
      order: 3,
      content: {
        subtitle:
          "Discover what makes Siddharth International School the preferred choice for parents in Nangal, Udaipurwati and the Shekhawati region",
      },
    },

    // Section 4 (Modi World School Section 4): Amenities
    {
      type: "facilities",
      title: "Amenities",
      isEnabled: true,
      order: 4,
      content: {
        subtitle: "World-Class Infrastructure Designed for Academic and Extracurricular Brilliance",
      },
    },

    // Section 5 (Modi World School Section 5): Testimonials
    {
      type: "testimonials",
      title: "Testimonials",
      isEnabled: true,
      order: 5,
      content: {
        subtitle: "What parents and community leaders share about our school environment and values",
        testimonials: [
          {
            name: "Dr. Mukesh Kumar Bagadi",
            role: "Parent Representative (BAMS Doctor), Udaipurwati",
            content:
              "The verdant, sprawling campus and the exemplary level of discipline make Siddharth International School truly distinguished. Each student epitomizes strong values, respect, and deep curiosity. The administration has invested extraordinary effort in academics and sports.",
            rating: 5,
          },
          {
            name: "Mr. Arvind Badiwal",
            role: "Parent Representative & Businessman, Udaipurwati",
            content:
              "I am deeply impressed by the school’s robust commitment to discipline, modern computer and science labs, and nature-friendly environment. The focus on conceptual learning and safe GPS transport provides complete peace of mind.",
            rating: 5,
          },
          {
            name: "Mrs. Renu Soni",
            role: "Parent Representative & Govt. Teacher, Udaipurwati",
            content:
              "As an educator myself, the academic culture here is outstanding. The leadership and faculty deserve high appreciation for their experience-driven approach in shaping young minds with precision, empathy, and dedication.",
            rating: 5,
          },
        ],
      },
    },

    // Section 6 (Modi World School Section 6): School You Would Want To Be In
    {
      type: "school-life",
      title: "School You Would Want To Be In",
      isEnabled: true,
      order: 6,
      content: {
        subtitle: "Sports, Celebrations & Life at Siddharth International School",
      },
    },

    // Section 7a: Chairman's Desk
    {
      type: "chairman-message",
      title: "Message from the Chairman's Desk",
      isEnabled: true,
      order: 7,
      content: {
        subtitle: "Shree Shyam Shiksha Samiti, Nangal, Udaipurwati",
        name: "Mr. Ajeet Singh Shekhawat",
        designation: "CHAIRMAN, SIDDHARTH INTERNATIONAL SCHOOL",
        image: "/uploads/campus/siddharth-campus-main.jpg",
        description: `Welcome to Siddharth International School, Nangal, Udaipurwati.

Education is the most potent catalyst for human enlightenment and societal upliftment. When we laid the foundation of Siddharth International School under the Shree Shyam Shiksha Samiti (Reg. 68/झूं/11-12), our prime vision was clear: to offer the families of Udaipurwati and the wider Shekhawati region an English-medium CBSE school of genuine excellence.

Our campus has been meticulously created to stimulate curiosity, cultivate moral integrity, and instill deep pride in our rich cultural values. We believe that when children are provided with modern amenities, devoted teachers, and disciplined guidance, their possibilities are infinite. 'Sky is the limit' is not merely our motto; it is our lived commitment to every student who walks through our gates.

I warmly invite you to visit our campus, observe our vibrant classrooms, and partner with us in shaping the leaders of tomorrow.`,
      },
    },

    // Section 7b: Director's Desk
    {
      type: "director-message",
      title: "Message from the Director's Desk",
      isEnabled: true,
      order: 8,
      content: {
        subtitle: "Strategic Vision & 21st-Century Learning",
        name: "Mr. Pradhuman Singh Shekhawat",
        designation: "DIRECTOR, SIDDHARTH INTERNATIONAL SCHOOL",
        image: "/uploads/leadership/director-welcome-safa.jpg",
        description: `Dear Parents, Students, and Community Members,

At Siddharth International School, we envision education as a transformative journey that equips every learner with critical thinking, adaptability, and ethical clarity.

Our objective is to deliver world-class infrastructure that bridges academic learning with experiential discovery. From our well-outfitted science and robotics laboratories to our sports courts and smart classrooms, every square meter of our campus is designed to unlock the innate genius of our youth.

We are continuously upgrading our academic standards and digital teaching methodologies to ensure that our students from Nangal and Udaipurwati stand shoulder-to-shoulder with the finest scholars across India.`,
      },
    },

    // Section 7c: Principal's Desk
    {
      type: "principal-message",
      title: "From the Principal's Desk",
      isEnabled: true,
      order: 9,
      content: {
        subtitle: "Academic Leadership & Student Welfare",
        name: "Mrs. Sunita Rathore",
        designation: "PRINCIPAL, SIDDHARTH INTERNATIONAL SCHOOL",
        image: "/uploads/leadership/principal-and-director.jpg",
        description: `Dear Parents, Students, and Well-Wishers,

At Siddharth International School, our educational framework places the individual learner at the core of all endeavors. We believe that each child arrives with unique curiosity, intellectual potential, and creative gifts.

Our educators are committed to fostering a supportive, safe, and academically stimulating atmosphere. Through interactive pedagogy, hands-on scientific experiments, digital literacy, and active sports participation, we equip students with the resilience and intellectual prowess necessary for CBSE board success and higher education.

Working hand-in-hand with parents through our School Management Committee (SMC) and Parent-Teacher Association (PTA), we ensure transparency, superior welfare, and continuous institutional growth.`,
      },
    },

    // Section 8: Statistics Counter
    {
      type: "statistics",
      title: "Excellence in Numbers",
      isEnabled: true,
      order: 10,
      content: {
        items: [
          { value: "100%", label: "CBSE Board Pass Rate" },
          { value: "25+", label: "Dedicated Qualified Faculty" },
          { value: "1000+", label: "Students Nurtured" },
          { value: "15+", label: "Sports & Club Activities" },
        ],
      },
    },

    // Section 9 (Modi World School Section 8): Best CBSE School in Rajasthan / Regional Overview
    {
      type: "regional-overview",
      title: "Best CBSE School In Udaipurwati, Rajasthan",
      isEnabled: true,
      order: 11,
      content: {
        description:
          "Siddharth International School is a flagship co-educational English-medium institution managed by Shree Shyam Shiksha Samiti (Reg. 68/झूं/11-12). Sprawling over a peaceful campus on Sikar Road, Nangal, Udaipurwati, the school is idyllic and capacious for the holistic growth of a child. Its serene location, high standards of discipline, certified drinking water and sanitation facilities, and secure GPS-tracked transport make it the trusted choice for parents across Shekhawati.",
      },
    },

    // Section 10 (Modi World School Footer CTA): Admissions Open / Exclusive Programs
    {
      type: "cta",
      title: "Admissions Open for Academic Session 2026–27",
      isEnabled: true,
      order: 12,
      content: {
        description:
          "Siddharth International School, Nangal, Udaipurwati, Nursery to Class XII. Through a rich learning experience which enriches every child academically, physically, and morally, we cultivate the leaders of tomorrow.",
        buttonText: "Apply for Admission",
        buttonUrl: "/admissions",
        image: "/uploads/campus/morning-assembly-ground.jpg",
      },
    },

    // Section 11: FAQ
    {
      type: "faq",
      title: "Frequently Asked Questions",
      isEnabled: true,
      order: 13,
      content: {
        description:
          "Common questions about admissions, CBSE affiliation, transportation, and facilities at Siddharth International School.",
        items: [
          {
            question: "Which curriculum and board does Siddharth International School follow?",
            answer:
              "Siddharth International School is an English-medium co-educational school following the Central Board of Secondary Education (CBSE) curriculum, New Delhi, from Nursery to Senior Secondary (Class XII).",
          },
          {
            question: "Who leads Siddharth International School?",
            answer:
              "The institution is guided by Mr. Ajeet Singh Shekhawat (Chairman), Mr. Pradhuman Singh Shekhawat (Director), and Mrs. Sunita Rathore (Principal), backed by the Shree Shyam Shiksha Samiti.",
          },
          {
            question: "What grades are open for admissions in the 2026–27 session?",
            answer:
              "Admissions are open across all four developmental stages: Foundation Stage (Nursery, LKG, UKG, Class I-II), Preparatory Stage (Classes III to V), Middle Stage (Classes VI to VIII), and Secondary & Senior Secondary (Classes IX to XII).",
          },
          {
            question: "Where is the campus located and which areas are covered by school buses?",
            answer:
              "The school is located on Sikar Road, Nangal, Tehsil Udaipurwati, Jhunjhunu, Rajasthan (PIN 333307). We operate safe, GPS-tracked buses connecting Nangal, Udaipurwati town, Chirana, Todpura, Kot, and surrounding rural and suburban hubs.",
          },
          {
            question: "What health and safety certifications does the school hold?",
            answer:
              "The school holds an official Safe Drinking Water and Sanitary Condition Certificate issued by the Chief Block Medical Officer (Rajasthan Health Department), comprehensive CCTV coverage, fire safety apparatus, and verified transport drivers and conductors.",
          },
          {
            question: "How can parents apply for admission or schedule a campus visit?",
            answer:
              "Parents can apply online through our website or visit the school admissions office directly between 8:00 AM and 2:00 PM on working days. You can also reach our admissions helpline at +91 7568419751 or +91 9351449752.",
          },
        ],
      },
    },
  ];

  await db.collection("homepageconfigs").updateOne(
    { status: "published" },
    {
      $set: {
        sections: homepageSections,
        status: "published",
        updatedBy: adminId,
        updatedAt: now,
      },
      $setOnInsert: {
        createdBy: adminId,
        createdAt: now,
      },
    },
    { upsert: true }
  );

  // 3. MENUS
  console.log("Seeding Navigation Menus...");
  const headerMenu = {
    name: "Main Navigation",
    slug: "header",
    location: "header",
    isActive: true,
    items: [
      {
        label: "Home",
        url: "/",
        target: "_self",
        isEnabled: true,
        order: 1,
        children: [],
      },
      {
        label: "About Us",
        url: "/about",
        target: "_self",
        isEnabled: true,
        order: 2,
        children: [
          { label: "Overview & Vision", url: "/about", target: "_self", isEnabled: true, order: 1 },
          { label: "Chairman's Desk", url: "/#chairman-message", target: "_self", isEnabled: true, order: 2 },
          { label: "Director's Desk", url: "/#director-message", target: "_self", isEnabled: true, order: 3 },
          { label: "Principal's Desk", url: "/#principal-message", target: "_self", isEnabled: true, order: 4 },
          { label: "Campus Facilities", url: "/facilities", target: "_self", isEnabled: true, order: 5 },
        ],
      },
      {
        label: "Academics",
        url: "/academics",
        target: "_self",
        isEnabled: true,
        order: 3,
        children: [
          { label: "Academic Programs", url: "/academics", target: "_self", isEnabled: true, order: 1 },
          { label: "4 Developmental Stages", url: "/#vision", target: "_self", isEnabled: true, order: 2 },
          { label: "Curriculum & Pedagogy", url: "/curriculum", target: "_self", isEnabled: true, order: 3 },
        ],
      },
      {
        label: "Mandatory Disclosure",
        url: "/mandatory-disclosure",
        target: "_self",
        isEnabled: true,
        order: 4,
        children: [],
      },
      {
        label: "Gallery",
        url: "/gallery",
        target: "_self",
        isEnabled: true,
        order: 5,
        children: [],
      },
      {
        label: "Admissions",
        url: "/admissions",
        target: "_self",
        isEnabled: true,
        order: 6,
        children: [
          { label: "Admission Procedure", url: "/admissions", target: "_self", isEnabled: true, order: 1 },
          { label: "Apply Online", url: "/admissions", target: "_self", isEnabled: true, order: 2 },
        ],
      },
      {
        label: "Contact",
        url: "/contact",
        target: "_self",
        isEnabled: true,
        order: 7,
        children: [],
      },
    ],
    createdBy: adminId,
    updatedBy: adminId,
    updatedAt: now,
    createdAt: now,
  };

  const footerMenu = {
    name: "Footer Quick Links",
    slug: "footer",
    location: "footer",
    isActive: true,
    items: [
      { label: "About School", url: "/about", target: "_self", isEnabled: true, order: 1, children: [] },
      { label: "Academic Programs", url: "/academics", target: "_self", isEnabled: true, order: 2, children: [] },
      { label: "Admissions 2026–27", url: "/admissions", target: "_self", isEnabled: true, order: 3, children: [] },
      { label: "Campus Facilities", url: "/facilities", target: "_self", isEnabled: true, order: 4, children: [] },
      { label: "Photo Gallery", url: "/gallery", target: "_self", isEnabled: true, order: 5, children: [] },
      { label: "Contact Us", url: "/contact", target: "_self", isEnabled: true, order: 6, children: [] },
    ],
    createdBy: adminId,
    updatedBy: adminId,
    updatedAt: now,
    createdAt: now,
  };

  const secondaryMenu = {
    name: "CBSE & Statutory Links",
    slug: "secondary",
    location: "secondary",
    isActive: true,
    items: [
      { label: "Mandatory Public Disclosure (Appendix-IX)", url: "/mandatory-disclosure", target: "_self", isEnabled: true, order: 1, children: [] },
      { label: "School Management Committee (SMC)", url: "/uploads/documents/school-management-committee-smc.pdf", target: "_blank", isEnabled: true, order: 2, children: [] },
      { label: "Parents-Teacher Association (PTA)", url: "/uploads/documents/parents-teachers-association-pta.pdf", target: "_blank", isEnabled: true, order: 3, children: [] },
      { label: "Safe Drinking Water & Sanitation Certificate", url: "/uploads/documents/water-and-sanitation-certificate.pdf", target: "_blank", isEnabled: true, order: 4, children: [] },
      { label: "Society Registration Certificate", url: "/uploads/documents/society-registration-certificate.pdf", target: "_blank", isEnabled: true, order: 5, children: [] },
    ],
    createdBy: adminId,
    updatedBy: adminId,
    updatedAt: now,
    createdAt: now,
  };

  for (const m of [headerMenu, footerMenu, secondaryMenu]) {
    await db.collection("menus").updateOne(
      { slug: m.slug },
      { $set: m },
      { upsert: true }
    );
  }

  // 4. CBSE APPENDIX-IX MANDATORY PUBLIC DISCLOSURE
  console.log("Seeding Mandatory Public Disclosure...");
  await db.collection("disclosurecategories").deleteMany({});
  await db.collection("disclosuresections").deleteMany({});

  const disclosureCat = {
    name: "CBSE Mandatory Public Disclosure (Appendix-IX)",
    slug: "cbse-appendix-ix",
    description: "Statutory Information, Official Certificates & Compliance Details as mandated by the Central Board of Secondary Education.",
    order: 1,
    status: "published",
    createdBy: adminId,
    updatedBy: adminId,
    createdAt: now,
    updatedAt: now,
  };

  const catResult = await db.collection("disclosurecategories").insertOne(disclosureCat);
  const categoryId = catResult.insertedId;

  const sectionsData = [
    {
      category: categoryId,
      title: "A. General Information",
      slug: "general-information",
      description: "Basic institutional information and communication channels",
      order: 1,
      status: "published",
      createdBy: adminId,
      updatedBy: adminId,
      createdAt: now,
      updatedAt: now,
      fields: [
        { label: "Name of the School", type: "text", value: "Siddharth International School", order: 1 },
        { label: "Chairman", type: "text", value: "Mr. Ajeet Singh Shekhawat", order: 2 },
        { label: "Director", type: "text", value: "Mr. Pradhuman Singh Shekhawat", order: 3 },
        { label: "Principal Name & Designation", type: "text", value: "Mrs. Sunita Rathore (Principal)", order: 4 },
        { label: "Affiliation No. (if applicable)", type: "text", value: "CBSE Affiliated", order: 5 },
        { label: "School Code (if applicable)", type: "text", value: "Available at School Office", order: 6 },
        { label: "Complete Address with Pin Code", type: "text", value: "Sikar Road, Nangal, Tehsil Udaipurwati, District Jhunjhunu, Rajasthan - 333307", order: 7 },
        { label: "School Email ID", type: "text", value: "siddharthinternationalschool15@gmail.com", order: 8 },
        { label: "Contact Details (Mobile / Tel)", type: "text", value: "+91 7568419751, +91 7568419752, +91 9351449752", order: 9 },
      ],
    },
    {
      category: categoryId,
      title: "B. Documents and Information",
      slug: "documents-and-information",
      description: "Statutory affiliation documents, trust deed, and official certificates",
      order: 2,
      status: "published",
      createdBy: adminId,
      updatedBy: adminId,
      createdAt: now,
      updatedAt: now,
      fields: [
        {
          label: "Copies of Societies / Trust / Company Registration Certificate",
          type: "document",
          value: "/uploads/documents/society-registration-certificate.pdf",
          order: 1,
        },
        {
          label: "Copy of Safe Drinking Water and Sanitary Condition Certificate",
          type: "document",
          value: "/uploads/documents/water-and-sanitation-certificate.pdf",
          order: 2,
        },
        {
          label: "List of School Management Committee (SMC)",
          type: "document",
          value: "/uploads/documents/school-management-committee-smc.pdf",
          order: 3,
        },
        {
          label: "List of Parents Teachers Association (PTA) Members",
          type: "document",
          value: "/uploads/documents/parents-teachers-association-pta.pdf",
          order: 4,
        },
        {
          label: "Copy of Valid Building Safety Certificate as per the National Building Code",
          type: "text",
          value: "Inspected and Approved (Available at School Office)",
          order: 5,
        },
        {
          label: "Copy of Valid Fire Safety Certificate Issued by Competent Authority",
          type: "text",
          value: "Certified and Installed across all blocks (Available at School Office)",
          order: 6,
        },
        {
          label: "Fee Structure of the School",
          type: "url",
          value: "/admissions",
          order: 7,
        },
        {
          label: "Annual Academic Calendar",
          type: "text",
          value: "In compliance with CBSE Academic Session 2026–27",
          order: 8,
        },
      ],
    },
    {
      category: categoryId,
      title: "C. Result and Academics",
      slug: "result-and-academics",
      description: "Academic performance and institutional committees",
      order: 3,
      status: "published",
      createdBy: adminId,
      updatedBy: adminId,
      createdAt: now,
      updatedAt: now,
      fields: [
        { label: "Fee Structure for the Session", type: "text", value: "Affordable fee structure in compliance with Rajasthan Education Guidelines", order: 1 },
        { label: "Annual Academic Calendar", type: "text", value: "April to March Session as per CBSE directives", order: 2 },
        { label: "List of School Management Committee (SMC)", type: "document", value: "/uploads/documents/school-management-committee-smc.pdf", order: 3 },
        { label: "List of Parents-Teachers Association (PTA) Members", type: "document", value: "/uploads/documents/parents-teachers-association-pta.pdf", order: 4 },
        { label: "Last Three-Year Result of the Board Examination", type: "text", value: "100% Pass Percentage with multiple distinctions", order: 5 },
      ],
    },
    {
      category: categoryId,
      title: "D. Staff (Teaching)",
      slug: "staff-teaching",
      description: "Faculty strength and student-teacher ratio",
      order: 4,
      status: "published",
      createdBy: adminId,
      updatedBy: adminId,
      createdAt: now,
      updatedAt: now,
      fields: [
        { label: "Principal", type: "text", value: "1 (Mrs. Sunita Rathore)", order: 1 },
        { label: "Total Number of Teachers", type: "number", value: 25, order: 2 },
        { label: "PGT (Post Graduate Teachers)", type: "number", value: 8, order: 3 },
        { label: "TGT (Trained Graduate Teachers)", type: "number", value: 10, order: 4 },
        { label: "PRT (Primary Teachers)", type: "number", value: 7, order: 5 },
        { label: "Teachers-Section Ratio", type: "text", value: "1:1.5", order: 6 },
        { label: "Details of Special Educator", type: "text", value: "Appointed as per CBSE norms", order: 7 },
        { label: "Details of Counsellor and Wellness Teacher", type: "text", value: "Appointed as per CBSE norms", order: 8 },
      ],
    },
    {
      category: categoryId,
      title: "E. School Infrastructure",
      slug: "school-infrastructure",
      description: "Physical facilities, land area, and safety installations",
      order: 5,
      status: "published",
      createdBy: adminId,
      updatedBy: adminId,
      createdAt: now,
      updatedAt: now,
      fields: [
        { label: "Total Campus Area of the School", type: "text", value: "Spacious campus with multi-storey building and expansive playgrounds", order: 1 },
        { label: "Number and Size of the Classrooms", type: "text", value: "25+ Classrooms (Spacious, well-ventilated, smart-board equipped)", order: 2 },
        { label: "Number and Size of Laboratories (Physics, Chem, Bio, Comp)", type: "text", value: "5 Well-equipped laboratories with modern apparatus & safety equipment", order: 3 },
        { label: "Internet Facility", type: "text", value: "Yes (High-Speed Fiber-Optic Wi-Fi)", order: 4 },
        { label: "Number of Girls Toilets", type: "number", value: 12, order: 5 },
        { label: "Number of Boys Toilets", type: "number", value: 14, order: 6 },
        { label: "Link of YouTube Video of the Campus Inspection", type: "url", value: "https://www.facebook.com/profile.php?id=100078106855197&sk=videos", order: 7 },
      ],
    },
  ];

  await db.collection("disclosuresections").insertMany(sectionsData);

  // 5. GALLERY ALBUMS & ITEMS
  console.log("Seeding Gallery Albums and Items with Real School Photos...");
  await db.collection("galleryalbums").deleteMany({});
  await db.collection("galleryitems").deleteMany({});

  const album1 = {
    title: "Campus Infrastructure & Architecture",
    slug: "campus-infrastructure",
    description: "Modern academic blocks, smart classrooms, science labs, and serene assembly grounds at Siddharth International School, Nangal.",
    coverImage: "/uploads/campus/siddharth-campus-main.jpg",
    type: "photo",
    status: "published",
    order: 1,
    isDeleted: false,
    createdBy: adminId,
    updatedBy: adminId,
    createdAt: now,
    updatedAt: now,
  };

  const album2 = {
    title: "Spectra Annual Sports Meet & Athletics",
    slug: "annual-sports-meet",
    description: "Exciting athletic track events, obstacle races, inter-house championships, and fitness celebrations at Siddharth International School.",
    coverImage: "/uploads/events/sports-day-races.jpg",
    type: "photo",
    status: "published",
    order: 2,
    isDeleted: false,
    createdBy: adminId,
    updatedBy: adminId,
    createdAt: now,
    updatedAt: now,
  };

  const album3 = {
    title: "Cultural & Patriotic Celebrations",
    slug: "cultural-patriotic-celebrations",
    description: "Independence Day and Republic Day celebrations, grand tricolor displays, stage dramas, and morning assembly reflections.",
    coverImage: "/uploads/events/national-flag-celebration.jpg",
    type: "photo",
    status: "published",
    order: 3,
    isDeleted: false,
    createdBy: adminId,
    updatedBy: adminId,
    createdAt: now,
    updatedAt: now,
  };

  const album4 = {
    title: "School Leadership & Felicitations",
    slug: "leadership-felicitations",
    description: "Honoring leadership, welcome ceremonies, teacher recognitions, and annual guest felicitations at SIS.",
    coverImage: "/uploads/leadership/principal-and-director.jpg",
    type: "photo",
    status: "published",
    order: 4,
    isDeleted: false,
    createdBy: adminId,
    updatedBy: adminId,
    createdAt: now,
    updatedAt: now,
  };

  const album5 = {
    title: "Campus Life & Event Video Highlights",
    slug: "campus-video-highlights",
    description: "Watch live celebrations, student performances, and sports highlights on our official Facebook video channel.",
    coverImage: "/uploads/campus/morning-assembly-ground.jpg",
    type: "video",
    status: "published",
    order: 5,
    isDeleted: false,
    createdBy: adminId,
    updatedBy: adminId,
    createdAt: now,
    updatedAt: now,
  };

  const a1Res = await db.collection("galleryalbums").insertOne(album1);
  const a2Res = await db.collection("galleryalbums").insertOne(album2);
  const a3Res = await db.collection("galleryalbums").insertOne(album3);
  const a4Res = await db.collection("galleryalbums").insertOne(album4);
  const a5Res = await db.collection("galleryalbums").insertOne(album5);

  const galleryItems = [
    // Album 1: Campus Infrastructure
    {
      album: a1Res.insertedId,
      type: "image",
      url: "/uploads/campus/siddharth-campus-main.jpg",
      title: "Main Campus Building Front Elevation",
      caption: "Siddharth International School front elevation on Sikar Road, Nangal, Udaipurwati",
      order: 1,
      createdAt: now,
      updatedAt: now,
    },
    {
      album: a1Res.insertedId,
      type: "image",
      url: "/uploads/campus/siddharth-academic-block.jpg",
      title: "Academic Block & Administrative Wing",
      caption: "Modern multi-storey block housing smart classrooms, labs, and administration",
      order: 2,
      createdAt: now,
      updatedAt: now,
    },
    {
      album: a1Res.insertedId,
      type: "image",
      url: "/uploads/campus/morning-assembly-ground.jpg",
      title: "Lush Green Morning Assembly Ground",
      caption: "Spacious assembly ground where daily morning prayers and exercises take place",
      order: 3,
      createdAt: now,
      updatedAt: now,
    },

    // Album 2: Sports Meet (Spectra)
    {
      album: a2Res.insertedId,
      type: "image",
      url: "/uploads/events/sports-day-races.jpg",
      title: "Spectra Annual Sports Obstacle & Sack Race",
      caption: "Junior students demonstrating agility and spirit in the sack and hoop races",
      order: 1,
      createdAt: now,
      updatedAt: now,
    },
    {
      album: a2Res.insertedId,
      type: "image",
      url: "/uploads/events/national-flag-celebration.jpg",
      title: "Sports House Champions & Running Tracks",
      caption: "Siddharth International School students on athletic field in official house jerseys",
      order: 2,
      createdAt: now,
      updatedAt: now,
    },

    // Album 3: Cultural & Patriotic
    {
      album: a3Res.insertedId,
      type: "image",
      url: "/uploads/events/national-flag-celebration.jpg",
      title: "Grand Indian Tricolor Performance",
      caption: "Spectacular patriotic tribute and cultural presentation by SIS students",
      order: 1,
      createdAt: now,
      updatedAt: now,
    },
    {
      album: a3Res.insertedId,
      type: "image",
      url: "/uploads/campus/morning-assembly-ground.jpg",
      title: "All-School Assembly & National Anthem",
      caption: "Students and teachers gathered for assembly on the school campus grounds",
      order: 2,
      createdAt: now,
      updatedAt: now,
    },

    // Album 4: Leadership & Felicitations
    {
      album: a4Res.insertedId,
      type: "image",
      url: "/uploads/leadership/principal-and-director.jpg",
      title: "Principal & Director Felicitation Ceremony",
      caption: "Principal Mrs. Sunita Rathore felicitating Director Mr. Pradhuman Singh Shekhawat at Welcome Ceremony",
      order: 1,
      createdAt: now,
      updatedAt: now,
    },
    {
      album: a4Res.insertedId,
      type: "image",
      url: "/uploads/leadership/director-welcome-safa.jpg",
      title: "Traditional Rajasthani Safa Honor",
      caption: "Director Mr. Pradhuman Singh Shekhawat honored with traditional red Pagri at SIS auditorium",
      order: 2,
      createdAt: now,
      updatedAt: now,
    },

    // Album 5: Video Gallery
    {
      album: a5Res.insertedId,
      type: "video",
      url: "https://www.facebook.com/profile.php?id=100078106855197&sk=videos",
      thumbnailUrl: "/uploads/events/national-flag-celebration.jpg",
      title: "Annual Sports Meet & Cultural Gala (Official Video Coverage)",
      caption: "Watch live event celebrations and performances on the SIS Facebook Video Channel",
      order: 1,
      createdAt: now,
      updatedAt: now,
    },
  ];

  await db.collection("galleryitems").insertMany(galleryItems);

  // 6. CMS PAGES (About Us, Admissions, Facilities, Curriculum)
  console.log("Seeding CMS Pages...");
  const pagesData = [
    {
      title: "About Siddharth International School",
      slug: "about",
      description: "Learn about our vision, leadership, management, values, and pedagogical commitment.",
      status: "published",
      banner: "/uploads/campus/siddharth-campus-main.jpg",
      blocks: [
        {
          type: "rich-text",
          order: 1,
          content: {
            html: `
              <h2>Welcome to Siddharth International School</h2>
              <p>Established under the aegis of <strong>Shree Shyam Shiksha Samiti</strong> (Reg. No. 68/झूं/11-12), Siddharth International School is situated on Sikar Road, Nangal, in the historic tehsil of Udaipurwati, District Jhunjhunu, Rajasthan.</p>
              <p>Our institution was founded on the fundamental principle that every child deserves access to premier English-medium schooling. Our motto, <em>"Sky is the limit"</em>, encourages every student to surpass limitations, discover personal passions, and aspire for greatness.</p>
              
              <h3>Our School Leadership</h3>
              <ul>
                <li><strong>Chairman:</strong> Mr. Ajeet Singh Shekhawat</li>
                <li><strong>Director:</strong> Mr. Pradhuman Singh Shekhawat</li>
                <li><strong>Principal:</strong> Mrs. Sunita Rathore</li>
              </ul>

              <h3>Our Core Pillars</h3>
              <ul>
                <li><strong>Academic Rigour:</strong> Comprehensive CBSE curriculum delivered by PG and B.Ed trained professionals.</li>
                <li><strong>Character & Values:</strong> Rooted in traditional Indian ethics, empathy, and community service.</li>
                <li><strong>Safe & Healthy Environment:</strong> Certified drinking water, hygienic sanitation, and 24/7 CCTV surveillance.</li>
                <li><strong>Extracurricular Horizon:</strong> Robust athletics, performing arts, public speaking, and digital coding skills.</li>
              </ul>
            `,
          },
        },
      ],
      createdBy: adminId,
      updatedBy: adminId,
      isDeleted: false,
      createdAt: now,
      updatedAt: now,
    },
    {
      title: "Admissions 2026–27",
      slug: "admissions",
      description: "Join our vibrant academic community. Admissions are open for Nursery through Class XII.",
      status: "published",
      banner: "/uploads/campus/morning-assembly-ground.jpg",
      blocks: [
        {
          type: "rich-text",
          order: 1,
          content: {
            html: `
              <h2>Admission Procedure (Academic Session 2026–27)</h2>
              <p>We welcome applications from parents seeking an enriching, disciplined, and nurturing educational home for their children. Admissions are open for Pre-Primary (Nursery, LKG, UKG) through Senior Secondary (Class XII).</p>
              
              <h3>Step-by-Step Admission Process</h3>
              <ol>
                <li><strong>Registration & Inquiry:</strong> Collect the admission form from the school counter or submit an inquiry through our portal.</li>
                <li><strong>Interaction / Assessment:</strong> An age-appropriate informal interaction for junior classes or a basic competency test for higher grades.</li>
                <li><strong>Document Verification:</strong> Submission of Birth Certificate, Transfer Certificate (TC), previous report cards, and photographs.</li>
                <li><strong>Confirmation:</strong> Completion of admission formalities and fee submission upon confirmation.</li>
              </ol>

              <h3>Helpdesk & Inquiries</h3>
              <p>Contact our admission counselors at: <strong>+91 7568419751, +91 7568419752, +91 9351449752</strong><br/>
              Email: <strong>siddharthinternationalschool15@gmail.com</strong><br/>
              Visiting Hours: 8:00 AM to 2:00 PM (Monday to Saturday)</p>
            `,
          },
        },
      ],
      createdBy: adminId,
      updatedBy: adminId,
      isDeleted: false,
      createdAt: now,
      updatedAt: now,
    },
    {
      title: "Campus Facilities & Infrastructure",
      slug: "facilities",
      description: "State-of-the-art campus infrastructure designed for holistic learning.",
      status: "published",
      banner: "/uploads/campus/siddharth-academic-block.jpg",
      blocks: [
        {
          type: "rich-text",
          order: 1,
          content: {
            html: `
              <h2>World-Class Infrastructure in Nangal, Udaipurwati</h2>
              <p>Our campus provides an exceptional physical and digital learning environment spread across spacious, secure grounds.</p>

              <h3>Key Highlights:</h3>
              <ul>
                <li><strong>Smart Classrooms:</strong> Well-ventilated, acoustically designed, and equipped with audiovisual interactive learning aids.</li>
                <li><strong>Science Laboratories:</strong> Comprehensive Physics, Chemistry, and Biology laboratories equipped with modern apparatus.</li>
                <li><strong>Computer & IT Centre:</strong> High-speed internet, modern computer terminals, and coding curricula for 21st-century digital literacy.</li>
                <li><strong>Library & Resource Centre:</strong> Thousands of books covering academics, literature, encyclopedia, and periodicals.</li>
                <li><strong>Sports Complex:</strong> Dedicated grounds for cricket, volleyball, badminton, athletics, obstacle courses, and yoga.</li>
                <li><strong>Safe Transport:</strong> Extensive fleet of buses equipped with speed governors and GPS tracking covering Udaipurwati and neighboring areas.</li>
                <li><strong>Sanitation & Health:</strong> Certified safe drinking water (CBMO certified) and separate hygienic washrooms for boys and girls.</li>
              </ul>
            `,
          },
        },
      ],
      createdBy: adminId,
      updatedBy: adminId,
      isDeleted: false,
      createdAt: now,
      updatedAt: now,
    },
    {
      title: "Curriculum & Academics",
      slug: "curriculum",
      description: "CBSE aligned 4-tier developmental stage pedagogy.",
      status: "published",
      banner: "/uploads/events/sports-day-races.jpg",
      blocks: [
        {
          type: "rich-text",
          order: 1,
          content: {
            html: `
              <h2>4-Stage Academic Framework (NEP & CBSE Aligned)</h2>
              <p>Our curriculum is structured to support the natural developmental progression of every child from early childhood through secondary school.</p>

              <h3>1. Foundation Stage (Nursery to Class II - Ages 3 to 8)</h3>
              <p>Joyful learning centered on play, phonics, number games, sensory development, drawing, storytelling, and social bonding.</p>

              <h3>2. Preparatory Stage (Class III to V - Ages 8 to 11)</h3>
              <p>Conceptual clarity in Mathematics, Environmental Studies (EVS), English, and Hindi. Introduction to reading comprehension and experimental inquiry.</p>

              <h3>3. Middle Stage (Class VI to VIII - Ages 11 to 14)</h3>
              <p>Subject specialization with hands-on lab experiments, coding, social sciences, sports training, and debate.</p>

              <h3>4. Secondary & Senior Secondary Stage (Class IX to XII - Ages 14 to 18)</h3>
              <p>Rigorous CBSE board syllabus, test series, analytical problem-solving, science practicals, and preparation for board examinations and competitive careers.</p>
            `,
          },
        },
      ],
      createdBy: adminId,
      updatedBy: adminId,
      isDeleted: false,
      createdAt: now,
      updatedAt: now,
    },
  ];

  for (const p of pagesData) {
    await db.collection("pages").updateOne(
      { slug: p.slug },
      { $set: p },
      { upsert: true }
    );
  }

  console.log("All data successfully seeded matching Modi World School UI layout!");
  process.exit(0);
}

seedSiddharthData().catch((err) => {
  console.error("Error seeding data:", err);
  process.exit(1);
});
