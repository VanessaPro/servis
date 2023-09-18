import { useEffect, useState } from 'react';
import {Container} from '../../components/container'
import { FaHandHolding, FaWhatsapp } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import { getDoc, doc } from 'firebase/firestore';
import {db } from '../../services/firebaseConecction'
import {Swiper, SwiperSlide} from 'swiper/react'

 interface ServProps {
  id:string;
  name:string;
  uid:string;
  price: string | number;
  city:string;
  description:string;
  owner: string;
  whatsapp:string;
  crete:string; 
  images:ImagesServProps[];
  
}

interface ImagesServProps {
  uid: string;
  name: string;
  previewUrl?: string;
  url: string;
}

export function ServDetail() {
  const {id} = useParams();
  const [serv, setServ] = useState<ServProps>()
  const [sliderPerView, setSlidePerView] = useState<number>(2);

  useEffect (() => {
    async function loadServ(){
      if (!id){return}
      const docRef = doc (db, "servs",id)
      getDoc(docRef)
      .then((snaphot) => {
        setServ ({
          id: snaphot.id,
          name: snaphot.data()?.name,
          city: snaphot.data()?.city,
          price: snaphot.data()?.price,
          description: snaphot.data()?.description,
          images: snaphot.data()?.images,
          uid: snaphot.data()?.uid,
          crete: snaphot.data()?.crete,
          whatsapp:snaphot.data()?.whatsapp,
          owner:snaphot.data()?.owner 
        })

      })

    }

    loadServ();
  }, [id])


  useEffect (() => {
    
    function handleResize(){
      if(window.innerWidth < 720){
        setSlidePerView(1);
      }else{
        setSlidePerView(2);
      }

    }

    handleResize();

    window.addEventListener("resize", handleResize)

    return() => {
      window.removeEventListener("resize", handleResize)
    }

  },[])

    return (
    <Container>
      
      <Swiper 
      slidesPerView={sliderPerView}
      pagination={{clickable:true}}
      navigation
      >
         {serv?.images.map(image =>(
          <SwiperSlide key={image.name}>
            <img 
             src={image.url}
             className='w-full h-96 object-cover'
            />
          </SwiperSlide>
         ))}
        
      </Swiper>
      {serv &&(
        <main className='w-full bg-white rounded-lg p-6 my-4'>
          <div className='flex flex-col sm:flex-row mb-4 items-center justify-between'>
            <h1 className='font-bold text-3xl text-black'>{serv?.name}</h1>
             <h1 className='font-bold text-3xl text-black'>R$ {serv?.price}</h1>
          </div>
          <div className='flexw-full gap-6 my-4'>
            <div>
              <p>Cidade</p>
              <strong>{serv?.city}</strong>
            </div>

          </div>

          <strong>Descrição:</strong>
            <p className='mb-4'>{serv?.description}</p>

            <strong>Telefone / WhatsApp</strong>
             <p>{serv?.whatsapp}</p>

             <a className=' cursor-pointer bg-green-500 w-full text-white flex items-center justify-center gap-2 my-6 h-10 text-xl rounded-lg font-medium'>
              Conversar com o prestador do serviço
              <FaWhatsapp size={26} color="#fff"/>
             </a>
        </main>
      )}
    </Container>
    )
  }
  