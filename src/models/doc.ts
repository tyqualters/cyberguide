import /*mongoose,*/ { Schema, model, models } from 'mongoose';

const DocSchema = new Schema({
  title: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  tags: { type: [String], default: [] },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  isPublic: { type: Boolean, default: true },
});

const Doc = models.Doc || model('Doc', DocSchema);
export default Doc;