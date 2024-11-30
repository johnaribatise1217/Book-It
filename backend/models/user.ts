import mongoose, {Document, Model, Schema} from "mongoose";
import bycrypt from 'bcryptjs'
import crypto from 'crypto'

export interface IUser extends Document{
  name : string,
  email : string
  password : string
  avatar : {
    public_id : string,
    url : string
  }
  role : string
  createdAt : Date
  resetPasswordToken : string
  resetPasswordExpire : string
  comparePassword(enteredPassword : string) : Promise<boolean>
  getResetPasswordToken() : string
}

export interface IUserModel extends Model<IUser>{
  findUserByEmail(email : string) : Promise<IUser|null>
}

//create user schema from mongoose
const userSchema : Schema<IUser> = new Schema({
  name : {
    type : String,
    required : [true, "Please enter user name"]
  },
  email : {
    type : String,
    required : [true, "Please enter user email"],
    unique : true
  },
  password : {
    type : String,
    required : [true, "Please enter password"],
    minlength : [6, "your password must be longer than 6 characters"],
    select : false
  },
  avatar : {
    public_id : String,
    url : String
  },
  role : {
    type : String,
    default : 'admin'
  },
  createdAt : {
    type : Date,
    default : Date.now
  },
  resetPasswordExpire : String,
  resetPasswordToken : String
})

//Encrypting the password before saving the user
userSchema.pre("save", async function(next) {
  //we first check if the password has been modified 
  if(!this.isModified('password')){
    next()
  }

  this.password = await bycrypt.hash(this.password, 12)
})

//Compare user password
userSchema.methods.comparePassword = async function(enteredPassword : string) : Promise<boolean>{
  return await bycrypt.compare(enteredPassword, this.password)
}

//Generate reset password token
userSchema.methods.getResetPasswordToken = function() : string{
  //Generate the token
  const resetToken = crypto.randomBytes(20).toString('hex')
  //hash the token using the sha256 algorithm 
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')
  //set the token expire time to 30 mins
  this.resetPasswordExpire = Date.now() + 30 * 60 * 1000

  return resetToken
}

//use static method to find user by email
userSchema.statics.findUserByEmail = async function (email : string):Promise<IUser | null> {
  return await this.find({email}).select('+password')
}

export default mongoose.models.User || mongoose.model<IUser>('User', userSchema)