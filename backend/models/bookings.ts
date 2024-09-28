import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "./user";
import { IRoom } from "./rooms";

export interface IBooking extends Document{
  room : IRoom
  user : IUser
  checkInDate : Date
  checkOutDate : Date
  amountPaid : number
  daysOfStay : number
  paymentInfo : {
    id : string,
    status : string
  }
  paidAt : Date
  createdAt : Date
}

const bookingSchema : Schema<IBooking> = new mongoose.Schema({
  room : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "Room",
    required : true
  },
  user : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "User",
    required : true
  },
  checkInDate : {
    type : Date,
    required : true
  },
  checkOutDate : {
    type : Date,
    required : true
  },
  amountPaid : {
    type : Number,
    required : true
  },
  paymentInfo : {
    id : {
      type : String,
      required : true
    },
    status : {
      type : String,
      required : true
    }
  },
  daysOfStay : {
    type: Number,
    required : true
  },
  paidAt : {
    type : Date,
    required : true
  },
  createdAt : {
    type : Date,
    default : Date.now()
  }
})

export default mongoose.models.Booking || mongoose.model('Booking', bookingSchema)