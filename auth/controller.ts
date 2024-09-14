import AppDataSource from "../config";
import bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import User from "../entities/user";


const generateAccessToken = (user_email_id: String) => {
    const user_email = user_email_id;
    return jwt.sign({ email: user_email }, process.env.TOKEN_SECRET || "", {
        expiresIn: "2h",
    });
};

const login = async (req: any, res: any) => {
    console.log("LoginCalled")
    const userRepo = AppDataSource.getRepository(User);

    const user = await userRepo.findOne({
        where: { email: req.body.email },
    });

    if (!user) {
        return res.status(404).json({
            error: "User not found, Please Register.",
            status: "404"
        });
    } else {
        const matchPassword = await bcrypt.compare(
            req.body.password,
            user.password
        );
        if (!matchPassword) {
            return res.status(404).json({
                error: "Invalid Credentials",
                status: "404"
            });
        } else {
            const accessToken = generateAccessToken(user.email);
            res.status(200).json({
                status: "200",
                message: "User Logged In",
                userName: user.name,
                accessToken: accessToken,
                email: user.email,
            });
        }
    }
};

const register = async (req: any, res: any) => {
    console.log("registerCalled")
    const userRepo = AppDataSource.getRepository(User)

    const user = await userRepo.findOne({
        where: { email: req.body.email },
    });

    try {
        if (user) {
            // if (user.verified) {
            res.status(203).json({
                message: "User already Registered, Please Login to your account",
            });
        } else {
            let user = { ...req.body };
            const hashedpassword = await bcrypt.hash(user.password, 12);
            user.password = hashedpassword;
            console.log(user)
            await userRepo.save(user);
            res.status(200).json({
                status: "200",
                message: "User Registered Successfully"
            })
        }
    } catch (error) {
        res.status(404).json({
            status: "404",
            message: error
        })
    }   
};

const getUsers = async (req: any, res: any) => {
    const userRepo = AppDataSource.getRepository(User)

    const users = await userRepo.find();
    res.status(200).json({
        status: "200",
        data: users
    })
}

export const controller = {
    login,
    register,
}