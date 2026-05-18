const { MongoClient } = require("mongodb");

const url =
  "mongodb+srv://kcprabin2063_db_user:rambabu123@data.pstsfqw.mongodb.net/test?retryWrites=true&w=majority";

async function insertHotels() {
  const client = new MongoClient(url);

  try {
    // Connect to MongoDB
    await client.connect();
    console.log("Successfully connected to MongoDB!");

    // Database and collection
    const db = client.db("test");
    const collection = db.collection("hotels");

    // Hotel Data
    const hotelsData = [
      {
        name: "The Grand Everest",
        location: "Kathmandu",
        rating: 4.8,
        pricePerNight: 120,
        rooms: [
          {
            roomType: "Standard Room",
            price: 120,
            available: true,
            beds: 1,
            capacity: 2,
          },
          {
            roomType: "Deluxe Room",
            price: 180,
            available: true,
            beds: 2,
            capacity: 3,
          },
          {
            roomType: "Suite",
            price: 250,
            available: false,
            beds: 2,
            capacity: 4,
          },
        ],
      },

      {
        name: "Lakeside Retreat",
        location: "Pokhara",
        rating: 4.5,
        pricePerNight: 85,
        rooms: [
          {
            roomType: "Standard Room",
            price: 85,
            available: true,
            beds: 1,
            capacity: 2,
          },
          {
            roomType: "Family Room",
            price: 140,
            available: true,
            beds: 3,
            capacity: 5,
          },
        ],
      },

      {
        name: "Mountain View Resort",
        location: "Nagarkot",
        rating: 4.6,
        pricePerNight: 100,
        rooms: [
          {
            roomType: "Mountain Deluxe",
            price: 150,
            available: true,
            beds: 2,
            capacity: 3,
          },
          {
            roomType: "Premium Suite",
            price: 230,
            available: true,
            beds: 2,
            capacity: 4,
          },
        ],
      },

      {
        name: "Safari Jungle Camp",
        location: "Chitwan",
        rating: 4.4,
        pricePerNight: 130,
        rooms: [
          {
            roomType: "Safari Room",
            price: 130,
            available: true,
            beds: 1,
            capacity: 2,
          },
          {
            roomType: "Luxury Cottage",
            price: 210,
            available: false,
            beds: 2,
            capacity: 4,
          },
        ],
      },

      {
        name: "Heritage Palace Hotel",
        location: "Bhaktapur",
        rating: 4.7,
        pricePerNight: 115,
        rooms: [
          {
            roomType: "Heritage Room",
            price: 115,
            available: true,
            beds: 1,
            capacity: 2,
          },
          {
            roomType: "Royal Suite",
            price: 280,
            available: true,
            beds: 3,
            capacity: 5,
          },
        ],
      },
    ];

    // Prevent duplicate insertion
    for (const hotel of hotelsData) {
      const exists = await collection.findOne({ name: hotel.name });

      if (!exists) {
        await collection.insertOne(hotel);
        console.log(`${hotel.name} inserted`);
      } else {
        console.log(`${hotel.name} already exists`);
      }
    }

    console.log("Hotel insertion process completed!");
  } catch (error) {
    console.error("Operation failed:", error);
  } finally {
    await client.close();
    console.log("Connection closed.");
  }
}

insertHotels();