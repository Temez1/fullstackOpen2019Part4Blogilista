const blogRouter = require("express").Router()
const Blog = require("../models/blog")

blogRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs.map((blog) => blog.toJSON()))
})

blogRouter.post("/", async (request, response, next) => {
  const blog = new Blog(request.body)

  if (blog.likes === undefined) {
    blog.likes = 0
  }

  try {
    const result = await blog.save()
    response.status(201).json(result.toJSON())
  } catch (exception) {
    next(exception)
  }
})

module.exports = blogRouter
