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

blogRouter.get("/:id", async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id)
    response.json(blog.toJSON())
  } catch (exception) {
    next(exception)
  }
})

blogRouter.put("/:id", async (request, response, next) => {
  try {
    const blog = {
      author: request.body.author,
      title: request.body.title,
      url: request.body.url,
      likes: request.body.likes,
    }

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
      new: true,
      runValidators: true,
    })

    response.json(updatedBlog.toJSON())
  } catch (exception) {
    next(exception)
  }
})

blogRouter.delete("/:id", async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

module.exports = blogRouter
