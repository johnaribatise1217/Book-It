import dbConnect from "../../../../../backend/config/dbConnect";
import { NextRequest} from "next/server";
import { createEdgeRouter } from "next-connect";
import { registerUser } from "../../../../../backend/controllers/AuthControllers";

interface RequestContext {}

const router = createEdgeRouter<NextRequest, RequestContext>()

dbConnect()

router.post(registerUser)

export const POST = async(request : NextRequest, ctx : RequestContext) => {
  return router.run(request, ctx)
}