const UserModel = require("../../models/user")

test("User model returns model with correct schema", () => {
  expect(UserModel.schema.obj).toEqual({
    username: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
  })
})

test("User model has method toJSON which returns document with id instead of _id", () => {
  const userInfo = {
    username: "testi",
    name: "nalle puh",
    password: "hunajata",
  }

  const userToJSON = new UserModel(userInfo).toJSON()

  expect(userToJSON.id).toBeDefined()
  // eslint-disable-next-line no-underscore-dangle
  expect(userToJSON._id).not.toBeDefined()
})
