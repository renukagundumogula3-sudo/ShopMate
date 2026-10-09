const bcrypt = require('bcrypt');
const { getDB } = require('../config/db');
const jwt = require('jsonwebtoken');
const { sendVerificationMail, sendEmail } = require('../services/sendermail');
const { hasMailCredentials, resolveVerificationOutcome } = require('../utils/registrationUtils');

const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email and password are required.' });
        }

        const normalizedEmail = email.toLowerCase();
        const db = getDB();
        const existingUser = await db.collection('users').findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await db.collection('users').insertOne({
            name,
            email: normalizedEmail,
            password: hashedPassword,
            role: role || 'user',
            isVerified: false,
            createdAt: new Date(),
        });

        const verificationToken = jwt.sign(
            { email: normalizedEmail },
            process.env.JWT_SECRET || 'email_secret_key',
            { expiresIn: '1d' }
        );

        const mailConfigured = hasMailCredentials();
        let emailSent = false;

        if (mailConfigured) {
            try {
                await sendVerificationMail(normalizedEmail, name, verificationToken);
                emailSent = true;
            } catch (error) {
                console.error('Verification email could not be sent:', error.message);
            }
        }

        const outcome = resolveVerificationOutcome({ mailConfigured, emailSent });

        await db.collection('users').updateOne(
            { _id: result.insertedId },
            { $set: { isVerified: outcome.isVerified } }
        );

        res.status(201).json({
            message: outcome.message,
            userId: result.insertedId,
            isVerified: outcome.isVerified,
        });
    } catch (error) {
        console.error('Register user failed:', error);
        res.status(500).json({
            message: 'Server Error',
            error: error.message,
        });
    }
};
const generateAccessToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            email: user.email,
            role: user.role
        },
        "access_secret_key",
        { expiresIn: "15m"}
    );
};
const generateRefreshToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            email: user.email,
            role: user.role
        },
        "refresh_secret_key",
        {expiresIn: "7d"}
    );
};
const loginUser = async (req,res) => {
    try {
        const {email, password } = req.body;

        const db = getDB();
        const user = await db.collection('users').findOne({
            email: email.toLowerCase()
        });
        if (!user) {
            return res.status(401).json({message: "Invalid email" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid password" });
        }

        if (!user.isVerified) {
            const verificationToken = jwt.sign(
                { email: user.email },
                process.env.JWT_SECRET || 'email_secret_key',
                { expiresIn: '1d' }
            );
            await sendVerificationMail(user.email, user.name, verificationToken);
            return res.status(403).json({
                message: 'Account not verified. Verification email resent. Please check your inbox.',
            });
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        await db.collection('users').updateOne(
            { _id: user._id },
            { $set: { refresh_token: refreshToken } }
        );
        res.status(200).json({
            message: "Login successful",
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({
            message: "Login failed",
            error: error.message
        });
    }
};


const refreshUserToken = async (req,res) => {
    try{
        const { refreshToken } = req.body;
        if(!refreshToken) {
            return res.status(401).json({ message: "Refresh token is required. "});
        }
        let decoded;
        try{
            decoded = jwt.verify(refreshToken, "refresh_secret_key");
        } catch(err) {
            return res.status(401).json({message: "Invalid or expried refresh token."});
        }
        const db = getDB();
        const user = await db.collection("users").findOne({ email: decoded.email, refresh_token: refreshToken});
        if(!user) {
            return res.status(401).json({message: "Refresh token not vaild or user not found."});
        }
        const newAccessToken = generateAccessToken(user);
        const newRefreshToken= generateRefreshToken(user);
        await db.collection("users").updateOne(
            {_id: user._id },
            {$set: {refresh_token : newRefreshToken }}
        );
        res.status(200).json({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error during refresh",
            error : error.message
        });
    }
};

const sendPasswordResetOTP = async (req, res) => {
    try {
        const { email } = req.body;

        if(!email){
            return res.status(400).json({ message: "Email is required." });
        }

        const db = getDB();
        const usersCollection = db.collection('users');

        const normalizedEmail = email.toLowerCase();
        const user = await usersCollection.findOne({ email: normalizedEmail });

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpHash = await bcrypt.hash(otp, 10);
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
        console.log(`Forget Password requested for ${normalizedEmail}. Generated OTP: ${otp}`);
         await usersCollection.updateOne(
            { _id: user._id },
            { 
                $set: {
                reset_password_otp_hash: otpHash,
                reset_password_otp_expires_at: expiresAt,
                updated_at: new Date(),
        },
           }
    );

    const emailResult = await sendEmail({
        to: normalizedEmail,
        subject: "shopMATE Password Reset OTP",
        text: `Your OTP for password reset is: ${otp}. It will expire in 15 minutes.`,
        html: `<p>Your OTP for password reset is: <strong>${otp}</strong>. It will expire in 15 minutes.</p>`,      
    });

    console.log('Forget Password OTP email sent:', emailResult && emailResult.response);
     return res.status(200).json({ message: "OTP sent to your email. Please check your inbox." });
    } catch (error) {
        console.error('Error in sendPasswordResetOTP:', error);
        res.status(500).json({ message: 'could not send OTP.', error: error.message });
    }
};

const resetPassword=async(req,res)=>{
    try{
        const{email,otp,newPassword,confirmPassword}=req.body;
        if(!email || !otp || !newPassword || !confirmPassword){
            return res.status(400).json({message:"All fields are required."});
        }
        if(newPassword!==confirmPassword){
            return res.status(400).json({message:"new password and confirm password must match."});
        }
        const db=getDB();
        const userCollection=db.collection("users");
        const normalizedEmail=email.toLowerCase();
        const user=await userCollection.findOne({email:normalizedEmail});
        if(!user){
            return res.status(404).json({message:"No account found for this email."});
        }
        if(!user.reset_password_otp_hash || !user.reset_password_otp_expires_at){
            return res.status(400).json({message:"No pending password reset request found."});
        }
        const otpExpired=new Date()>new Date(user.reset_password_otp_expires_at);
        if(otpExpired){
            return res.status(400).json({message:"the OTP has expired. Please request a new one."});
        }
        const validOtp=await bcrypt.compare(otp,user.reset_password_otp_hash);
        if(!validOtp){
            return res.status(400).json({message:"Invalid OTP provided."});
        }
        const hashedPassword=await bcrypt.hash(newPassword,10);
        await userCollection.updateOne(
            {_id:user._id},
            {$set:{
                password:hashedPassword,
                refresh_token:null,
                reset_password_otp_hash:null,
                reset_password_otp_expires_at:null,
                updated_at:new Date(),
            },
        });
        return res.status(200).json({message:"Password updated successfully. please log in with your new password."});
    }
    catch(error){
        console.error('Reset Password Error:', error);
        return res.status(500).json({message:"Password reset failed.",error:error.message});
}
};



module.exports={
    loginUser,
    registerUser,
    refreshUserToken,
    sendPasswordResetOTP,
    resetPassword
};


