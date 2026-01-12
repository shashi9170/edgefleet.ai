import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { IRefreshToken } from '../interfaces/token.interface';

@Schema({
  timestamps: true,
  versionKey: false,
})
export class RefreshToken implements IRefreshToken {

  id?: string;

  @Prop({  type: Types.ObjectId, ref: 'User', required: true, })
  userId: string;

  @Prop({ required: true, unique: true, index: true, })
  token: string;

  @Prop({ required: true, index: true, })
  expiresAt: Date;

  @Prop({ default: false, })
  isRevoked?: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}

export type RefreshTokenDocument = HydratedDocument<RefreshToken>;
export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);


const transform = (_: any, ret: any) => {
    ret.id = ret._id.toString();
    delete ret._id;
};
  
RefreshTokenSchema.set('toJSON', {
    virtuals: true,
    transform,
});
  
RefreshTokenSchema.set('toObject', {
    virtuals: true,
    transform,
});
  