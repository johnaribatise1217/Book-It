import React from 'react'
import { IImage } from '../../../../backend/models/rooms'
import { Carousel } from 'react-bootstrap'
import Image from 'next/image'

interface Props{
  images : IImage[]
}

const RoomImagesSlider = ({images} : Props) => {
  return (
    <Carousel>
      {images?.length > 0 ? (
        images?.map((image) => (
          <Carousel.Item key={image?.public_id}>
            <div style={{widows : "100%", height : "460px"}}>
              <Image
                className='d-block m-auto'
                src={image?.url}
                alt={image?.url}
                layout='fill'
              />
            </div>
          </Carousel.Item>
        ))
      ) : (
        <Carousel.Item >
            <div style={{widows : "100%", height : "460px"}}>
              <Image
                className='d-block m-auto'
                src="/images/default_room_image.png"
                alt="/images/default_room_image.png"
                layout='fill'
              />
            </div>
          </Carousel.Item>
      )
    }
    </Carousel>
  )
}

export default RoomImagesSlider