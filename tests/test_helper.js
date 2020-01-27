/* eslint-disable no-underscore-dangle */
const Blog = require("../models/blog")
const User = require("../models/user")
const rawBlogTestData = require("./test_data/blog_test_data")
const rawUserTestData = require("./test_data/user_test_data")

const setupData = (testData) => (
  testData.map((object) => {
    const modifiedObject = { ...object }
    modifiedObject.id = object._id.toString()
    delete modifiedObject._id
    delete modifiedObject.__v
    return modifiedObject
  })
)

const initialBlogs = setupData(rawBlogTestData)
const initialUsers = setupData(rawUserTestData)

const documentsInDb = async (model) => {
  const documents = await model.find({})
  return documents.map((document) => document.toJSON())
}

const blogsInDb = () => documentsInDb(Blog)
const usersInDb = () => documentsInDb(User)

module.exports = {
  rawBlogTestData,
  rawUserTestData,
  initialBlogs,
  initialUsers,
  blogsInDb,
  usersInDb,
}
