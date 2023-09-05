import {Link} from 'react-router-dom'
import {signOut} from 'firebase/auth'
import {auth} from '../../services/firebaseConecction'

export function DashboardHeader(){

    async function handleLogout (){
        await signOut(auth);
        
    }


    return(
        <div className='w-full items-center flex h-10 bg-yellow-100 rounded-lg text-red-950 font-medium gap-4 px-4 mb-4'>
            <Link to="/dashboard">
               Dashboard
            </Link>

            <Link to="/dashboard/new">
               Cadastrar serviço
            </Link>

            <button className='ml-auto' onClick={handleLogout}>Sair da conta</button>
        </div>
    )
}