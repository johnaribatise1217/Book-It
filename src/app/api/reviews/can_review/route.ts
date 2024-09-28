import { createEdgeRouter } from "next-connect";
import { NextRequest } from "next/server";
import {canUserReviewRoom, createRoomReview} from "../../../../../backend/controllers/roomControllers";
import dbConnect from "../../../../../backend/config/dbConnect";
import { isAuthenticatedUser } from "../../../../../backend/middlewares/auth";

interface RequestContext {
  params : {
    id : string
  }
}

const router = createEdgeRouter<NextRequest, RequestContext>()

dbConnect()

router.use(isAuthenticatedUser).get(canUserReviewRoom)
 
export const GET= async(request : NextRequest, ctx : RequestContext) => {
  return router.run(request, ctx)
}