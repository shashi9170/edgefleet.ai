import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { IUser } from '../interfaces/user.interface';


@Schema({ timestamps: true, versionKey: false, })
export class User implements IUser {
  
  id?: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true, index: true, })
  email: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({ trim: true, required: true })
  name: string;
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);


const transform = (_: any, ret: any) => {
  ret.id = ret._id.toString();
  delete ret._id;
  delete ret.password;
};

UserSchema.set('toJSON', {
  virtuals: true,
  transform,
});

UserSchema.set('toObject', {
  virtuals: true,
  transform,
});