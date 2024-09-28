import dbConnect  from "../../../../../backend/config/dbConnect";
import { NextRequest} from "next/server";
import { createEdgeRouter } from "next-connect";
import { checkRoomBookingAvailabillity } from "../../../../../backend/controllers/BookingController";
import { isAuthenticatedUser } from "../../../../../backend/middlewares/auth";

interface RequestContext {}

const router = createEdgeRouter<NextRequest, RequestContext>()

dbConnect()

router.get(checkRoomBookingAvailabillity)

export const GET = async(request : NextRequest, ctx : RequestContext) => {
  return router.run(request, ctx)
}