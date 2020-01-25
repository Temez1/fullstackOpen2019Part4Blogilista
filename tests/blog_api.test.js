/* eslint-disable no-underscore-dangle */
const mongoose = require("mongoose")
const supertest = require("supertest")
const _ = require("lodash")
const app = require("../app")

const api = supertest(app)

const helper = require("./test_helper")
const Blog = require("../models/blog")

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.rawBlogTestData)
})

test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/)
})

test("right amount of blogs are returned", async () => {
  const response = await api.get("/api/blogs")

  expect(response.body.length).toBe(helper.initialBlogs.length)
})

test("a specific blog title is within the returned blog titles", async () => {
  const response = await api.get("/api/blogs")

  const titles = response.body.map((res) => res.title)

  expect(titles).toContain("React patterns")
})

test("a specific blog is within the returned blogs", async () => {
  const response = await api.get("/api/blogs")
  const blogs = response.body
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
  const blogsWithoutId = _.map(blogsAtTheEnd, (blog) => _.pick(blog, ["author", "likes", "title", "url"]))

  expect(blogsAtTheEnd.length).toBe(helper.initialBlogs.length + 1)
  expect(blogsWithoutId).toContainEqual(newBlog)
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

  expect(blogsAtTheEnd.length).toBe(helper.initialBlogs.length)
  expect(blogsAtTheEnd).not.toContainEqual(newBlog)
})

test("a blog without likes returns the blog with likes as zero", async () => {
  const newBlog = {
    _id: "5e2c0f27de541f1e6442e71d",
    author: "mikki",
    title: "hiiri",
    url: "liibalaaba",
  }

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/)

  const blogsAtTheEnd = await helper.blogsInDb()
  const blogWithLikes = { ...newBlog, likes: 0, id: newBlog._id }
  delete blogWithLikes._id

  expect(blogsAtTheEnd.length).toBe(helper.initialBlogs.length + 1)
  expect(blogsAtTheEnd).toContainEqual(blogWithLikes)
})
/*
test("a specific blog can be viewed", async () => {
  const blogsAtStart = await helper.blogsInDb()

  const blogToView = blogsAtStart[0]

  const resultBlog = await api
    .get(`/api/blogs/${}`)
}) */

afterAll(() => {
  mongoose.connection.close()
})
