import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User, UserDocument } from 'src/database/schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';


@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<UserDocument>,
    ) {}

    // -------- CREATE USER --------
    async create(data: CreateUserDto): Promise<User> {
        const user = new this.userModel(data);
        return user.save();
    }

    // -------- FIND BY EMAIL (NO PASSWORD) --------
    async findByEmail(email: string): Promise<User | null> {
        const user = this.userModel.findOne({ email }).exec();

        if (!user) throw new NotFoundException('User not found');
        
        return user;
    }

    // -------- FIND BY EMAIL (WITH PASSWORD) --------
    async findByEmailWithPassword(email: string): Promise<UserDocument | null> {
        return this.userModel.findOne({ email }).select('+password').exec();
    }

    // -------- FIND BY ID --------
    async findById(id: string): Promise<User> {
        const user = await this.userModel.findById(id).exec();

        if (!user) throw new NotFoundException('User not found');
        
        return user;
    }

    // -------- GET ALL USERS (OPTIONAL) --------
    async findAll(): Promise<User[]> {
        return this.userModel.find().exec();
    }
}
