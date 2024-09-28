import { createEdgeRouter } from "next-connect";
import { NextRequest } from "next/server";
import {newRoom } from "../../../../../backend/controllers/roomControllers";
import dbConnect from "../../../../../backend/config/dbConnect"

interface RequestContext {
  params : {
    id : string
  }
}

const router = createEdgeRouter<NextRequest, RequestContext>()

dbConnect()
router.post(newRoom)

export const POST = async(request : NextRequest, ctx : RequestContext) => {
  return router.run(request, ctx)
}