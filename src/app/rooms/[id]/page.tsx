import Image from "next/image";
import Home from "@/app/components/Home";
import Error from "@/app/error";
import RoomDetails from "@/app/components/room/RoomDetails";

interface Props{
  params : {id : string}
}

const getRooms = async(id : string) => {
  const res = await fetch(`${process.env.API_URL}/api/rooms/${id}`, {
    cache : 'no-cache'
  })
  return res.json()
}

export default async function RoomDetailsPage({params} : Props) {
  const data = await getRooms(params?.id)

  if(data?.errMessage){
    return <Error error={data}/>
  }
  
  return (
    <RoomDetails data={data}/>
  );
}

export const generateMetadata = async({params} : Props) => {
  const data = await getRooms(params?.id)

  return {
    title : data?.room?.name
  }
}
