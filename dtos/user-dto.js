module.exports = class UserDto {
  // email;
  // id;
  // isActivated;

  constructor(model) {
    this.email = model.email;
    this.id = model._id;
    this.isActivated = model.isActivated;
  }
};

// data transfer object- поля, які відправляємо на клієнт 