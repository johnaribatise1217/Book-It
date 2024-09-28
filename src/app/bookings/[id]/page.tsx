import Error from "@/app/error";
import MyBookings from "@/app/components/bookings/MyBookings";
import { getAuthHeader } from "../../../../helpers/authHeaders";
import BookingDetails from "@/app/components/bookings/BookingDetails";

export const metadata = {
  title : 'My Bookings Details'
}

const getBookings = async(id : string) => {
  const authHeader = getAuthHeader()
  const res = await fetch(`${process.env.API_URL}/api/bookings/${id}`, authHeader)
 
  return res.json()
}

export default async function MyBookingsPage({params} : {params : {id : string}}) {
  const data = await getBookings(params?.id)

  if(data?.errMessage){
    return <Error error={data}/>
  }
  
  return (
    <BookingDetails data={data}/>
  );
}
