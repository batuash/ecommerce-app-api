import { User } from "./models/user.entity";

export type CurrentUser = Omit<User, 'password'> & { sub: number };