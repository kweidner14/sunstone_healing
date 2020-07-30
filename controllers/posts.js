const Post = require('../models/post');
const util = require('util');
const { cloudinary } = require('../cloudinary');


module.exports = {
  // Posts Index
  async postIndex(req, res, next) {
    const {dbQuery} = res.locals;
    delete res.locals.dbQuery;
    let posts = await Post.paginate(dbQuery, {
      page: req.query.page || 1,
      limit: 6,
      sort: '-_id' //sorts by _id in descending order
    });
    posts.page = Number(posts.page);
    if (!posts.docs.length && res.locals.query) {
      // manually set error message
      res.locals.error = 'No results match that query.';
    }
    res.render('posts/index', {
      posts,
      title: 'Posts Index'
    });
  },
  // Posts New
  postNew(req, res, next) {
    res.render('posts/new');
  },
  // Posts Create
  async postCreate(req, res, next) {
    req.body.post.images = [];
    console.log(util.inspect(req.files));
    for(const file of req.files) {
      console.log('File: ' + util.inspect(file));
      req.body.post.images.push({
        url: file.path,
        public_id: file.filename
      });
    }

    req.body.post.author = req.user._id;
    let post = new Post(req.body.post);
    post.properties.description = `<strong><a href="/posts/${post._id}">${post.title}</a></strong><p>${post.body.substring(0, 50)}...</p>`;
    post.description = req.body.post.description;
    post.body = req.body.post.body;

    // console.log('req.body.post.description: ' + post.description)
    // console.log('post.description: ' + post.description)

    await post.save();
    req.session.success = 'Post created successfully!';
    res.redirect(`/posts/${post.id}`);
  },
  // Posts Show
  async postShow(req, res, next) {
    let post = await Post.findById(req.params.id).populate();
    res.render('posts/show', { post, title: "Post Show" });
  },
  // Posts Edit
  postEdit(req, res, next) {
    res.render('posts/edit');
  },
  // Posts Update
  async postUpdate(req, res, next) {
    // destructure post from res.locals
    const { post } = res.locals;
    console.log("req.body.deleteImages: " + req.body.deleteImages);

    // check if there's any images for deletion
    if(req.body.deleteImages && req.body.deleteImages.length) {
      // assign deleteImages from req.body to its own variable
      let deleteImages = req.body.deleteImages;
      // loop over deleteImages
      for(const public_id of deleteImages) {
        // delete images from cloudinary
        await cloudinary.uploader.destroy(public_id);
        // delete image from post.images
        for(const image of post.images) {
          if(image.public_id === public_id) {
            let index = post.images.indexOf(image);
            post.images.splice(index, 1);
          }
        }
      }
    }
    // check if there are any new images for upload
    if(req.files) {
      // upload images
      for(const file of req.files) {
        post.images.push({
          url: file.path,
          public_id: file.filename
        });
      }
    }

    // update the post with any new properties
    post.title = req.body.post.title;
    post.description = req.body.post.description;


    post.body = req.body.post.body;


    post.properties.description = `<strong><a href="/posts/${post._id}">${post.title}</a></strong><p>${post.body.substring(0, 50)}...</p>`;
    // save the updated post into the db
    await post.save();
    // redirect to show page
    res.redirect(`/posts/${post.id}`);
  },
  // Posts Destroy
  async postDestroy(req, res, next) {
    const { post } = res.locals;
    for(const image of post.images) {
      await cloudinary.uploader.destroy(image.public_id);
    }
    await post.remove();
    req.session.success = "Post deleted successfully!";
    res.redirect('/posts');
  }
}