import {useEffect, useState, useContext} from 'react'
import { Container } from "../../components/container";
import {DashboardHeader} from '../../components/panelheader'
import {FiTrash2} from   'react-icons/fi'

import {collection, getDocs,where,query, doc, deleteDoc} from 'firebase/firestore'
import {db,storage}  from '../../services/firebaseConecction'
import {ref, deleteObject} from  'firebase/storage'
import {TServs} from '../../types/TServs'
import { AuthContext } from '../../contexts/AuthContext';

export function Dasboard() {

  const [servs, setServs] = useState<TServs[]>([]);
  const { user } = useContext(AuthContext); 

  useEffect(() => {
    function loadServs() {
      if (!user?.uid) {
        return;
      }

      const servRef = collection(db, 'servs');
      const queryRef = query(servRef, where('uid', '==', user.uid));

     
  
      getDocs(queryRef).then((snapshot) => {
        const listservs = [] as TServs[];

        snapshot.forEach((doc) => {
          listservs.push({
          id: doc.id,
          name: doc.data().name,
          city: doc.data().city,
          price: doc. data().price,
          description:doc.data().description,
          images:doc.data().images,
          uid:doc.data().uid,
        });
      });
        
        setServs(listservs);
       
      });
    }

    loadServs();
  }, [user]);

  async function handleDeleteServ(serv: TServs) {
    const itemServ = serv;

    const docRef = doc(db, 'servs', itemServ.id);
    await deleteDoc(docRef);

    itemServ.images.map(async (image) => {
      const imagePath = `images/${image.uid}/${image.name}`;
      const imageRef = ref(storage, imagePath);

      try {
        await deleteObject(imageRef);
        setServs(servs.filter((serv) => serv.id !== itemServ.id));
       
      } catch (err) {
        console.log("Erro ao excluir a imagem")
      }
    })
    
  }
  
 
    return (
      <Container>
         <DashboardHeader/>

         <main className="grid gird-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {servs.map( serv =>(
              <section key={serv.id} className="w-full bg-white rounded-lg relative">
              <button
                  onClick={() => handleDeleteServ(serv)}
                  className="absolute bg-white w-14 h-14 rounded-full flex items-center justify-center right-2 top-2 drop-shadow"
              >
                <FiTrash2 size={26} color="#000" />
              </button>
            <img className="w-full rounded-lg mb-2 max-h-70"
              src={serv.images[0].url}
            
            />
            <p className="font-bold mt-1 px-2 mb-2">{serv.name}</p>

            <div className="flex flex-col px-2">
              <span className="text-zinc-700 mb-6">{serv.description}</span>
              <strong className="text-black font-medium text-xl">R$ {serv.price}</strong>
            </div>

            <div className="w-full h-px bg-slate-200 my-2"></div>
              <div className="px-2 pb-2">
                <span className="text-black "> {serv.city}</span>
              </div>
            </section>
            ))}

         </main>
      </Container>
    )
  }
  