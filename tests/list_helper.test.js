const listHelper = require("../utils/list_helper")

const helper = require("./test_helper")

const blogs = helper.initialBlogs

test("dummy returns one", () => {
  const result = listHelper.dummy()
  expect(result).toBe(1)
})

describe("total likes", () => {
  test("of empty list is zero", () => {
    const result = listHelper.totalLikes([])
    expect(result).toBe(0)
  })

  test("when list has only one blog equals the likes of that", () => {
    const result = listHelper.totalLikes([blogs[1]])
    expect(result).toBe(5)
  })

  test("of a bigger list is calculated right", () => {
    const result = listHelper.totalLikes(blogs)
    expect(result).toBe(36)
  })
})

describe("favorite blog", () => {
  test("of empty list is zero", () => {
    const result = listHelper.favoriteBlog([])
    expect(result).toBe(0)
  })

  test("when list has only one blog equals the given blog", () => {
    const result = listHelper.favoriteBlog([blogs[0]])
    expect(result).toEqual(blogs[0])
  })

  test("when list has many blogs equals the blog with most likes", () => {
    const result = listHelper.favoriteBlog(blogs)
    expect(result).toEqual(blogs[2])
  })
})

describe("most blogs", () => {
  test("of empty list is zero", () => {
    const result = listHelper.mostBlogs([])
    expect(result).toBe(0)
  })

  test("of list with one blog returns the author and the amount of blogs equals one", () => {
    const result = listHelper.mostBlogs([blogs[0]])
    expect(result).toEqual({ author: "Michael Chan", blogs: 1 })
  })

  test("of list with many blogs returns the author with most blogs", () => {
    const result = listHelper.mostBlogs(blogs)
    expect(result).toEqual({ author: "Robert C. Martin", blogs: 3 })
  })
})

describe("most likes", () => {
  test("of empty list is zero", () => {
    const result = listHelper.mostLikes([])
    expect(result).toBe(0)
  })

  test("of list with one blog returns the author and the amount of likes", () => {
    const result = listHelper.mostLikes([blogs[0]])
    expect(result).toEqual({ author: "Michael Chan", likes: 7 })
  })

  test("of list with many blogs returns the author with most likes", () => {
    const result = listHelper.mostLikes(blogs)
    expect(result).toEqual({ author: "Edsger W. Dijkstra", likes: 17 })
  })
})
