/* eslint-disable no-underscore-dangle */
const mongoose = require("mongoose")
const supertest = require("supertest")
const app = require("../../app")

const api = supertest(app)

const helper = require("../test_helper")
const User = require("../../models/user")

describe("with users in test database", () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const userObjects = helper.initialUsers.map((user) => new User(user))
    const promiseArray = userObjects.map((user) => user.save())

    // Please notice users in Db might not to be in same order than initialUsers
    await Promise.all(promiseArray)
  })

  test("users are returned as json", async () => {
    await api
      .get("/api/users")
      .expect(200)
      .expect("Content-Type", /application\/json/)
  })

  describe("Getting many users", () => {
    test("right amount of users are returned", async () => {
      const response = await api.get("/api/users")
      expect(response.body.length).toBe(helper.initialUsers.length)
    })
    test("a specific username is within the returned blogs", async () => {
      const response = await api.get("/api/users")
      const users = response.body

      const usernames = users.map((user) => user.username)
      expect(usernames).toContain(helper.initialUsers[0].username)
    })
  })

  describe("Creating a user", () => {
    test("creating succeeds with new username", async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: "uusi",
        name: "käyttäjä",
        password: "salaisuus",
      }

      await api
        .post("/api/users")
        .send(newUser)
        .expect(201)
        .expect("Content-Type", /application\/json/)

      const usersAtTheEnd = await helper.usersInDb()
      expect(usersAtTheEnd.length).toBe(usersAtStart.length + 1)

      const usernames = usersAtTheEnd.map((user) => user.username)
      expect(usernames).toContainEqual(newUser.username)
    })

    test("creating fails with used username", async () => {
      const usersAtStart = await helper.usersInDb()

      const oldUser = {
        username: "Puh",
        name: "On jo olemassa",
        password: "salaisuus",
      }

      await api
        .post("/api/users")
        .send(oldUser)
        .expect(400)
        .expect("Content-Type", /application\/json/)

      const usersAtTheEnd = await helper.usersInDb()

      expect(usersAtTheEnd.length).toBe(usersAtStart.length)
      expect(usersAtTheEnd).toEqual(usersAtStart)
    })

    test("creating fails without username", async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: "",
        name: "Ei ole olemassa",
        password: "salaisuus",
      }

      await api
        .post("/api/users")
        .send(newUser)
        .expect(400)
        .expect("Content-Type", /application\/json/)

      const usersAtTheEnd = await helper.usersInDb()

      expect(usersAtTheEnd.length).toBe(usersAtStart.length)
      expect(usersAtTheEnd).toEqual(usersAtStart)
    })
  })
})

afterAll(() => {
  mongoose.connection.close()
})
