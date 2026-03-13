const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")
// const emailService = require("../services/email.service")
const tokenBlackListModel = require("../models/blacklist.model")

/**
* - user register controller
* - POST /api/auth/register
*/
async function userRegisterController(req, res) {
try {

const { email, password, username } = req.body

const isExists = await userModel.findOne({ email })

if (isExists) {
return res.status(422).json({
message: "User already exists with email."
})
}

const user = await userModel.create({
email,
password,
username
})

const token = jwt.sign(
{ userId: user._id },
process.env.JWT_SECRET,
{ expiresIn: "3d" }
)

res.cookie("token", token)

res.status(201).json({
user,
token
})

} catch (error) {
console.log(error)
res.status(500).json({
message: "Register failed"
})
}
}

/**
 * - User Login Controller
 * - POST /api/auth/login
  */

async function userLoginController(req, res) {
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

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "3d" })

    res.cookie("token", token)

    res.status(200).json({
        user: {
            _id: user._id,
            email: user.email,
            name: user.name
        },
        token
    })

}


/**
 * - User Logout Controller
 * - POST /api/auth/logout
  */
async function userLogoutController(req, res) {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[ 1 ]

    if (!token) {
        return res.status(200).json({
            message: "User logged out successfully"
        })
    }



    await tokenBlackListModel.create({
        token: token
    })

    res.clearCookie("token")

    res.status(200).json({
        message: "User logged out successfully"
    })

}

async function getMeController(req, res) {
    try {

        const token = req.cookies.token || req.headers.authorization?.split(" ")[1]

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
                email: user.email,
                name: user.name
            }
        })

    } catch (error) {
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