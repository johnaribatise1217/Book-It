import dbConnect from "../../../../../backend/config/dbConnect";
import { NextRequest } from "next/server";
import { forgotPassword} from "../../../../../backend/controllers/AuthControllers";
import { createEdgeRouter } from "next-connect";

interface RequestContext{}

const router = createEdgeRouter<NextRequest, RequestContext>()

dbConnect()

router.post(forgotPassword)

export const POST = async (request : NextRequest, ctx : RequestContext) => {
  return router.run(request, ctx)
}