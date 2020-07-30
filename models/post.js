const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const PostSchema = new Schema({
  title: String,
  description: String,
  images: [{ url: String, public_id: String }],
  body: String,
  properties: {
    description: String
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
})

PostSchema.plugin(mongoosePaginate)

module.exports = mongoose.model('Post', PostSchema);