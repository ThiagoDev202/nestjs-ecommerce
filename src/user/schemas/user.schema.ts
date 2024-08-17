import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from 'src/auth/guards/enums/role.enum';

export type UserDocument = User & Document;

@Schema()
export class User{
    @Prop()
    username: string;

    @Prop()
    email: string;

    @Prop()
    password: string;

    // User's role (Admin or Normal User)
    @Prop()
    roles: Role[];
}

export const UserSchema = SchemaFactory.createForClass(User);