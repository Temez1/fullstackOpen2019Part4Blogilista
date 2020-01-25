const _ = require("lodash")
const Blog = require("../models/blog")
const rawBlogTestData = require("./blog_test_data")

const setupBlogs = () => (
  _.map(rawBlogTestData, (blog) => {
    // eslint-disable-next-line no-underscore-dangle
    const id = blog._id
    const modifiedBlog = _.pick(blog, ["title", "author", "url", "likes"])
    modifiedBlog.id = id
    return modifiedBlog
  })
)
const initialBlogs = setupBlogs()

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map((blog) => blog.toJSON())
}

module.exports = {
  initialBlogs, blogsInDb, rawBlogTestData,
}
