const mongoose = require("mongoose");
const Lessons = require("../models/Lesson"); // your model

mongoose.connect(process.env.MONGO_URI).then(() => {
  
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});


async function migrate() {
    try {
        const result = await Lessons.updateMany(
            {
                averageRating: { $exists: false }
            },
            {
                $set: {
                    averageRating: 0,
                    ratingSum: 0,
                    totalRatings: 0
                }
            }
        );

        console.log(result);
        console.log("Migration complete");
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

migrate();