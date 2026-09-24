import mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/saint-lawrence";

async function runSeedGallery() {
  console.log("Connecting to MongoDB for Gallery seed...", MONGODB_URI);
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db!;

  const usersCollection = db.collection("users");
  const adminUser = await usersCollection.findOne({});
  const adminId = adminUser?._id || new mongoose.Types.ObjectId();

  const galleryAlbumsCollection = db.collection("galleryalbums");
  const galleryItemsCollection = db.collection("galleryitems");
  const menusCollection = db.collection("menus");

  console.log("1. Seeding Categorized Gallery Albums & Items...");

  const albumsData = [
    {
      title: "Campus Infrastructure & Academic Facilities",
      slug: "campus-infrastructure-facilities",
      description: "Take a visual journey through our state-of-the-art classrooms, scientific research laboratories, digitized library, and green open areas.",
      coverImage: "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1200&auto=format&fit=crop",
      type: "photo",
      status: "published",
      order: 0,
      items: [
        {
          title: "Modern Smart Classrooms",
          caption: "Air-cooled digital learning classrooms equipped with interactive smart boards and ergonomic furniture.",
          url: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=1200&auto=format&fit=crop",
          type: "image",
        },
        {
          title: "Central Knowledge & Digital Library",
          caption: "Over 10,000 reference volumes, academic journals, and high-speed research workstations.",
          url: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=1200&auto=format&fit=crop",
          type: "image",
        },
        {
          title: "Senior Physics & Chemistry Laboratory",
          caption: "Fully equipped experimental stations with precision apparatus for secondary and senior secondary students.",
          url: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=1200&auto=format&fit=crop",
          type: "image",
        },
        {
          title: "Computer Science & AI Hub",
          caption: "Modern computing lab with gigabit fiber network and coding workstations.",
          url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop",
          type: "image",
        },
        {
          title: "Lush Green Central Quadrangle",
          caption: "Open landscaped gardens providing a tranquil and eco-friendly atmosphere for student interaction.",
          url: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?q=80&w=1200&auto=format&fit=crop",
          type: "image",
        },
        {
          title: "Auditorium & Multi-Purpose Hall",
          caption: "Acoustically treated 800-seat amphitheater for seminars, guest lectures, and cultural ceremonies.",
          url: "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200&auto=format&fit=crop",
          type: "image",
        },
      ],
    },
    {
      title: "Annual Sports Meet & Athletic Tournaments",
      slug: "annual-sports-meet-athletics",
      description: "Highlights of athletic vigor, track-and-field events, inter-house football matches, and sportsmanship awards.",
      coverImage: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200&auto=format&fit=crop",
      type: "photo",
      status: "published",
      order: 1,
      items: [
        {
          title: "100m Track Sprint Championship",
          caption: "Senior secondary athletes competing in the annual inter-house track tournament.",
          url: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=1200&auto=format&fit=crop",
          type: "image",
        },
        {
          title: "Inter-House Football Championship",
          caption: "Exciting championship match played on the international-sized school turf.",
          url: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200&auto=format&fit=crop",
          type: "image",
        },
        {
          title: "Basketball League Finals",
          caption: "Students showcasing team agility and sportsmanship on the floodlit synthetic court.",
          url: "https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=1200&auto=format&fit=crop",
          type: "image",
        },
        {
          title: "Annual Sports Trophy Celebration",
          caption: "Winning house team lifting the prestigious Saint Lawrence Overall Champions Shield.",
          url: "https://images.unsplash.com/photo-1526676037777-05a232554f77?q=80&w=1200&auto=format&fit=crop",
          type: "image",
        },
        {
          title: "Early Years Fun Sports & Relay",
          caption: "Junior school pupils participating in cheerful obstacle courses and team races.",
          url: "https://images.unsplash.com/photo-1577495508048-b635879837f1?q=80&w=1200&auto=format&fit=crop",
          type: "image",
        },
      ],
    },
    {
      title: "Annual Cultural Fest & Stage Performances",
      slug: "annual-cultural-fest-performances",
      description: "A celebration of music, theatrical drama, classical Indian dances, orchestra recitals, and creative arts.",
      coverImage: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop",
      type: "photo",
      status: "published",
      order: 2,
      items: [
        {
          title: "Rajasthani Folk Dance Extravaganza",
          caption: "Traditional cultural performance celebrating the heritage and colors of Rajasthan.",
          url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop",
          type: "image",
        },
        {
          title: "School Choir & Instrumental Symphony",
          caption: "Harmonious performance by the junior and senior orchestral music ensembles.",
          url: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=1200&auto=format&fit=crop",
          type: "image",
        },
        {
          title: "English Theatrical Production",
          caption: "Annual stage play directed and performed entirely by secondary school dramatists.",
          url: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?q=80&w=1200&auto=format&fit=crop",
          type: "image",
        },
        {
          title: "Academic & Cultural Award Ceremony",
          caption: "Felicitating meritorious students with certificates of distinction and gold badges.",
          url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop",
          type: "image",
        },
      ],
    },
    {
      title: "Science, AI Robotics & Innovation Expo",
      slug: "science-robotics-art-expo",
      description: "Young innovators presenting working robotics prototypes, renewable energy solutions, and fine art masterpieces.",
      coverImage: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?q=80&w=1200&auto=format&fit=crop",
      type: "photo",
      status: "published",
      order: 3,
      items: [
        {
          title: "Autonomous Obstacle-Avoiding Robot",
          caption: "Robotics club students demonstrating Arduino-powered autonomous navigation.",
          url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1200&auto=format&fit=crop",
          type: "image",
        },
        {
          title: "Solar & Green Energy Working Model",
          caption: "Eco-club prototype generating clean electricity to demonstrate sustainability.",
          url: "https://images.unsplash.com/photo-1509391365360-2e959784a276?q=80&w=1200&auto=format&fit=crop",
          type: "image",
        },
        {
          title: "Fine Arts & Canvas Oil Painting Gallery",
          caption: "Original artworks created by middle and high school students in the creative studio.",
          url: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1200&auto=format&fit=crop",
          type: "image",
        },
        {
          title: "Microscopic Cellular Biology Display",
          caption: "Interactive biology exhibit explaining cellular genetics and botanical specimens.",
          url: "https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=1200&auto=format&fit=crop",
          type: "image",
        },
      ],
    },
    {
      title: "Campus Video Tours & Special Events",
      slug: "campus-video-tours-events",
      description: "Watch video walkthroughs of our campus facilities, sports days, and milestone celebrations.",
      coverImage: "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=1200&auto=format&fit=crop",
      type: "video",
      status: "published",
      order: 4,
      items: [
        {
          title: "Aerial Drone Tour of Saint Lawrence Campus",
          caption: "Panoramic bird's-eye tour of the sports grounds, academic blocks, and infrastructure.",
          url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          type: "video",
        },
        {
          title: "Director's Address on Educational Excellence",
          caption: "Mr. Vikram Singh Rajawat sharing the school's vision for 2026-27.",
          url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          type: "video",
        },
      ],
    },
  ];

  for (const albumData of albumsData) {
    const { items, ...albumFields } = albumData;

    let album = await galleryAlbumsCollection.findOne({ slug: albumFields.slug });
    let albumId;

    if (album) {
      await galleryAlbumsCollection.updateOne(
        { _id: album._id },
        {
          $set: {
            ...albumFields,
            isDeleted: false,
            updatedBy: adminId,
            updatedAt: new Date(),
          },
        }
      );
      albumId = album._id;
      console.log(`✓ Updated album: ${albumFields.title}`);
    } else {
      const res = await galleryAlbumsCollection.insertOne({
        ...albumFields,
        createdBy: adminId,
        updatedBy: adminId,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      albumId = res.insertedId;
      console.log(`✓ Created album: ${albumFields.title}`);
    }

    // Clear previous items and insert fresh categorized items
    await galleryItemsCollection.deleteMany({ album: albumId });

    if (items && items.length > 0) {
      const itemDocs = items.map((item, idx) => ({
        album: albumId,
        title: item.title,
        caption: item.caption,
        url: item.url,
        thumbnailUrl: item.url,
        type: item.type,
        order: idx,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      await galleryItemsCollection.insertMany(itemDocs);
      console.log(`  ↳ Inserted ${items.length} items for album: ${albumFields.title}`);
    }
  }

  console.log("2. Updating Header Navigation to include Gallery Tab...");

  const existingHeaderMenu = await menusCollection.findOne({ location: "header" });
  if (existingHeaderMenu) {
    const items = existingHeaderMenu.items || [];
    const hasGallery = items.some((i: any) => i.url === "/gallery" || i.label?.toLowerCase() === "gallery");

    if (!hasGallery) {
      // Insert Gallery before Contact Us or at end
      const contactIdx = items.findIndex((i: any) => i.url === "/contact");
      const galleryItem = {
        label: "Gallery",
        url: "/gallery",
        target: "_self",
        isEnabled: true,
        order: contactIdx >= 0 ? contactIdx : items.length,
        children: [],
      };

      if (contactIdx >= 0) {
        items.splice(contactIdx, 0, galleryItem);
      } else {
        items.push(galleryItem);
      }

      // Re-index orders
      items.forEach((item: any, i: number) => {
        item.order = i;
      });

      await menusCollection.updateOne(
        { _id: existingHeaderMenu._id },
        { $set: { items, updatedAt: new Date() } }
      );
      console.log("✓ Added Gallery tab to Header Navigation Menu!");
    } else {
      console.log("✓ Gallery tab already present in Header Navigation Menu.");
    }
  }

  await mongoose.disconnect();
  console.log("All Gallery albums and categorized photos seeded successfully!");
}

runSeedGallery().catch((err) => {
  console.error("Gallery seed error:", err);
  process.exit(1);
});
