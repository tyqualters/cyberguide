import /*mongoose,*/ { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
  username: String,
  password: String,
  isAdmin: {type: Boolean, default: false}
});

const User = models.User || model('User', UserSchema);
export default User;