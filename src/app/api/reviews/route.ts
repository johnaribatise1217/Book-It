import { createEdgeRouter } from "next-connect";
import { NextRequest } from "next/server";
import {createRoomReview} from "../../../../backend/controllers/roomControllers";
import dbConnect from "../../../../backend/config/dbConnect";
import { isAuthenticatedUser } from "../../../../backend/middlewares/auth";

interface RequestContext {
  params : {
    id : string
  }
}

const router = createEdgeRouter<NextRequest, RequestContext>()

dbConnect()

router.use(isAuthenticatedUser).put(createRoomReview)
 
export const PUT = async(request : NextRequest, ctx : RequestContext) => {
  return router.run(request, ctx)
}