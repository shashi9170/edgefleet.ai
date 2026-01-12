import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { IProject } from '../interfaces/project.interface';

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Project implements IProject {

  id?: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  userId: string;

  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ trim: true })
  description?: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export type ProjectDocument = HydratedDocument<Project>;
export const ProjectSchema = SchemaFactory.createForClass(Project);


const transform = (_: any, ret: any) => {
    ret.id = ret._id.toString();
    delete ret._id;
};
  
ProjectSchema.set('toJSON', {
    virtuals: true,
    transform,
});
  
ProjectSchema.set('toObject', {
    virtuals: true,
    transform,
});