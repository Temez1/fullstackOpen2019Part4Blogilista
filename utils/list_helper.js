const _ = require("lodash")

const dummy = () => 1

const totalLikes = (blogs) => blogs
  .map((blog) => blog.likes)
  .reduce((sum, blogLikes) => sum + blogLikes, 0)

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return 0
  }

  let mostLikes = 0
  let blogWithMostLikes = blogs[0]

  blogs.forEach((blog) => {
    if (blog.likes > mostLikes) {
      blogWithMostLikes = blog
      mostLikes = blog.likes
    }
  })
  return blogWithMostLikes
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return 0
  }

  const mostActiveBlogger = {
    author: blogs[0].author,
    blogs: 1,
  }

  const authorsGrouped = _.groupBy(blogs, (blog) => blog.author)

  _.forEach(authorsGrouped, (value, key) => {
    if (value.length > mostActiveBlogger.blogs) {
      mostActiveBlogger.author = key
      mostActiveBlogger.blogs = value.length
    }
  })

  return mostActiveBlogger
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return 0
  }

  const bloggerWithMostLikes = {
    author: blogs[0].author,
    likes: 0,
  }

  const authorsGrouped = _.groupBy(blogs, (blog) => blog.author)

  _.forEach(authorsGrouped, (authorBlogs, author) => {
    const authorLikes = totalLikes(authorBlogs)
    if (authorLikes > bloggerWithMostLikes.likes) {
      bloggerWithMostLikes.author = author
      bloggerWithMostLikes.likes = authorLikes
    }
  })

  return bloggerWithMostLikes
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
