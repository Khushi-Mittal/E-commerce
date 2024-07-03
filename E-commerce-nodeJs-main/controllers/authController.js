const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { attachCookiesToResponse, createTokenUser,sendVerificationEmail,sendResetPasswordEmail,hashString} = require('../utils');

const crypto = require("crypto");
const Token = require('../models/Token');

const register = async (req, res) => {
  const { email, name, password } = req.body;
  console.log("err");

  const emailAlreadyExists = await User.findOne({ email });
  if (emailAlreadyExists) {
    throw new CustomError.BadRequestError('Email already exists');
  }
  const origin = req.get("Origin")

  // first registered user is an admin
  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? 'admin' : 'user';

  const verificationToken = crypto.randomBytes(40).toString("hex");

  const user = await User.create({ name, email, password, role,verificationToken});

  const protocol = req.protocol;
  const host = req.get("host");


  sendVerificationEmail({name:user.name,email:user.email,verificationToken:user.verificationToken,origin})
  res.status(StatusCodes.CREATED)
  .json({"msg":"Success please check your email to verify account",verificationToken:user.verificationToken})

//   const tokenUser = createTokenUser(user);
//   attachCookiesToResponse({ res, user: tokenUser });
//   res.status(StatusCodes.CREATED).json({ user: tokenUser });
};

const verifyEmail = async(req,res)=>{

    const {verificationToken,email} = req.body;

    const user = await User.findOne({email})
    if(!user)
    throw new CustomError.UnauthenticatedError("verification failed")

    if(user.verificationToken!==verificationToken)
    throw new CustomError.UnauthenticatedError("verification failed")

    user.isVerified = true;
    user.verified = Date.now();
    user.verificationToken = ""

    await user.save();

    res.status(StatusCodes.OK).json({verificationToken,email})
}

const autoLogin = async(req,res)=>{
    const cookie = req.headers.cookie;

    if(!cookie || cookie===null)
    return res.sendStatus(401);

    const user= await User.findOne({_id:req.user.userId})
    res.json(user)

}


const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new CustomError.BadRequestError('Please provide email and password');
  }
  const user = await User.findOne({ email }).populate("addresses").populate("cart");

  if (!user) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials');
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {

    throw new CustomError.UnauthenticatedError('Invalid Credentials');
  }

  if(!user.isVerified)
  {
    throw new CustomError.UnauthenticatedError("Please verify your email")
  }

  const tokenUser = createTokenUser(user);

    //create refreshing token
    let refreshToken = ""

    //check for existing token
  const existingToken = await Token.findOne({user:user._id})

  if(existingToken)
  {
    const {isValid} = existingToken;
    if(!isValid)
    {
        throw new CustomError.UnauthenticatedError("Invalid Credentails")
    }

    refreshToken = existingToken.refreshToken;
    attachCookiesToResponse({ res, user: tokenUser,refreshToken });
    return res.status(StatusCodes.OK).json( user );

  }
  else
  {
  refreshToken = crypto.randomBytes(40).toString("hex");
  const userAgent = req.headers['user-agent']
  const ip = req.ip;
  const userToken = {refreshToken,ip,userAgent,user:user._id};

  const tempToken = await Token.create(userToken);

  attachCookiesToResponse({ res, user: tokenUser,refreshToken });
  return res.status(StatusCodes.OK).json({ user: tempToken });

}
};


const logout = async (req, res) => {

    await Token.findOneAndDelete({user:req.user.userId})
  res.cookie('accessToken', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now() + 1000),
  });

  res.cookie('refreshToken', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now() + 1000),
  });
  res.status(StatusCodes.OK).json({ msg: 'user logged out!' });
};

const forgotPassword = async(req,res)=>{
    const {email} = req.body;
    const origin = req.get("Origin")
    if(!email)
    throw new CustomError.BadRequestError("Please provide valid email");

    const user = await User.findOne({email});

    if(user)
    {
        const passwordToken = crypto.randomBytes(40).toString("hex").toString();
        // send email

        await sendResetPasswordEmail({name:user.name,email:user.email,token:passwordToken,origin})

        const tenMinutes = 1000*60*10;
        const passwordTokenExpirationDate = new Date(Date.now()+tenMinutes);

        user.passwordToken =  hashString(passwordToken);
        user.passwordTokenExpirationDate = passwordTokenExpirationDate

        await user.save();
   }

    res.send("please check your email for reset password link")
}

const resetPassword = async(req,res)=>{
    const {token,email,password} = req.body;

    if(!token || !email || !password)
    throw new CustomError.BadRequestError("Please provide all values")

    const user = await User.findOne({email});

    if(user)
    {
        const currentDate = new Date();
        if(user.passwordToken===hashString(token) && user.passwordTokenExpirationDate>currentDate)
        {
            user.password = password;
            user.passwordToken = null;
            user.passwordTokenExpirationDate = null;

            await user.save();
        }
    }
    res.status(StatusCodes.OK).send({msg:"success"})
}

module.exports = {
  register,
  login,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
  autoLogin
};
