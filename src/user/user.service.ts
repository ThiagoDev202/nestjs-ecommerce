import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDTO } from './dtos/create-user.dto';
import * as bcrypt from 'bcrypt';


@Injectable()
export class UserService {

    constructor(@InjectModel('User') private readonly userModel: Model<UserDocument>) {  }

    // create new user
    async addUser(createUserDTO: CreateUserDTO): Promise<User> {
        const newUser = await this.userModel.create(createUserDTO);
        // hash his password
        newUser.password = await bcrypt.hash(newUser.password, 10);
        // save the user's password to the database
        return newUser.save();
    }

    // method to find a particular user by his username
    async findUser(username: string): Promise<User | undefined> {
        const user = await this.userModel.findOne({username: username});
        return user;
    }
}
