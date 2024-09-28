import dbConnect  from "../../../../../backend/config/dbConnect";
import { NextRequest} from "next/server";
import { createEdgeRouter } from "next-connect";
import { myBookings } from "../../../../../backend/controllers/BookingController";
import { isAuthenticatedUser } from "../../../../../backend/middlewares/auth";

interface RequestContext {}

const router = createEdgeRouter<NextRequest, RequestContext>()

dbConnect()

router.use(isAuthenticatedUser).get(myBookings)

export const GET = async(request : NextRequest, ctx : RequestContext) => {
  return router.run(request, ctx)
}