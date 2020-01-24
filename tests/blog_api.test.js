const mongoose = require("mongoose")
const supertest = require("supertest")
const _ = require("lodash")
const app = require("../app")

const api = supertest(app)

const helper = require("./test_helper")
const Blog = require("../models/blog")

beforeEach(async () => {
  await Blog.deleteMany({})

  let blogObject = new Blog(helper.initialBlogs[0])
  await blogObject.save()

  blogObject = new Blog(helper.initialBlogs[1])
  await blogObject.save()
})

test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/)
})

test("right amount of blogs are returned", async () => {
  const response = await api.get("/api/blogs")

  expect(response.body.length).toBe(2)
})

test("a specific blog title is within the returned blog titles", async () => {
  const response = await api.get("/api/blogs")

  const titles = response.body.map((res) => res.title)

  expect(titles).toContain("React patterns")
})

test("a specific blog is within the returned blogs", async () => {
  const response = await api.get("/api/blogs")

  const blogs = _.map(response.body, (blog) => _.pick(blog, ["title", "author", "url", "likes"]))
  expect(blogs[0]).toEqual(helper.initialBlogs[0])
})

test("a valid blog can be added", async () => {
  const newBlog = {
    title: "A new day",
    author: "Mysteeri mikitin",
    url: "https://eilöydy.com/",
    likes: 100,
  }

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/)

  const blogsAtTheEnd = await helper.blogsInDb()
  const blogs = _.map(blogsAtTheEnd, (blog) => _.pick(blog, ["title", "author", "url", "likes"]))

  expect(blogsAtTheEnd.length).toBe(3)
  expect(blogs[2]).toEqual(newBlog)
})

test("a blog without title is not added", async () => {
  const newBlog = {
    author: "Mikitin",
    url: "fake",
    likes: 0,
  }

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(400)

  const blogsAtTheEnd = await helper.blogsInDb()

  expect(blogsAtTheEnd.length).toBe(2)
})

afterAll(() => {
  mongoose.connection.close()
})
