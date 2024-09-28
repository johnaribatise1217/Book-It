import { NextRequest, NextResponse } from "next/server";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors";
import  User from "../models/user";
import ErrorHandler from "../utils/errorHandler";
import { delete_file, upload_file } from "../utils/cloudinary";
import { ResetPasswordHtmlTemplate } from "../utils/EmailTemplate";
import sendEmail from "../utils/sendEmail";
import crypto from 'crypto'

//Register user : /api/auth/register
export const registerUser = catchAsyncErrors(
async(req : NextRequest) => {
  const body = await req.json()

  //destructure the body properties
  const {name , password , email} = body

  const user = await User.create({
    name , password , email
  })

  return NextResponse.json({
    success : true,
    message : "User created successfully"
  })
})

//update user profile : /api/me/update
export const updateUser = catchAsyncErrors(
  async(req : NextRequest) => {
    const body = await req.json()
    const userData = {
      name : body.name,
      email : body.email
    }
  
    const user = await User.findByIdAndUpdate(req.user._id, userData)
  
    return NextResponse.json({
      success : true,
      user
    })
  })

//update user password : /api/me/update_password
export const updateUserPasssword = catchAsyncErrors(
  async(req : NextRequest) => {
    const body = await req.json()
  
    const user = await User.findById(req?.user?._id).select('+password')

    const isPasswordMatched = await user.comparePassword(body.oldPassword)

    if(!isPasswordMatched){
      throw new ErrorHandler('Old password is incorrect', 400)
    }

    user.password = body.newPassword
    await user.save()
  
    return NextResponse.json({
      success : true,
    })
})

//upload user avatar : /api/me/upload_avatar
export const uploadUserAvatar = catchAsyncErrors(
  async(req : NextRequest) => {
    const body = await req.json()
  
    const avatarResponse = await upload_file(body?.avatar, "Book-it-app/avatars")

    //remove avatar file from cloudinary
    if(req?.user?.avatar?.public_id){
      await delete_file(req?.user?.avatar?.public_id)
    }

    const user = await User.findByIdAndUpdate(req?.user?._id, {
      avatar : avatarResponse
    })
  
    return NextResponse.json({
      success : true,
      user
    })
})

//forgot password : /api/password/forgot
export const forgotPassword = catchAsyncErrors(
  async(req : NextRequest) => {
    const body = await req.json()
    //search for the user
    const user = await User.findOne({
      email : body.email
    })
    //handle user not found error
    if(!user) {
      throw new ErrorHandler('User not found with this email', 404)
    }
    //get reset token
    const resetToken = user.getResetPasswordToken()
    await user.save()

    //create reset password url
    const resetUrl = `${process.env.API_URL}/password/reset/${resetToken}`

    const message = ResetPasswordHtmlTemplate(user?.name, resetUrl)

    try {
      await sendEmail({
        email : user.email,
        subject : "BookIt Password Recovery",
        message
      })
    } catch (error : any) {
      user.resetPasswordExpire = undefined
      user.resetPasswordToken = undefined

      await user.save()

      throw new ErrorHandler(error?.message, 500)
    }

    return NextResponse.json({
      success : true,
      user
    })
})

//Reset Password : api/password/reset/:token
export const resetPassword = catchAsyncErrors(
  async(req : NextRequest, {params} : {params: {token : string}}) => {
    const body = await req.json()
    console.log()

    const user1 = await User.findOne({
      email : body.Email
    }).select('+password')

    if(!user1){
      throw new ErrorHandler("verification email does not exist", 404)
    }

    const user = await User.findOne({
      resetPasswordToken : user1.resetPasswordToken,
      resetPasswordExpire : {$gt : Date.now()}
    })

    if(!user){
      throw new ErrorHandler("Password token is invalid or is expired", 404)
    }

    if(body.password !== body.confirmPassword){
      throw new ErrorHandler(
        "Passwords do not match",
        400
      )
    }

    //set the new password
    user.password = body.password
    user.resetPasswordExpire = undefined
    user.resetPasswordToken = undefined

    await user.save()

    return NextResponse.json({
      success : true,
      message : "user password changed successfully"
    })
  }
)