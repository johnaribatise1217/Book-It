import dbConnect  from "../../../../backend/config/dbConnect";
import { NextRequest} from "next/server";
import { createEdgeRouter } from "next-connect";
import { newBooking } from "../../../../backend/controllers/BookingController";
import { isAuthenticatedUser } from "../../../../backend/middlewares/auth";

interface RequestContext {}

const router = createEdgeRouter<NextRequest, RequestContext>()

dbConnect()

router.use(isAuthenticatedUser).post(newBooking)

export const POST = async(request : NextRequest, ctx : RequestContext) => {
  return router.run(request, ctx)
}