import dbConnect  from "../../../../../backend/config/dbConnect";
import { NextRequest} from "next/server";
import { createEdgeRouter } from "next-connect";
import { isAuthenticatedUser } from "../../../../../backend/middlewares/auth";
import { stripeCheckoutSession, webhookCheckout } from "../../../../../backend/controllers/PaymentController";

interface RequestContext {
  params : {id : string}
}

const router = createEdgeRouter<NextRequest, RequestContext>()

dbConnect()

router.post(webhookCheckout)

export const POST = async(request : NextRequest, ctx : RequestContext) => {
  return router.run(request, ctx)
}