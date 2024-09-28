import { createEdgeRouter } from "next-connect";
import { NextRequest } from "next/server";
import { updateUser } from "../../../../../backend/controllers/AuthControllers";
import dbConnect from "../../../../../backend/config/dbConnect";
import { isAuthenticatedUser } from "../../../../../backend/middlewares/auth";

interface RequestContext {
  params : {
    id : string
  }
}

const router = createEdgeRouter<NextRequest, RequestContext>()

dbConnect()

//protect the update route
router.use(isAuthenticatedUser).put(updateUser)
 
export const PUT = async(request : NextRequest, ctx : RequestContext) => {
  return router.run(request, ctx)
}