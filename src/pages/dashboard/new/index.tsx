
import { ChangeEvent, useState,useContext } from 'react';
import {Container} from  '../../../components/container'
import { DashboardHeader } from '../../../components/panelheader'
import {FiUpload, FiTrash} from 'react-icons/fi'
import {Input}  from '../../../components/input'
import {useForm} from 'react-hook-form'
import  {z} from 'zod'
import {zodResolver} from '@hookform/resolvers/zod'
import {AuthContext} from '../../../contexts/AuthContext'
import {v4 as uuidV4} from 'uuid'
import { storage, db } from '../../../services/firebaseConecction';
import {
ref,
uploadBytes,
getDownloadURL,
deleteObject
} from 'firebase/storage'
import {addDoc, collection} from 'firebase/firestore'
import toast from 'react-hot-toast'


const schema = z.object({
  name:z.string().nonempty("O campo do nome é obrigatório"),
  description:z.string().nonempty("Descrição do serviço é obrigatório"),
  price:z.string().nonempty("O preço é obrigatório"),
  city:z.string().nonempty("A cidade é obrigatório"),
  whatsapp: z.string().min(1,"O telefone é obrigatório").refine((value) => /^(\d{10,12})$/.test(value),
  {
     message:"Número de telefone inválido"
  })
})

type FormData = z.infer<typeof schema>;

interface ImageItemProps{
  uid:string;
  name:string;
  previewUrl:string;
  url:string;
 
}

export function New() {
  const {user} = useContext(AuthContext);
  const {register,handleSubmit, formState: {errors}, reset} = useForm<FormData>({
    resolver:zodResolver(schema),
    mode: "onChange"
  })  

  const[carImages,setCarImages] = useState<ImageItemProps[]>([])

  async function handleFile(e: ChangeEvent<HTMLInputElement>){

    if(e.target.files && e.target.files[0]){
      const image = e.target.files[0]

      if(image.type === 'image/jpeg' || image.type === 'image/png'){
         await handleUpload(image)
      }else{
        alert("Envie uma imagem jpeg ou png!")
        return;
      }
    }
  }

  async function handleUpload(image: File){
    if(!user?.uid){
      return;
    }
    
    const currentUid = user?.uid;
    const uidImage = uuidV4();

    const uploadRef = ref(storage, `images/${currentUid}/${uidImage}`)

    uploadBytes(uploadRef, image)
    .then((snapshot) =>{
       getDownloadURL(snapshot.ref).then((downLoadUrl) =>{
         const imageItem = {
          name: uidImage,
          uid: currentUid,
          previewUrl: URL.createObjectURL(image),
          url: downLoadUrl,
         }

         setCarImages((images) => [...images, imageItem] )
         toast.success("Imagem cadastrada com sucesso!")
       })
    })
  }

  function onSumit(data: FormData){

    if(carImages.length === 0){
      toast.error("Envie pelo menos 1 imagem!")
      return;
    }
     

     const servListImages = carImages.map(serv => {
      return{
        uid:serv.uid,
        name:serv.name,
        url:serv.url
      }
      })
     
     addDoc(collection(db,"servs"), {
      uid: user?.uid,
      name:data.name,
      whatsapp:data.whatsapp,
      city:data.city,
      price:data.price,
      crete:new Date(),
      owner: user?.name,
      images:servListImages,
      description:data.description,
     })  
     .then(() => {
      reset();
      setCarImages([]);
       console.log("Cadastrado com sucesso");
        toast.success("Serviço cadastrado com sucesso!")
     })
     .catch((error) => {
      console.log(error)
      console.log("Erro ao cadastrar no banco") 
     })
    }
  


  async function handleDeleteImage(item: ImageItemProps){
    const imagePath = `images/${item.uid}/${item.name}`;

    const imageRef = ref(storage, imagePath);
        
    try {
      await deleteObject(imageRef);
      setCarImages(carImages.filter((serv) => serv.url !== item.url));
    } catch (err) {
      console.log("Erro ao Deletar");
    }

  }


    return (
      <Container>
      <DashboardHeader/>

      <div className='w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2'>
         <button className='border-2 w-48 rounded-lg flex items-center justify-center cursor-pointer border-gray-600 h-32 md:w-48'>
          <div className='absolute cursor-pointer'>
            <FiUpload size={30} color="#000"/>
          </div>
          <div className='cursor-pointer'>
            <input type="file" accept='image/*' className='opacity-0 cursor-pointer' onChange={handleFile} />
          </div>
         </button>
     

      {carImages.map( item =>(
        <div key={item.name} className='w-full h-32 flex items-center justify-center relative '>
          <button className='absolute' onClick={() => handleDeleteImage(item) }>
            <FiTrash size={28} color="#fff"/>
          </button>
          <img 
            src={item.previewUrl}
            className='rounded-lg h-32 object-cover w-60'
            alt='foto'
          />
        </div>
      ))}
      </div>

      <div className='w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2 mt-2'>
         <form className='w-full'
           onSubmit={handleSubmit(onSumit)}
         >
           <div className='mb-3'>
            <p className='mb-2 font-medium'>Nome do serviço</p>
              <Input 
                 type="text"
                 register={register}
                 name="name"
                 error={errors.name?.message}
                 placeholder='Ex: Carretos fretes'
              />
           </div>

           <div className='mb-3'>
            <p className='mb-2 font-medium'>Descrição do serviço</p>
              <Input 
                 type="text"
                 register={register}
                 name="description"
                 error={errors.description?.message}
                 placeholder='Ex: Eventos / Festas, Reparação'
              />
           </div>
     
           <div className='flex w-full mb-3 flex-row items-center gap-4'>
             <div>
              <p className='mb-2 font-medium'>Preço</p>
                  <Input 
                    type="text"
                    register={register}
                    name="price"
                    error={errors.price?.message}
                    placeholder='Ex: R$ 70,00'
                  />
             </div>

             <div>
              <p className='mb-2 font-medium'>Cidade</p>
                  <Input 
                    type="text"
                    register={register}
                    name="city"
                    error={errors.city?.message}
                    placeholder='Ex: Barueri,Centro'
                  />
             </div>

             <div>
              <p className='mb-2 font-medium'>Telefone / Whatsapp</p>
                  <Input 
                    type="text"
                    register={register}
                    name="whatsapp"
                    error={errors.whatsapp?.message}
                    placeholder='Ex: 01199999911'
                  />
             </div>
           </div>
          
        
             <button type="submit" className='w-full rounded-md  bg-zinc-900 text-white font-medium h-10'>
             Cadastrar
             </button>    

         </form>
      </div>
   </Container>
    )
  }