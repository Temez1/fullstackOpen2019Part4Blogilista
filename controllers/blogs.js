const blogRouter = require("express").Router()
const Blog = require("../models/blog")

blogRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs.map((blog) => blog.toJSON()))
})

blogRouter.post("/", async (request, response) => {
  const blog = new Blog(request.body)

  const result = await blog.save()
  response.status(201).json(result.toJSON())
})

module.exports = blogRouter
