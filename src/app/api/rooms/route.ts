import { createEdgeRouter } from "next-connect";
import { NextRequest } from "next/server";
import { allRooms} from "../../../../backend/controllers/roomControllers";
import dbConnect from "../../../../backend/config/dbConnect";
import { authorizeRoles, isAuthenticatedUser } from "../../../../backend/middlewares/auth";

interface RequestContext {
  params : {
    id : string
  }
}

const router = createEdgeRouter<NextRequest, RequestContext>()

dbConnect()

router.get(allRooms)
 
export const GET = async(request : NextRequest, ctx : RequestContext) => {
  return router.run(request, ctx)
}