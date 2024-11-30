import { createEdgeRouter } from "next-connect";
import { NextRequest } from "next/server";
import dbConnect from "../../../../../backend/config/dbConnect"
import { authorizeRoles, isAuthenticatedUser } from "../../../../../backend/middlewares/auth";
import { getSalesStats } from "../../../../../backend/controllers/BookingController";

interface RequestContext {
  params : {
    id : string
  }
}

const router = createEdgeRouter<NextRequest, RequestContext>()

dbConnect()
router.use(isAuthenticatedUser, authorizeRoles('admin')).get(getSalesStats)

export const GET = async(request : NextRequest, ctx : RequestContext) => {
  return router.run(request, ctx)
}