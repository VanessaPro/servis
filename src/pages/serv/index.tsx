import { useEffect, useState } from 'react';
import {Container} from '../../components/container'
import { FaWhatsapp } from 'react-icons/fa';
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
  const navigate = useNavigate();

  useEffect (() => {
    async function loadServ(){
      if (!id){return}

      const docRef = doc (db, "servs",id)
      getDoc(docRef)
      .then((snapshot) => {

        if(!snapshot.data()){
          navigate("/")
        }
        setServ ({
          id: snapshot.id,
          name: snapshot.data()?.name,
          city: snapshot.data()?.city,
          price:snapshot.data()?.price,
          description: snapshot.data()?.description,
          images:snapshot.data()?.images,
          uid: snapshot.data()?.uid,
          crete: snapshot.data()?.crete,
          whatsapp:snapshot.data()?.whatsapp,
          owner:snapshot.data()?.owner 
        })

      })

    }

    loadServ();
  }, [id, navigate])


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
      
      {serv && (
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
      )}

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

             <a 
               href={`https://api.whatsapp.com/send?phone=${serv?.whatsapp}&text=Olá, vi esse serviço de ${serv?.name} no site WebX e fiquei interessado(a)`}
               target='_blank'
              className=' cursor-pointer bg-green-500 w-full text-white flex items-center justify-center gap-2 my-6 h-10 text-xl rounded-lg font-medium'>
                Conversar com o prestador do serviço
                <FaWhatsapp size={26} color="#fff"/>
             </a>
        </main>
      )}
    </Container>
    )
  }
  