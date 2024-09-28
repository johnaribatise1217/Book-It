import mongoose from "mongoose"
import {rooms} from "./data"
import Room from '../backend/models/rooms'

const seedRooms = async () => {
  try {
    //connect to database
    await mongoose.connect("mongodb://localhost:27017/bookit")
    //deleted all the rooms in the database
    await Room.deleteMany();
    console.log("All rooms have been deleted")
    //then insert all the rooms into the database
    await Room.insertMany(rooms);
    console.log("All rooms have been inserted.")
    process.exit()

  } catch (error) {
    console.log(error)
    process.exit()
  }
}

seedRooms()