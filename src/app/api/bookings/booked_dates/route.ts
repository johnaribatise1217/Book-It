import dbConnect  from "../../../../../backend/config/dbConnect";
import { NextRequest} from "next/server";
import { createEdgeRouter } from "next-connect";
import { getRoomBookedDates} from "../../../../../backend/controllers/BookingController";

interface RequestContext {
  params : {id : string}
}

const router = createEdgeRouter<NextRequest, RequestContext>()

dbConnect()

router.get(getRoomBookedDates)

export const GET = async(request : NextRequest, ctx : RequestContext) => {
  return router.run(request, ctx)
}