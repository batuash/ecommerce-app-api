import { Controller, Post, Body, UseGuards, Request, Get, ValidationPipe, UsePipes, ConflictException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CurrentUser } from './current-user.decorator';
import type { CurrentUser as CurrentUserType } from 'src/types';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async register(@Body() registerDto: RegisterDto) {
    const { email, password, firstName, lastName } = registerDto;
    
    // Check if user already exists
    const existingUser = await this.authService.findUserByEmail(email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }
    
    const user = await this.authService.register(email, password, firstName, lastName);
    const { password: _, ...result } = user;
    return result;
  }

  @Post('login')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async login(@Body() loginDto: LoginDto) {
    // Validate user credentials
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    
    // Create CurrentUser type by adding sub property
    const currentUser: CurrentUserType = {
      ...user,
      sub: user.id
    };
    
    return this.authService.login(currentUser);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@CurrentUser() user: CurrentUserType) {
    return user;
  }
}
