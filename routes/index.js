const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });
const nodemailer = require("nodemailer");

const {
  landingPage,
  getRegister,
  postRegister,
  getLogin,
  postLogin,
  getLogout,
  getProfile,
  updateProfile,
  postContact,
  getThanks,
} = require('../controllers')
const {
  asyncErrorHandler,
  isLoggedIn,
  isValidPassword,
  changePassword
} = require('../middleware')


/* GET home page. */
router.get('/', asyncErrorHandler(landingPage));


router.get('/contact', function(req, res, next) {
  res.render('contact', { title: 'Contact Page'});
});

router.get('/about', function(req, res, next) {
  res.render('about', { title: 'About Page'});
});

router.get('/purchase', function(req, res, next) {
  res.render('purchase');
});

// /* GET /register */
// router.get('/register', getRegister);
//
// /* POST /register */
// router.post('/register', upload.any(), asyncErrorHandler(postRegister));

/* GET /login */
router.get('/login', getLogin);

/* POST /login */
router.post('/login', asyncErrorHandler(postLogin));

/* GET /logout */
router.get('/logout', getLogout);

/* GET /profile */
router.get('/profile', isLoggedIn, asyncErrorHandler(getProfile));

/* PUT /profile/ */
router.put('/profile',
    isLoggedIn,
    asyncErrorHandler(isValidPassword),
    asyncErrorHandler(changePassword),
    asyncErrorHandler(updateProfile)
);

router.post("/contact", function(req, res){
  async function main(){

    // need to authenticate EMAIL and get clientID, Secret, and Refresh token when adding a new email
    //  using OAuth specifications found on Google's developer platform
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      auth: {
        type: "OAuth2",
        user: process.env.EMAIL,
        clientId:"\n" + process.env.CLIENTID + "\n" ,
        clientSecret: "\n" + process.env.CLIENTSECRET + "\n" ,
        refreshToken: process.env.REFRESHTOKEN
      }
    });

    // setup email data
    let mailOptions = {
      from: "Emily's Reiki/Tarot Site",
      to: process.env.EMAIL,
      subject: "Contact Message from Website", // Subject line
      text: req.body.message + "\n\nTo reply to this inquiry, please send response to the user's email:\n" +
        req.body.email // plain text body

    };

    // send mail with defined transport object
    let info = await transporter.sendMail(mailOptions);

    console.log("Message sent: %s", info.messageId);
    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    console.log(req.body);
  }

  main().catch(console.error);
  res.redirect("offerings/thanks");
});

module.exports = router;
