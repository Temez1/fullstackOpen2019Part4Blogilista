/* eslint-disable no-underscore-dangle */
const mongoose = require("mongoose")
const User = require("../../models/user")
const Blog = require("../../models/blog")

test("User model returns model with correct schema", () => {
  expect(User.schema.obj).toEqual({
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
    blogs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog",
      },
    ],
  })
})

test("User model has method toJSON which returns document with id instead of _id", () => {
  const blog1 = new Blog({ title: "jes", author: "joo", url: "eiole" })
  const blog2 = new Blog({ title: "test", author: "test", url: "te" })

  const userInfo = {
    username: "testi",
    name: "nalle puh",
    password: "hunajata",
    blogs: [
      blog1._id,
      blog2._id,
    ],
  }

  const userToJSON = new User(userInfo).toJSON()

  console.log(userToJSON)

  expect(userToJSON.id).toBeDefined()
  expect(userToJSON._id).not.toBeDefined()
})

test("User model method toJSON returns blogs as empty if user has no blogs", () => {
  const userInfo = {
    username: "testi",
    name: "nalle puh",
    password: "hunajata",
    blogs: [],
  }

  const userToJSON = new User(userInfo).toJSON()

  expect(userToJSON.blogs).toEqual([])
})
