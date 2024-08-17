import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor(private readonly userService: UserService, private readonly jwtService: JwtService) {  }

    // user validation method
    async validateUser(username: string, password: string): Promise<any> {
        // find the user's password by his username
        const user = await this.userService.findUser(username);
        // compare the both hash's password, what the user entered and which is saved in the database
        const isPasswordMatch = await bcrypt.compare(
            password,
            user.password
        );
        if (user && isPasswordMatch) {
            // if both is the same hash compared, return the user
            return user;
        }
        return null;
    }

    async login(user: any) {
        const payload = { username: user.username, sub: user._id, roles: user.roles };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
