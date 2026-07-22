const mongoose = require('mongoose');

const localUri = 'mongodb://localhost:27017/badminton-shop';
const remoteUri = 'mongodb+srv://admin:admin123@cluster0.stag0vo.mongodb.net/badminton?retryWrites=true&w=majority';

async function migrateData() {
    console.log('Connecting to local and remote databases...');
    const localDb = mongoose.createConnection(localUri);
    const remoteDb = mongoose.createConnection(remoteUri);

    await Promise.all([
        new Promise(resolve => localDb.once('open', resolve)),
        new Promise(resolve => remoteDb.once('open', resolve))
    ]);

    console.log('Connected to both databases.');

    // Lấy danh sách các collections từ local
    const collections = await localDb.db.listCollections().toArray();
    
    for (let col of collections) {
        const collectionName = col.name;
        console.log(`Migrating collection: ${collectionName}...`);
        
        // Đọc tất cả data từ local
        const data = await localDb.db.collection(collectionName).find({}).toArray();
        
        if (data.length > 0) {
            // Xóa data cũ trên remote để tránh trùng lặp
            await remoteDb.db.collection(collectionName).deleteMany({});
            
            // Insert data vào remote
            await remoteDb.db.collection(collectionName).insertMany(data);
            console.log(`- Inserted ${data.length} documents into ${collectionName}`);
        } else {
            console.log(`- Collection ${collectionName} is empty, skipping.`);
        }
    }

    console.log('Migration completed successfully!');
    localDb.close();
    remoteDb.close();
    process.exit(0);
}

migrateData().catch(err => {
    console.error('Migration failed:', err);
    process.exit(1);
});
