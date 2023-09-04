import {useContext} from 'react'
import {AuthContext} from '../../contexts/AuthContext'
import  logoImg from '../../assets/logo.jpg'
import { Link } from 'react-router-dom';
import {FiUser, FiLogIn} from 'react-icons/fi'


export function Header(){
   const {signed, loadinAuth} = useContext(AuthContext);

    return(
        <div className='w-full flex items-center justify-center h-15 bg-yellow-100 drop-shadow mb-4'>
             <header className='flex w-full max-w-7xl items-center justify-between px-4 mx-auto'>
                <Link to = "/">
                    <img 
                       src={logoImg}  
                       alt='Logo do site'
                    />
                
                </Link>

              {!loadinAuth && signed && (
                  <Link to="/dashboard">
                    <div className='border-2 rounded-full p-1 border-gray-900'>
                    <FiUser size={24} color="#000"/>
                    </div>
              
                  </Link>
              
               )}  

                {!loadinAuth && !signed && (
                <Link to="/login">
                  <FiLogIn size={24} color="#000"/>
            
                </Link>
              )}  
             </header>
            
        </div>
    )
}