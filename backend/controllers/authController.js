const User = require("../models/user")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

//register User
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body

        //validate input
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            })
        }

        //check existing user
        const existingUser = await User.findOne({ email })

        if (existingUser) {
            return res.status(400).json({
                message: "Email already registered"
            })
        }

        //Hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        //create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        })

        //Generate JWT
        const token = jwt.sign({
            id: user._id,
            role: user.role
        }, process.env.JWT_SECRET, { expiresIn: "1d" })

        //response
        return res.status(201).json({
            message: "User registered successfully",
            token,
            user:{
                id:user._id,
                name:user.name,
                email:user.email,
                role:user.role
            }
        })
    } catch (error) {
        return res.status(500).json({
            message: "Error registering user"
        })
    }
}


const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Validate input
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        // 2. Find user in MongoDB
        const user = await User.findOne({
            email: email.toLowerCase().trim()
        });

        // 3. Check whether user exists
        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // 4. Compare password
        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        // 5. Check password
        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // 6. Generate JWT
        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        // 7. Send response
        return res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            message: "Login failed",
            error: error.message
        });
    }
};


module.exports = { registerUser,loginUser }