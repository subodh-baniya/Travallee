import { MongoClient } from "mongodb";

// 🔥 HOTELS DATA
const hotels = [
  {
    userID: "682a1f2b3c4d5e6f7a8b9c01",
    ownerName: "Ram Sharma",
    hotelDescription:
      "A premium resort in Chitwan offering luxury rooms, jungle safari experiences, and peaceful surroundings.",
    hotelLocation: "Bharatpur, Chitwan, Nepal",
    hotelName: "CMT Resort",
    hotelImages: [
      "https://www.cmthotel.com/images/gallery/galleryimages/fLw6W-davnj-room8-min.jpg",
      "https://www.cmthotel.com/images/gallery/galleryimages/GzyLG-apmgw-room7-min.jpg"
    ],
    propertyType: "Resort",
    verified: true,
    VerificationDocuments: ["Citizenship", "Passport"],
    contactNumber: "9841234567",
    isactive: true,
    facilities: ["Free WiFi", "Swimming Pool", "Restaurant", "Parking", "Safari Tour"],
    checkinTime: "2:00 PM",
    checkoutTime: "12:00 PM",
    pricePerNight: 140,
    rating: 4.7,
    numberOfReviews: 320,
    isFeatured: true,
    roomIDs: ["room_1a", "room_1b", "room_1c"],
  },

  {
    userID: "682a1f2b3c4d5e6f7a8b9c02",
    ownerName: "Sita Karki",
    hotelDescription: "A heritage-style luxury hotel located in Bhaktapur.",
    hotelLocation: "Bhaktapur, Nepal",
    hotelName: "Heritage Palace Hotel",
    hotelImages: [
      "https://via.placeholder.com/1200x800.png?text=Heritage+Palace+Hotel+1",
      "https://via.placeholder.com/1200x800.png?text=Heritage+Palace+Hotel+2"
    ],
    propertyType: "Hotel",
    verified: true,
    VerificationDocuments: ["Driving License", "NID"],
    contactNumber: "9851122334",
    isactive: true,
    facilities: ["Free Breakfast", "Restaurant", "Free WiFi", "Parking", "Conference Hall"],
    checkinTime: "1:00 PM",
    checkoutTime: "11:00 AM",
    pricePerNight: 110,
    rating: 4.5,
    numberOfReviews: 210,
    isFeatured: true,
    roomIDs: ["room_2a", "room_2b"],
  },

  {
    userID: "682a1f2b3c4d5e6f7a8b9c03",
    ownerName: "Bikash Thapa",
    hotelDescription: "Safari Jungle Camp in Chitwan with jungle safari experience.",
    hotelLocation: "Sauraha, Chitwan, Nepal",
    hotelName: "Safari Jungle Camp",
    hotelImages: [
      "https://via.placeholder.com/1200x800.png?text=Safari+Jungle+Camp+1",
      "https://via.placeholder.com/1200x800.png?text=Safari+Jungle+Camp+2"
    ],
    propertyType: "Jungle Camp",
    verified: true,
    VerificationDocuments: ["NID", "Passport"],
    contactNumber: "9865544332",
    isactive: true,
    facilities: ["Jungle Safari", "Free WiFi"],
    checkinTime: "12:00 PM",
    checkoutTime: "10:00 AM",
    pricePerNight: 85,
    rating: 4.3,
    numberOfReviews: 145,
    isFeatured: false,
    roomIDs: ["room_3a", "room_3b", "room_3c"],
  },

  {
    userID: "682a1f2b3c4d5e6f7a8b9c04",
    ownerName: "Nabin Adhikari",
    hotelDescription:
      "A peaceful mountain resort famous for sunrise and Himalayan views.",
    hotelLocation: "Nagarkot, Nepal",
    hotelName: "Mountain View Resort",
    hotelImages: [
      "https://via.placeholder.com/1200x800.png?text=Mountain+View+Resort+1",
      "https://via.placeholder.com/1200x800.png?text=Mountain+View+Resort+2"
    ],
    propertyType: "Resort",
    verified: true,
    VerificationDocuments: ["Citizenship", "Driving License"],
    contactNumber: "9819988776",
    isactive: true,
    facilities: ["Mountain View", "Bonfire", "Restaurant", "Free WiFi", "Parking"],
    checkinTime: "3:00 PM",
    checkoutTime: "12:00 PM",
    pricePerNight: 170,
    rating: 4.8,
    numberOfReviews: 410,
    isFeatured: true,
    roomIDs: ["room_4a", "room_4b"],
  },

  {
    userID: "682a1f2b3c4d5e6f7a8b9c05",
    ownerName: "Anita Gurung",
    hotelDescription:
      "A relaxing lakeside retreat with modern rooms and scenic views of Phewa Lake.",
    hotelLocation: "Pokhara, Nepal",
    hotelName: "Lakeside Retreat",
    hotelImages: [
      "https://via.placeholder.com/1200x800.png?text=Lakeside+Retreat+1",
      "https://via.placeholder.com/1200x800.png?text=Lakeside+Retreat+2"
    ],
    propertyType: "Boutique Hotel",
    verified: true,
    VerificationDocuments: ["NID", "Citizenship","Passport"],
    contactNumber: "9807766554",
    isactive: true,
    facilities: ["Lake View", "Restaurant", "Free WiFi", "Boat Service", "Parking"],
    checkinTime: "2:00 PM",
    checkoutTime: "11:00 AM",
    pricePerNight: 125,
    rating: 4.6,
    numberOfReviews: 275,
    isFeatured: true,
    roomIDs: ["room_5a", "room_5b", "room_5c"],
  },

  // Test entry covering union/string transform branches
  {
    userID: "682a1f2b3c4d5e6f7a8b9c06",
    ownerName: "String Variant Hotel",
    hotelDescription: "Test hotel where some fields are provided as comma-strings or boolean-strings to exercise validators.",
    hotelLocation: "Testville, Testland",
    hotelName: "String Variant Inn",
    // hotelImages: replaced with attached image URL placeholder (replace with actual URL or local path)
    hotelImages: [
      "https://via.placeholder.com/1200x800.png?text=String+Variant+Inn"
    ],
    propertyType: "Guest House",
    // boolean-like fields as strings
    verified: "true",
    // VerificationDocuments as comma-separated string
    VerificationDocuments: "NID, Citizenship, Passport",
    contactNumber: "0123456789",
    isactive: "false",
    // facilities as comma-separated string
    facilities: "Free WiFi,Parking,Breakfast",
    checkinTime: "2:00 PM",
    checkoutTime: "12:00 PM",
    // numeric fields provided as strings (coerce will convert)
    pricePerNight: "99",
    rating: "4.2",
    numberOfReviews: "10",
    isFeatured: "false",
    roomIDs: ["room_6a", "room_6b"],
  },
  {
    userID: "682a1f2b3c4d5e6f7a8b9c07",
    ownerName: "Bijaya Neupane",
    hotelDescription: "Comfortable stay at Hotel Pauwa with easy access to Bharatpur amenities and nearby attractions.",
    hotelLocation: "Bharatpur, Chitwan, Nepal",
    hotelName: "Hotel Pauwa Bharatpur",
    hotelImages: [
      "https://cms.hotelpauwa.com/wp-content/uploads/2025/10/hotel_pauwa_0_4.jpg",
      "https://cms.hotelpauwa.com/wp-content/uploads/2025/10/pauwa-hotel-124.jpg"
    ],
    propertyType: "Hotel",
    verified: true,
    VerificationDocuments: ["NID", "Citizenship"],
    contactNumber: "9841239876",
    isactive: true,
    facilities: ["Free WiFi", "Parking", "Restaurant", "24/7 Front Desk"],
    checkinTime: "2:00 PM",
    checkoutTime: "12:00 PM",
    pricePerNight: 95,
    rating: 4.4,
    numberOfReviews: 128,
    isFeatured: false,
    roomIDs: ["room_7a", "room_7b"],
  },
];

const url =
  "mongodb+srv://kcprabin2063_db_user:rambabu123@data.pstsfqw.mongodb.net/test?retryWrites=true&w=majority";

async function run() {
  const client = new MongoClient(url);

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db("test");
    const collection = db.collection("hotels");

    await collection.deleteMany({});
    console.log("Old data deleted");

    await collection.insertMany(hotels);
    console.log("New data inserted successfully");
  } catch (err) {
    console.log("Error:", err);
  } finally {
    await client.close();
    console.log("Connection closed");
  }
}

run();
