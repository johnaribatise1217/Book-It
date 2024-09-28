import { NextApiRequest, NextApiResponse } from "next";
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials' 
import dbConnect from "../../../../../backend/config/dbConnect";
import User, { IUser } from "../../../../../backend/models/user";
import bycrypt from 'bcryptjs'

type Credentials = {
  email : string,
  password : string
}

type Token = {
  user : IUser
}

export const auth = async(req : NextApiRequest, res : NextApiResponse) => {
  return await NextAuth(req, res, {
    session : {
      strategy : "jwt"
    },
    providers : [
      CredentialsProvider({
        name : "credentials",
        // @ts-ignore
        async authorize(credentials : Credentials) {
          dbConnect()

          const {email, password} = credentials
          const user = await User.findOne({email}).select("+password")

          if(!user){
            throw new Error("Invalid email or password")
          }
          //compare the inputed password to the password in the database
          const isPasswordMatched = await bycrypt.compare(
            password,
            user.password
          )
          //if the password does not match , throw an error
          if(!isPasswordMatched){
            throw new Error("Invalid password")
          }
          return user
        },
      })
    ],
    callbacks : {
      jwt : async({token , user}) => {
        const jwtToken = token as Token
        user && (token.user = user)
        
        //update session when user is updated
        if(req?.url?.includes("/api/auth/session?update")){
          //hit the database and return the updated user
          const updatedUser = await User.findById(jwtToken?.user?._id)
          token.user = updatedUser
        }
        return token
      },
      session : async({session , token}) => {
        session.user = token.user as IUser
        //we have to make sure the hashed user password is not returned 
        
        // @ts-ignore
        delete session?.user?.password

        return session
      }
    },
    pages : {
      signIn : "/login",
      signOut : "/"
    },
    secret : process.env.NEXTAUTH_SECRET
  })
}

export {auth as GET, auth as POST}