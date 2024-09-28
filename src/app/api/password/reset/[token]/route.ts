import dbConnect from "../../../../../../backend/config/dbConnect";
import { NextRequest } from "next/server";
import { resetPassword } from "../../../../../../backend/controllers/AuthControllers";
import { createEdgeRouter } from "next-connect";

interface RequestContext{}

const router = createEdgeRouter<NextRequest, RequestContext>()

dbConnect()

router.put(resetPassword)

export const PUT = async (request : NextRequest, ctx : RequestContext) => {
  return router.run(request, ctx)
}