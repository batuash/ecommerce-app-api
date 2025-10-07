import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../models/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CurrentUser } from 'src/types';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<Omit<User, 'password'> | null> {
    const user = await this.userRepository.findOne({ where: { email } });
    
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async register(email: string, password: string, firstName?: string, lastName?: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });
    
    return await this.userRepository.save(user);
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async login(user: CurrentUser) {
    const payload = { 
      email: user.email, 
      sub: user.id,
      firstName: user.firstName,
      lastName: user.lastName
    };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      }
    };
  }
}
