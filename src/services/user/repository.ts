import User, { IUser } from "./model";

export class UserRepository {
  constructor() {}

  async createUser(payload: IUser): Promise<IUser> {
    const user = await User.create(payload);
    return user;
  }

  async findUser(payload: Partial<IUser>) {
    const user = await User.findOne({ ...payload  as any}).exec();
    return user;
  }

  async findUserByEmail(email: string): Promise<IUser | null> {
    const user = await User.findOne({ email });
    return user;
  }

  async findUserById(id: string): Promise<IUser | null> {
    const user = await User.findById(id);
    return user;
  }

  async updateUser(id: string, payload: Partial<IUser>): Promise<IUser | null> {
    const user = await User.findByIdAndUpdate(id, payload, {
      new: true,
    }).exec();
    return user;
  }
}

const userRepository = new UserRepository();
export default userRepository;
