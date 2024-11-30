import { createEdgeRouter } from "next-connect";
import { NextRequest } from "next/server";
import dbConnect from "../../../../../../backend/config/dbConnect";
import {deleteRoom, updateRoomDetails } from "../../../../../../backend/controllers/roomControllers";
import { authorizeRoles } from "../../../../../../backend/middlewares/auth";

interface RequestContext {
  params : {
    id : string
  }
}

const router = createEdgeRouter<NextRequest, RequestContext>()

dbConnect()

router.use(authorizeRoles('admin')).put(updateRoomDetails)
router.use(authorizeRoles('admin')).delete(deleteRoom)

export const PUT = async(request : NextRequest, ctx : RequestContext) => {
  return router.run(request, ctx)
}

export const DELETE = async(request : NextRequest, ctx : RequestContext) => {
  return router.run(request, ctx)
}