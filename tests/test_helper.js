const Blog = require("../models/blog")
const initialBlogs = require("./blog_test_data")

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map((blog) => blog.toJSON())
}

module.exports = {
  initialBlogs, blogsInDb,
}
