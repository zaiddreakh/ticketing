import mongoose from 'mongoose';
import { Password } from '../services/password';

// An interface that describes the properties required to create a new  user
interface UserAttrs {
  email: string;
  password: string;
}

// An interface that describes the properties a user Model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// An interface that describes the properties a user Document has (different from UserAttrs because mongoose might add other stuff to a record)
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

// using function keyword to get ahold of 'this' (user document)
// mongoose requires done() to be called
userSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
});

// Adding a function to a mongoose model
// An encapsulating function for the User model to implement the UserAttrs interface and force the correct attributes
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

// User is the mongoose model
const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
