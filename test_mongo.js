const { MongoClient } = require('mongodb');

const url =
  'mongodb+srv://kcprabin2063_db_user:rambabu123@data.pstsfqw.mongodb.net/?appName=Data';

async function insertHotels() {
  const client = new MongoClient(url);

  try {
    await client.connect();
    console.log('Successfully connected to MongoDB!');

    const db = client.db('test');
    const collection = db.collection('hotels');

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
            capacity: 2
          },
          {
            roomType: "Deluxe Room",
            price: 180,
            available: true,
            beds: 2,
            capacity: 3
          },
          {
            roomType: "Suite",
            price: 250,
            available: false,
            beds: 2,
            capacity: 4
          }
        ]
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
            capacity: 2
          },
          {
            roomType: "Family Room",
            price: 140,
            available: true,
            beds: 3,
            capacity: 5
          }
        ]
      }
    ];

    const result = await collection.insertMany(hotelsData);

    console.log(`${result.insertedCount} hotels were successfully inserted!`);
    console.log('Inserted IDs:', result.insertedIds);

  } catch (error) {
    console.error('Operation failed:', error);
  } finally {
    await client.close();
    console.log('Connection closed.');
  }
}

insertHotels();