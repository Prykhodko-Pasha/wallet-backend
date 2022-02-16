const UserModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
// eslint-disable-next-line no-unused-vars
const mailService = require("./mail-service");
const tokenService = require("./token-service");
const UserDto = require("../dtos/user-dto");
const ApiError = require("../exceptions/api-error");

class UserService {
  // Сервіс для роботи з користувачами, створення-видалення.
  async registration(email, password) {
    const candidate = await UserModel.findOne({ email });
    // перевірити, чи немає з таким мейлом користувача в БД,якщо кидаємо помилку
    if (candidate) {
      throw ApiError.BadRequest(
        `User with email address ${email} already exists`
      );
    }
    // хешуємо пароль і робимо посилання активації
    const hashPassword = await bcrypt.hash(password, 3);
    const activationLink = uuid.v4();

// зберігаємо користувача в БД
    const user = await UserModel.create({
      email,
      password: hashPassword,
      activationLink,
    });

    
    const userDto = new UserDto(user);
    // функція генерації токена, зберігаємо рефреш токен в БД
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto }; // Повертаємо інфо про користувача та токени
  }

 // функція активації, очікує на вхід посилання на активацію
  async activate(activationLink) {
    const user = await UserModel.findOne({ activationLink });
    if (!user) {
      throw ApiError.BadRequest("Incorrect activation link");
    }
    user.isActivated = true;
    await user.save();
  }

  async login(email, password) {
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw ApiError.BadRequest("User with this email was not found");
    }
    const isPassEquals = await bcrypt.compare(password, user.password);
    if (!isPassEquals) {
      throw ApiError.BadRequest("Invalid password");
    }
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });

    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return { ...tokens, user: userDto };
  }

  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }
    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await tokenService.findToken(refreshToken);
    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError();
    }
    const user = await UserModel.findById(userData.id);
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });

    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return { ...tokens, user: userDto };
  }

  async getAllUsers() {
    const users = await UserModel.find();
    return users;
  }
}

module.exports = new UserService();