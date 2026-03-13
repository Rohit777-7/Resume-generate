const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")
const tokenBlackListModel = require("../models/blacklist.model")

async function userRegisterController(req, res) {

  try {

    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required"
      })
    }

    const isExists = await userModel.findOne({ email })

    if (isExists) {
      return res.status(422).json({
        message: "User already exists with email"
      })
    }

    const user = await userModel.create({
      name,
      email,
      password
    })

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "3d" }
    )

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none"
    })

    res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      },
      token
    })

  } catch (error) {

    console.log("REGISTER ERROR:", error)

    res.status(500).json({
      message: "Server error"
    })
  }
}



async function userLoginController(req, res) {

  try {

    const { email, password } = req.body

    const user = await userModel.findOne({ email }).select("+password")

    if (!user) {
      return res.status(401).json({
        message: "Email or password is INVALID"
      })
    }

    const isValidPassword = await user.comparePassword(password)

    if (!isValidPassword) {
      return res.status(401).json({
        message: "Email or password is INVALID"
      })
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "3d" }
    )

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none"
    })

    res.status(200).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      },
      token
    })

  } catch (error) {

    console.log("LOGIN ERROR:", error)

    res.status(500).json({
      message: "Server error"
    })
  }
}



async function userLogoutController(req, res) {

  const token = req.cookies.token

  if (!token) {
    return res.status(200).json({
      message: "User logged out"
    })
  }

  await tokenBlackListModel.create({ token })

  res.clearCookie("token")

  res.status(200).json({
    message: "User logged out"
  })
}



async function getMeController(req, res) {

  try {

    const token =
      req.cookies.token ||
      req.headers.authorization?.split(" ")[1]

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized"
      })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const user = await userModel.findById(decoded.userId)

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      })
    }

    res.status(200).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    })

  } catch (error) {

    console.log("GETME ERROR:", error)

    res.status(500).json({
      message: "Server error"
    })
  }
}


module.exports = {
  userRegisterController,
  userLoginController,
  userLogoutController,
  getMeController
}