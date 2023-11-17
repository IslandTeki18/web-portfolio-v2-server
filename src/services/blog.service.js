import { Blog } from "../models/blog.model.js";

//@desc     Create a blog post
//@route    POST /api/blogs/
//@access   Private/Admin
const createBlogPost = async (req, res) => {
  try {
    const { title, content, author, categories } = req.body;
    const blogPost = new Blog({ title, content, author, categories });
    await blogPost.save();
    return res.status(200).send(blogPost);
  } catch (error) {
    console.error("Error creating blog post: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//@desc     Get all blog posts
//@route    GET /api/blogs/
//@access   Public
const getAllBlogPosts = async (req, res) => {
  try {
    const blogPosts = await Blog.find({});
    if (!blogPosts) {
      return res.status(404).json({ message: "Blog Posts Not Found." });
    }
    return res.send(blogPosts);
  } catch (error) {
    console.error("Error getting all blog posts: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//@desc     Get blog post by id
//@route    POST /api/blogs/:id
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
    const blogPost = await Blog.findByIdAndUpdate(
      req.params.id,
      req.body.data,
      {
        new: true,
      }
    );
    await blogPost.save();
    return res.status(200).json({ message: "Blog Post Updated!" });
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
    await Blog.findByIdAndDelete(blogId);

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

    const blogPost = await Blog.findById(blogPostId);

    if (!blogPost) {
      return res.status(404).json({ message: "Blog Post Not Found." });
    }

    blogPost.comments.push(commentData);

    await blogPost.save();

    return blogPost;
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
