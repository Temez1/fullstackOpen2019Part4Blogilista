/* eslint-disable no-underscore-dangle */
const blogRouter = require("express").Router()
const jwt = require("jsonwebtoken")
const Blog = require("../models/blog")
const User = require("../models/user")

const getTokenFrom = (request) => {
  const authorization = request.get("authorization")
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    return authorization.substring(7)
  }
  return null
}

blogRouter.get("/", async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate("user", { username: 1, name: 1 })

  response.json(blogs.map((blog) => blog.toJSON()))
})

blogRouter.post("/", async (request, response, next) => {
  const { body } = request

  const token = getTokenFrom(request)

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET)

    if (!(token && decodedToken.id)) {
      response.status(401).json({ error: "token missing or invalid " })
    }

    const user = await User.findById(decodedToken.id)

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes === undefined ? 0 : body.likes,
      user: user._id,
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog.toJSON())
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
