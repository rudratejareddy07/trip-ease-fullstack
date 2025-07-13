const mongoose=require("mongoose");
const Review=require("./review.js");
const Schema=mongoose.Schema;
const listingSchema=new Schema({
    title:{ type:String,
        required:true},
    description :String,
    image :{ url:String,
        filename:String,
    },

    price :Number,
    location:String,
    country :String,
    review:[{ type: Schema.Types.ObjectId, 
        ref: 'Review' }],
    owner:{ type: Schema.Types.ObjectId, 
        ref: 'User' },
    coordinates: {
  type: {
    type: String,
    enum: ['Point'],
    default: 'Point'
  },
  coordinates: {
    type: [Number], // [longitude, latitude]
    default: [0, 0]
  }
}
})

listingSchema.post('findOneAndDelete', async function (listing) {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.review } });
    console.log('Deleted associated reviews');
  }
});
listingSchema.index({ coordinates: '2dsphere' });
const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;