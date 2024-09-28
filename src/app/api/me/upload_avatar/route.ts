import dbConnect from "../../../../../backend/config/dbConnect";
import { NextRequest } from "next/server";
import { uploadUserAvatar } from "../../../../../backend/controllers/AuthControllers";
import { isAuthenticatedUser } from "../../../../../backend/middlewares/auth";
import { createEdgeRouter } from "next-connect";

interface RequestContext{}

const router = createEdgeRouter<NextRequest, RequestContext>()

dbConnect()

router.use(isAuthenticatedUser).put(uploadUserAvatar)

export const PUT = async (request : NextRequest, ctx : RequestContext) => {
  return router.run(request, ctx)
}