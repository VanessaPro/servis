import { Container } from "../../components/container";


export function Home() {
 
    return (
     <Container>
        <section className="bg-white p-4 rounded-lg w-full max-w-3xl mx-auto flex justify-center items-center gap-2">
          <input 
          className="w-full border-2 rounded-lg h-9 px-3"
          placeholder="Digite o nome do serviço..."
          
          />
          <button className=" bg-yellow-100 h-9 px-8 rounded-lg font-medium text-lg text-red-600">
            Buscar
          </button>
        </section>
        <h1 className="font-bold text-center mt-6 text-2xl mb-4">
          Serviços de primeira em todo Brasil
        </h1>

        <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

          <section className="w-full bg-white rounded-lg">
            <img className="w-full rounded-lg mb-2 max-h-72 hover:scale-105 transition-all"
               src="https://img.olx.com.br/images/22/226340193698258.webp"
               alt="montador"
             />
             <p className="font-bold mt-1 mb-2 px-2">Montador de móveis Centro São Paulo </p>
             <div className="flex flex-col px-2">
              <span className="text-zinc-700 mb-6">Montador de móveis profissional</span>
              <strong className="text-black font-medium text-xl">R$70.00</strong>
             </div>
             <div className="w-full h-px bg-slate-200 my-2"></div>
             <div className="px-2 pb-2">
              <span className="text-black ">
                São Paulo-Sp
              </span>
             </div>
          </section>
     
        </main>
     </Container>
    )
  }
  
