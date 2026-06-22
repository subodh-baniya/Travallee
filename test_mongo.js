import 'dotenv/config';
import { MongoClient, ObjectId } from "mongodb";

const url = process.env.MONGO_URI;

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
    roomIDs: [
      new ObjectId("682c000000000000000000a1"),
      new ObjectId("682c000000000000000000a2"),
    ],
  },
  {
    userID: "682a1f2b3c4d5e6f7a8b9c02",
    ownerName: "Sita Karki",
    hotelDescription: "A heritage-style luxury hotel located in Bhaktapur.",
    hotelLocation: "Bhaktapur, Nepal",
    hotelName: "Heritage Palace Hotel",
    hotelImages: [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtjGV2PAijSOkn60es1e2Eo9gF1WvCAHKgoA&s",
      "https://cf.bstatic.com/xdata/images/hotel/max1024x768/173372452.jpg?k=e618be6f84562c35d985e07187388f97f16b54c9ef15015da4872102512b4893&o="
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
    roomIDs: [
      new ObjectId("682c000000000000000000b1"),
      new ObjectId("682c000000000000000000b2"),
    ],
  },
  {
    userID: "682a1f2b3c4d5e6f7a8b9c03",
    ownerName: "Bikash Thapa",
    hotelDescription: "Safari Jungle Camp in Chitwan with jungle safari experience.",
    hotelLocation: "Sauraha, Chitwan, Nepal",
    hotelName: "Safari Jungle Camp",
    hotelImages: [
      "https://www.travelandleisureasia.com/in/hotels/india-hotels/a-tiger-safari-through-the-jungle-camps-of-madhya-pradesh/"
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
    roomIDs: [
      new ObjectId("682c000000000000000000c1"),
      new ObjectId("682c000000000000000000c2"),
    ],
  },
  {
    userID: "682a1f2b3c4d5e6f7a8b9c04",
    ownerName: "Nabin Adhikari",
    hotelDescription:
      "A peaceful mountain resort famous for sunrise and Himalayan views.",
    hotelLocation: "Nagarkot, Nepal",
    hotelName: "Mountain View Resort",
    hotelImages: [
      "https://lh3.googleusercontent.com/gps-cs-s/APNQkAHKqAqE0ES3Rfb-pOHVMOVYsRB2nE4yPJPXC1kJ-dwbKcDeilYIp5ggeATA4XfxDVfoUeSwWOQf6g4ndliR-kMkU6ZQJTiXWLbrh_2NZUkDYg-2lDg25gmD2Z6F5-XWGlCBKSkx=w253-h337-k-no",
      "https://lh3.googleusercontent.com/gps-cs-s/APNQkAFI1PRgP1gwqHo_BLFnqTFReuOJ7TWsM-vj4vEPKo9OEGIAn5YRCSf6qcTt7QRXpRBsr3Zmg40qWj3zi4nNxCBFqFpkKaPGUcsO2oPkc1gVvOeoXEWptK9f5NCejlStfnkqB4kmNA=w253-h379-k-no"
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
    roomIDs: [
      new ObjectId("682c000000000000000000d1"),
      new ObjectId("682c000000000000000000d2"),
    ],
  },
  {
    userID: "682a1f2b3c4d5e6f7a8b9c05",
    ownerName: "Anita Gurung",
    hotelDescription:
      "A relaxing lakeside retreat with modern rooms and scenic views of Phewa Lake.",
    hotelLocation: "Pokhara, Nepal",
    hotelName: "Lakeside Retreat",
    hotelImages: [
      "https://lh3.googleusercontent.com/gps-cs-s/APNQkAHmFhJSPTFgXCBBrvmQT74Xv1IQaBDKehSJWkY3WDCDoPsgDZc6cWKCw01fZq_LEGjgP5MaEC657xirsXtW6zk7qVfa2eEwbrWhCHaYFuuKKqZnywfV1IT1_jyFZ6U2aOY9roVV=s1360-w1360-h1020-rw",
      "https://lh3.googleusercontent.com/gps-cs-s/APNQkAFUWBygF2pF9pwp9PmHnmE21Drh-tVUqA75iJ6VPpPMj1Y1aTRPKXvXqO1jiSU-KQnEDK97jODJBXuKyCZTOCcCYsD0OVXWlUNQXWAIBonSpu5wTzAu4zfJficeM4dOjVj8dqgr=s1360-w1360-h1020-rw"
    ],
    propertyType: "Boutique Hotel",
    verified: true,
    VerificationDocuments: ["NID", "Citizenship", "Passport"],
    contactNumber: "9807766554",
    isactive: true,
    facilities: ["Lake View", "Restaurant", "Free WiFi", "Boat Service", "Parking"],
    checkinTime: "2:00 PM",
    checkoutTime: "11:00 AM",
    pricePerNight: 125,
    rating: 4.6,
    numberOfReviews: 275,
    isFeatured: true,
    roomIDs: [
      new ObjectId("682c000000000000000000e1"),
      new ObjectId("682c000000000000000000e2"),
    ],
  },
  {
    userID: "682a1f2b3c4d5e6f7a8b9c06",
    ownerName: "Hari Acharya",
    hotelDescription: "Test hotel where some fields are provided as comma-strings or boolean-strings to exercise validators.",
    hotelLocation: "Bharatpur Chitwan",
    hotelName: "Green HAmlet Resort",
    hotelImages: [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7HkFwGkSFHgbSSw42eH4ykTK64owOU7L7Mw&s"
    ],
    propertyType: "Guest House",
    verified: "true",
    VerificationDocuments: "NID, Citizenship, Passport",
    contactNumber: "0123456789",
    isactive: "false",
    facilities: "Free WiFi,Parking,Breakfast",
    checkinTime: "2:00 PM",
    checkoutTime: "12:00 PM",
    pricePerNight: "99",
    rating: "4.2",
    numberOfReviews: "10",
    isFeatured: "false",
    roomIDs: [
      new ObjectId("682c000000000000000000f1"),
      new ObjectId("682c000000000000000000f2"),
    ],
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
    roomIDs: [
      new ObjectId("682c00000000000000000071"),
      new ObjectId("682c00000000000000000072"),
    ],
  },
  {
    userID: "682a1f2b3c4d5e6f7a8b9c11",
    ownerName: "Imanatha Poudel",
    hotelDescription: "A beautiful and expansive resort featuring lush gardens, modern comfortable twin-bed rooms, and excellent hospitality in Bharatpur.",
    hotelLocation: "Bharatpur, Chitwan, Nepal",
    hotelName: "Chitwan Garden Resort",
    hotelImages: [
      "https://cdn.esewahotels.com/hotels/1669957030-108704049.jpeg"
    ],
    propertyType: "Resort",
    verified: true,
    VerificationDocuments: ["Business License", "Citizenship"],
    contactNumber: "9855012345",
    isactive: true,
    facilities: ["Garden", "Free WiFi", "Air Conditioning", "Restaurant", "Parking", "Flat-screen TV"],
    checkinTime: "2:00 PM",
    checkoutTime: "12:00 PM",
    pricePerNight: 1500,
    rating: 4.5,
    numberOfReviews: 215,
    isFeatured: true,
    roomIDs: [
      new ObjectId("682c000000000000000000ab"),
      new ObjectId("682c000000000000000000ac"),
    ],
  },
  {
    userID: "682a1f2b3c4d5e6f7a8b9c12",
    ownerName: "Bishal Gurung",
    hotelDescription: "A serene riverside resort nestled along the banks of the Trishuli River, offering a perfect blend of relaxation and adventure.",
    hotelLocation: "Kurintar, Chitwan, Nepal",
    hotelName: "Kurintar Retreat",
    hotelImages: [
      "https://cdn.esewahotels.com/hotels/1727841459-1345421675.jpg"
    ],
    propertyType: "Resort",
    verified: true,
    VerificationDocuments: ["Business License", "Citizenship"],
    contactNumber: "9800011223",
    isactive: true,
    facilities: ["Swimming Pool", "Riverside Dining", "Free WiFi", "Parking", "Bar"],
    checkinTime: "2:00 PM",
    checkoutTime: "11:00 AM",
    pricePerNight: 1500,
    rating: 4.6,
    numberOfReviews: 180,
    isFeatured: true,
    roomIDs: [
      new ObjectId("682c000000000000000000ad"),
      new ObjectId("682c000000000000000000ae"),
    ],
  },
  {
    userID: "682a1f2b3c4d5e6f7a8b9c13",
    ownerName: "Aama Gurung",
    hotelDescription: "An authentic Gurung family-run homestay offering traditional stone-house architecture, home-cooked local organic meals, and direct panoramic views of Annapurna South, Machhapuchhre, and Hiunchuli.",
    hotelLocation: "Annapurna-10, Ghandruk, Kaski, Nepal",
    hotelName: "Ashish Aama Homestay",
    hotelImages: [
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/11/a5/3a/83/night-shot.jpg?w=900&h=-1&s=1",
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0b/45/57/52/morning-view-from-ashish.jpg?w=700&h=-1&s=1"
    ],
    propertyType: "Homestay",
    verified: true,
    VerificationDocuments: ["Local Ward Registration Certificate", "Citizenship"],
    contactNumber: "9806673025",
    isactive: true,
    facilities: ["Traditional Dining", "Mountain View Terrace", "Free WiFi", "Hot Shower", "Gurung Cultural Dress Experience"],
    checkinTime: "2:00 PM",
    checkoutTime: "11:00 AM",
    pricePerNight: 2000,
    rating: 4.8,
    numberOfReviews: 124,
    isFeatured: true,
    roomIDs: [
      new ObjectId("682c000000000000000000af"),
      new ObjectId("682c000000000000000000b0"),
    ],
  }
];

async function run() {
  if (!url) {
    console.error("❌ Error: MONGO_URI is not defined in your .env file!");
    return;
  }

  const client = new MongoClient(url);

  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");

    const db = client.db("test");
    const collection = db.collection("hotels");

    await collection.deleteMany({});
    console.log("🗑️  Old data deleted");

    await collection.insertMany(hotels);
    console.log("🚀 New data inserted successfully");
  } catch (err) {
    console.error("❌ Error:", err);
  } finally {
    await client.close();
    console.log("🔒 Connection closed");
  }
}

run();