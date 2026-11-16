import { WithId } from 'mongodb';
import { TUserOutputDto } from '../../dto/user.output.dto';
import { TUser } from '../../types/user';

export const mapToUserOutput = (user: WithId<TUser>): TUserOutputDto => ({
  id: user._id.toString(),
  login: user.login,
  email: user.email,
  createdAt: user.createdAt,
});
