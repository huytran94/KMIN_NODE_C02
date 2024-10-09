class BlogRepository {
  constructor(db) {
    this.db = db;
  }

  // get all blog
  async getBlogs() {
    const [result] = await this.db.query("SELECT * FROM blogs");
    return result;
  }

  // get single Blog
  async getSingleBlog() {
    const [result] = await this.db.query("SELECT * FROM blogs LIMIT 1");
    return result;
  }

  // create blog
  async createBlog(blogInfo) {
    const { postTitle, postAuthor, postDescription } = blogInfo;
    const [result] = await this.db.query(
      "INSERT INTO `blogs` (`title`, `description`, `author`) VALUES (?, ?, ?)",
      [postTitle, postAuthor, postDescription]
    );

    return result;
  }
}

export { BlogRepository };
