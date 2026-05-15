const { MongoClient } = require('mongodb');

const url = 'mongodb+srv://kcprabin2063_db_user:rambabu123@data.pstsfqw.mongodb.net/?appName=Data';

async function insertHotels() {
  const client = new MongoClient(url);
  
  try {
    
    await client.connect();
    console.log('Successfully connected to MongoDB!');
    
    
    const db = client.db('test');
    const collection = db.collection('hotels');
   
    const hotelsData = [
      { name: "The Grand Everest", location: "Kathmandu", rating: 4.8, pricePerNight: 120 },
      { name: "Lakeside Retreat", location: "Pokhara", rating: 4.5, pricePerNight: 85 },
      { name: "Jungle Safari Lodge", location: "Chitwan", rating: 4.2, pricePerNight: 150 },
      { name: "Himalayan Sunrise Inn", location: "Nagarkot", rating: 4.6, pricePerNight: 95 },
      { name: "Heritage Boutique Hotel", location: "Bhaktapur", rating: 4.7, pricePerNight: 110 }
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