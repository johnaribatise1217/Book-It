import dbConnect  from "../../../../../../backend/config/dbConnect";
import { NextRequest} from "next/server";
import { createEdgeRouter } from "next-connect";
import { isAuthenticatedUser } from "../../../../../../backend/middlewares/auth";
import { stripeCheckoutSession } from "../../../../../../backend/controllers/PaymentController";

interface RequestContext {
  params : {id : string}
}

const router = createEdgeRouter<NextRequest, RequestContext>()

dbConnect()

router.use(isAuthenticatedUser).get(stripeCheckoutSession)

export const GET = async(request : NextRequest, ctx : RequestContext) => {
  return router.run(request, ctx)
}