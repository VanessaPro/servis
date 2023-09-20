
import {useState,useEffect} from 'react'
import {Link} from 'react-router-dom'
import { Container } from "../../components/container"
import {
  collection,
  query,
  orderBy, 
  getDocs, 
  
} from 'firebase/firestore'
import {db}  from '../../services/firebaseConecction'
import {TServs} from '../../types/TServs'


export function Home() {
  const [servs, setServs] = useState<TServs[]>([]);
  const [loadImages, setLoadImages] = useState<string[]>([]);
  const [input, setInput] = useState("");

  
  
  useEffect(() => {
    async function fetchData() {
      loadServs();
    }

    fetchData();
  }, []); 

  async function loadServs() {
    try {
      const servsRef = collection(db, 'servs');
      const queryRef = query(servsRef, orderBy('crete', 'desc'));
      const querySnapshot = await getDocs(queryRef);
  
      const listservs: TServs[] = [];
  
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const serv: TServs = {
          id: doc.id,
          name: data.name,
          city: data.city,
          price: data.price,
          description: data.description,
          images: data.images,
          uid: data.uid
        };
  
        listservs.push(serv);
      });
  
      setServs(listservs);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  
  function handleImageLoad(id: string) {
    setLoadImages((prevImageLoaded) => [...prevImageLoaded, id]);
  }

  async function handleSearchServ() {
    if (input === '') {
      loadServs();
      return;
    }
  
    setServs([]);
    setLoadImages([]);
  
    const inputLowercase = input.toLowerCase(); // Convert the input to lowercase
  
    try {
      const servsRef = collection(db, 'servs');
      const queryRef = query(servsRef, orderBy('name', 'asc')); // Assuming you want to order by name
      const querySnapshot = await getDocs(queryRef);
  
      const listservs: TServs[] = [];
  
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const nameLowerCase = data.name.toLowerCase(); // Convert the name to lowercase for comparison
  
        if (nameLowerCase.includes(inputLowercase)) {
          const serv: TServs = {
            id: doc.id,
            name: data.name,
            city: data.city,
            price: data.price,
            description: data.description,
            images: data.images,
            uid: data.uid
          };
  
          listservs.push(serv);
        }
      });
  
      console.log('listservs:', listservs); // Log the retrieved data
      setServs(listservs);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  

    return (

     <Container>
        <section className="bg-white p-4 rounded-lg w-full max-w-3xl mx-auto flex justify-center items-center gap-2">
          <input 
            className="w-full border-2 rounded-lg h-9 px-3"
            placeholder="Digite o nome do serviço..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button className=" bg-yellow-100 h-9 px-8 rounded-lg font-medium text-lg text-red-600" 
          onClick={handleSearchServ}>
            Buscar
          </button>
        </section>
        <h1 className="font-bold text-center mt-6 text-2xl mb-4">
          Serviços de primeira em todo Brasil
        </h1>

        <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        
        {servs.map((serv: TServs) => (
          <Link key={serv.id} to={`/serv/${serv.id}`}>
            <section className="w-full bg-white rounded-lg">
              <div
                className="w-full h-72 rounded-lg bg-slate-200"
                style={{
                  display: loadImages.includes(serv.id) ? 'none' : 'block',
                }}
              ></div>
              <img
                className="w-full rounded-lg mb-2 max-h-72 hover:scale-105 transition-all"
                src={serv.images[0].url}
                alt="servico"
                onLoad={() => handleImageLoad(serv.id)}
                style={{
                  display: loadImages.includes(serv.id) ? 'block' : 'none',
                }}
              />
              <p className="font-bold mt-1 mb-2 px-2">{serv.name} </p>
              <div className="flex flex-col px-2">
                <span className="text-zinc-700 mb-6">{serv.description}</span>
                <strong className="text-black font-medium text-xl">R$ {serv.price}</strong>
              </div>
              <div className="w-full h-px bg-slate-200 my-2"></div>
              <div className="px-2 pb-2">
                <span className="text-black ">{serv.city}</span>
              </div>
            </section>
          </Link>
        ))}


      
      </main>
      </Container>
);
}

