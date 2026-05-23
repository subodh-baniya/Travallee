import { MongoClient } from "mongodb";
const rooms = [
 {
    hotelId: "682a1f2b3c4d5e6f7a8b9c01",
    roomNumber: "101",
    roomType: "Deluxe Double",
    suitetype: "Standard Suite",
    roomDescription: "Spacious deluxe room with premium bedding and a private balcony overlooking the resort gardens.",
    maxOccupancy: 2,
    capacity: 2,
    roomSize: 350,
    bedType: "King Bed",
    floorNumber: 1,
    viewType: "garden",
    basePrice: 140,
    pricePerNight: 140,
    weekendPrice: 160,
    taxRate: 13,
    minStayNights: 1,
    cancellationPolicy: "Free cancellation up to 48 hours before check-in.",
    amenities: ["Tea/Coffee Maker", "Flat-screen TV", "Mini Fridge", "Work Desk"],
    specialFeatures: ["Welcome drinks", "Daily housekeeping"],
    roomImages: ["https://www.cmthotel.com/images/gallery/galleryimages/fLw6W-davnj-room8-min.jpg"],
    isAccessible: true,
    hasBathtub: false,
    hasShower: true,
    hasBalcony: true,
    hasAC: true,
    hasHeating: true,
    hasWifi: true,
    isActive: true,
    isFeatured: true,
    rating: 4.6,
    numberOfReviews: 85,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    hotelId: "682a1f2b3c4d5e6f7a8b9c01",
    roomNumber: "102",
    roomType: "Family Safari View",
    suitetype: "Executive Suite",
    roomDescription: "Larger family style accommodations offering wide window viewpoints out towards the national park buffer zones.",
    maxOccupancy: 4,
    capacity: 4,
    roomSize: 520,
    bedType: "2 Queen Beds",
    floorNumber: 1,
    viewType: "forest", 
    basePrice: 210,
    pricePerNight: 210,
    weekendPrice: 240,
    taxRate: 13,
    minStayNights: 1,
    cancellationPolicy: "Free cancellation up to 48 hours before check-in.",
    amenities: ["Living Area", "Mini Bar", "Safety Box", "Coffee Table"],
    specialFeatures: ["Binoculars provided", "Priority booking for morning safari tours"],
    roomImages: ["https://www.cmthotel.com/images/gallery/galleryimages/GzyLG-apmgw-room7-min.jpg"],
    isAccessible: false,
    hasBathtub: true,
    hasShower: true,
    hasBalcony: true,
    hasAC: true,
    hasHeating: true,
    hasWifi: true,
    isActive: true,
    isFeatured: false,
    rating: 4.8,
    numberOfReviews: 42,
    createdAt: new Date(),
    updatedAt: new Date()
  },

];


async function run() {
  const client = new MongoClient(url);

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db("test");
    const collection = db.collection("rooms"); // Using 'rooms' collection

    // Clear old data
    await collection.deleteMany({});
    console.log("Old rooms data deleted");

    // Insert new rooms
    await collection.insertMany(rooms);
    console.log(`${rooms.length} rooms inserted successfully!`);
  } catch (err) {
    console.log("Error:", err);
  } finally {
    await client.close();
    console.log("Connection closed");
  }
}

run();