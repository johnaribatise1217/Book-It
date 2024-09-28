import { createEdgeRouter } from "next-connect";
import { NextRequest } from "next/server";
import dbConnect from "../../../../../backend/config/dbConnect";
import { getRoomDetails} from "../../../../../backend/controllers/roomControllers";

interface RequestContext {
  params : {
    id : string
  }
}

const router = createEdgeRouter<NextRequest, RequestContext>()

dbConnect()

router.get(getRoomDetails)
 
export const GET = async(request : NextRequest, ctx : RequestContext) => {
  return router.run(request, ctx)
}