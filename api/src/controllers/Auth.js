import UsersController from './Users';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import passport from 'passport';

class AuthController {
  static is_logged_in() {
    return passport.authenticate('jwt', { session: false });
  }

  static async validateToken(jwt) {
    return UsersController.getByEmail(jwt.email_address);
  }

  static async login({ email_address = '', password = '' }) {
    if (!email_address || !password) throw new Error('Please supply a username & password');

    const user = await UsersController.getByEmail(email_address);
    if (!user) throw new Error('There\'s no user associated with that email address');

    if (user.password === null) return await this.update_password(user.id, password);

    const passwordsMatch = await bcrypt.compare(
      password,
      user.password,
    );

    if (!passwordsMatch) throw new Error('That password is incorrect');
    
    return this.generate_jwt(user);

  }

  static async update_password(id, password) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    await UsersController.update({ id, password: hash });
    return { success: true };
  }

  static generate_jwt(user) {
    const token = jwt.sign(
      {
        id: user.id,
        email_address: user.email_address
      },
      process.env.JWT_SIG,
      {
        algorithm: 'HS256',
        expiresIn: '1y',
      }
    );

    return { token };
  }
}

export default AuthController;
