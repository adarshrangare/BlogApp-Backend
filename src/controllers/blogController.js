const Blog = require("../models/BlogModel");
const User = require("../models/userModel");

const createBlog = async (req, res) => {
  const { title, description, tags, imageURL } = req.body;
  const { user } = req;
  console.log({ title, description, tags, imageURL, user });

  if (!title) {
    return res.status(400).json({ error: "Title is required." });
  } else if (!description) {
    return res.status(400).json({ error: "Description is required." });
  }

  try {
    const newBlog = new Blog({
      title,
      description,
      tags,
      imageURL,
      user,
    });

    const savedBlog = await newBlog.save();

    await User.findByIdAndUpdate(user._id, { $push: { blogs: savedBlog._id } });
    // updating user collection
    if (!savedBlog) {
      return res.status(400).json({ error: "Unable to create blog" });
    }

    return res.status(201).json({
      status: "success",
      message: "Blog is posted successfully",
      data: { post: savedBlog },
    });
  } catch (error) {
    return res.status(400).json({ status: "failed", message: error.message });
  }
};

const getBlog = async (req, res) => {
  const { id } = req.params;
  const { page, limit } = req.query;
  try {
    // for specific blog
    if (id) {
      if (id.length != 24) {
        return res.status(404).json({
          status: "failed",
          message: "Provided Blog ID is Invalid",
        });
      }
      const blog = await Blog.findById(id).populate([
        {
          path: "user",
          select: "fullname username profile",
        },
        {
          path: "votedBy",
          select: "fullname username profile",
        },
        {
          path: "comments",
        },
      ]);
      if (!blog) {
        return res.status(404).json({
          status: "failed",
          message: "The blog with the given ID was not found.",
        });
      }
      return res.status(200).json({
        status: "success",
        message: "Blog Data is Retrieved Successfully",
        data: blog,
      });
    }

    // for All blogs

    // const myCustomLabels = {
    //   totalDocs: "itemCount",
    //   docs: "itemsList",
    //   limit: "perPage",
    //   page: "currentPage",
    //   nextPage: "next",
    //   prevPage: "prev",
    //   totalPages: "pageCount",
    //   pagingCounter: "slNo",
    //   meta: "paginator",
    // };

    // const options = {
    //   page: 1,
    //   limit: 1,
    //   // customLabels: myCustomLabels,
    // };

    // console.log({ page, limit });
    const options = {
      page: parseInt(page, 10) || 1, // Default to page 1
      limit: parseInt(limit, 10) || 10, // Default to 10 items per page
    }; // pagination
    // console.log(options);

    // const blogs = await Blog.find().paginate({}, options, () => {});

    const blogs = await Blog.paginate(
      {},
      {
        select: "-votedBy -comments", // Exclude these fields
        populate: {
          path: "user",
          select: "fullname username profile", // Fields to include from the user
        },
        ...options, // Pagination options
      }
    );

    return res.status(200).json({
      status: "success",
      message: "Blogs are fetched successfully",
      total: blogs.totalDocs,
      limit: blogs.limit,
      page: blogs.page,
      totalPages: blogs.totalPages,
      data: blogs.docs,
    });
  } catch (error) {
    return res.status(400).json({ status: "failed", message: error.message });
  }
};

const deleteBlog = async (req, res) => {
  const { id } = req.params;
  const { user } = req; // comming from authMiddleware

  try {
    if (id && id.length != 24) {
      return res.status(404).json({
        status: "failed",
        message: "Provided Blog ID is Invalid",
      });
    }

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        status: "failed",
        message: "No such Blog found in Database.",
      });
    }

    // checking owner
    // console.log("user",blog.user)
    // console.log("user2",user._id)
    const isOwner = blog.user.toString() === user._id;

    // console.log({isOwner})
    if (!isOwner) {
      return res.status(401).json({
        status: "failed",
        message: "You are not authorised to perform this task",
      });
    }

    // deleting blog

    const deletedBlog = await Blog.findByIdAndDelete(id);

    // console.log(deleteBlog)

    if (!deletedBlog) {
      return res
        .status(400)
        .json({ status: "failed", message: "Unable to Delete" });
    }

    await User.findByIdAndUpdate(user._id, { $pull: { blogs: blog._id } });
    return res
      .status(200)
      .json({ status: "success", message: "Blog deleted successfully" });
  } catch (error) {
    return res.status(400).json({ status: "failed", message: error.message });
  }
};

const editBlog = async (req, res) => {
  const { id } = req.params;
  const { user } = req; // comming from authMiddleware

  try {
    if (id && id.length != 24) {
      return res.status(404).json({
        status: "failed",
        message: "Provided Blog ID is Invalid",
      });
    }

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        status: "failed",
        message: "No such Blog found in Database.",
      });
    }

    // checking owner
    // console.log("user",blog.user)
    // console.log("user2",user._id)
    const isOwner = blog.user.toString() === user._id;

    //   console.log({isOwner})
    if (!isOwner) {
      return res.status(401).json({
        status: "failed",
        message: "You are not authorised to perform this task",
      });
    }

    // deleting blog

    const updatedBlog = await Blog.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    //   console.log(deleteBlog)

    if (!updatedBlog) {
      return res
        .status(400)
        .json({ status: "failed", message: "Unable to Delete" });
    }

    return res.status(200).json({
      status: "success",
      message: "Blog updated successfully",
      data: updatedBlog,
    });
  } catch (error) {
    return res.status(400).json({ status: "failed", message: error.message });
  }
};

const addUpvote = async (req, res) => {
  const { id } = req.params;
  const { user } = req; // comming from authMiddleware
  try {
    if (id && id.length != 24) {
      return res.status(404).json({
        status: "failed",
        message: "Provided Blog ID is Invalid",
      });
    }

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        status: "failed",
        message: "No such Blog found in Database.",
      });
    }

    // checking owner
    // console.log("user",blog.user)
    // console.log("user2",user._id)

    // const isOwner = blog.user.toString() === user._id;

    // if (!isOwner) {
    //   return res.status(401).json({
    //     status: "failed",
    //     message: "You are not authorised to perform this task",
    //   });
    // }

    if (blog.votedBy.includes(user._id)) {
      return res
        .status(400)
        .json({ status: "failed", message: "Already voted." });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { upvote: blog.upvote + 1, $push: { votedBy: user._id } },
      { new: true }
    );

    if (!updatedBlog) {
      return res
        .status(400)
        .json({ status: "failed", message: "Unable to Vote" });
    }

    return res
      .status(201)
      .json({ status: "success", message: "Upvote is added successfully" });
  } catch (error) {
    return res.status(400).json({ status: "failed", message: error.message });
  }
};

const removeUpvote = async (req, res) => {
  const { id } = req.params;
  const { user } = req; // comming from authMiddleware
  try {
    if (id && id.length != 24) {
      return res.status(404).json({
        status: "failed",
        message: "Provided Blog ID is Invalid",
      });
    }

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        status: "failed",
        message: "No such Blog found in Database.",
      });
    }

    // checking owner
    // console.log("user",blog.user)
    // console.log("user2",user._id)
    //   const isOwner = blog.user.toString() === user._id;

    //   if (!isOwner) {
    //     return res.status(401).json({
    //       status: "failed",
    //       message: "You are not authorised to perform this task",
    //     });
    //   }

    if (!blog.votedBy.includes(user._id)) {
      return res
        .status(400)
        .json({ status: "failed", message: "You did not voted this blog." });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { upvote: blog.upvote - 1, $pull: { votedBy: user._id } },
      { new: true }
    );

    if (!updatedBlog) {
      return res
        .status(400)
        .json({ status: "failed", message: "Unable to remove Vote" });
    }

    return res
      .status(201)
      .json({ status: "success", message: "Upvote is removed successfully" });
  } catch (error) {
    return res.status(400).json({ status: "failed", message: error.message });
  }
};

module.exports = {
  createBlog,
  getBlog,
  deleteBlog,
  editBlog,
  addUpvote,
  removeUpvote,
};
