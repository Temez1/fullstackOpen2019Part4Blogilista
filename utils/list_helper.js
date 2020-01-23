const dummy = () => 1

const totalLikes = (blogs) => blogs
  .map((blog) => blog.likes)
  .reduce((sum, blogLikes) => sum + blogLikes, 0)

const favoriteBlog = (blogs) => {
  let mostLikes = 0
  let blogWithMostLikes = blogs.length === 0 ? [] : blogs[0]
  blogs.forEach((blog) => {
    if (blog.likes > mostLikes) {
      blogWithMostLikes = blog
      mostLikes = blog.likes
    }
  })
  return blogWithMostLikes
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
}
