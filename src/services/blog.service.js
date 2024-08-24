import { Blog } from "../models/blog.model.js";

//@desc     Create a blog post
//@route    POST /api/blogs/
//@access   Private/Admin
const createBlogPost = async (req, res) => {
  try {
    const { title, content, author, categories } = req.body;
    if (!title || !content || !author || !categories) {
      return res.status(400).json({ message: "All fields are required." });
    }
    const blogPost = new Blog({ title, content, author, categories });
    await blogPost.save();
    return res.status(201).send(blogPost);
  } catch (error) {
    console.error("Error creating blog post: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//@desc     Get all blog posts with pagination
//@route    GET /api/blogs/
//@access   Public
const getAllBlogPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";

    const query = {
      $or: [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ],
    };

    const blogPosts = await Blog.find(query).skip(skip).limit(limit);

    const total = await Blog.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    return res.json({
      blogPosts,
      page,
      totalPages,
      total,
    });
  } catch (error) {
    console.error("Error getting all blog posts: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//@desc     Get blog post by id
//@route    GET /api/blogs/:id
//@access   Public
const getBlogPostById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog Not Found." });
    }
    return res.send(blog);
  } catch (error) {
    console.error("Error getting specific blog post: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//@desc     Update a blog post
//@route    PUT /api/blogs/:id
//@access   Private/Admin
const updateBlogPost = async (req, res) => {
  try {
    const { title, content, categories } = req.body;
    if (!title || !content || !categories) {
      return res.status(400).json({ message: "All fields are required." });
    }
    const blogPost = await Blog.findByIdAndUpdate(
      req.params.id,
      { title, content, categories },
      { new: true }
    );
    if (!blogPost) {
      return res.status(404).json({ message: "Blog Post Not Found." });
    }
    return res.status(200).json({ message: "Blog Post Updated!", blogPost });
  } catch (error) {
    console.error("Error updating a blog post: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//@desc     Delete a blog post
//@route    DELETE /api/blogs/:id
//@access   Private/Admin
const deleteBlogPost = async (req, res) => {
  try {
    const blogId = req.params.id;
    const blogPost = await Blog.findByIdAndDelete(blogId);
    if (!blogPost) {
      return res.status(404).json({ message: "Blog Post Not Found." });
    }
    return res.json({ message: "Blog Post Deleted!" });
  } catch (error) {
    console.error("Error deleting a blog post: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//@desc     Add a comment to a blog post
//@route    POST /api/blogs/:id/comment
//@access   Public
const addCommentToBlogPost = async (req, res) => {
  try {
    const blogPostId = req.params.id;
    const { content, author } = req.body;
    if (!content || !author) {
      return res
        .status(400)
        .json({ message: "Content and author are required." });
    }
    const blogPost = await Blog.findById(blogPostId);
    if (!blogPost) {
      return res.status(404).json({ message: "Blog Post Not Found." });
    }
    blogPost.comments.push({ content, author, date: new Date() });
    await blogPost.save();
    return res.status(201).json({ message: "Comment Added!", blogPost });
  } catch (error) {
    console.error("Error creating a blog post comment: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export {
  createBlogPost,
  getAllBlogPosts,
  getBlogPostById,
  updateBlogPost,
  deleteBlogPost,
  addCommentToBlogPost,
};
