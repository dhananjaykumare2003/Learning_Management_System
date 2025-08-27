import React, { useEffect } from 'react'
import DarkMode from '@/DarkMode';
import { School } from 'lucide-react';
import { Button } from './ui/button';
import { Menu } from 'lucide-react';
import { Separator } from './ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet"

import { Link, useNavigate } from 'react-router-dom';
import {  useLogOutUserMutation } from '@/features/api/authApi';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';


const Navbar = () => {
    const user = useSelector(store => store.auth.user);
    const navigate = useNavigate();
    const [logOutUser, {data:loggedOutData, error, isLoading, isSuccess: loggedOutIsSuccess,isError}] = useLogOutUserMutation();

    const logOutHandler = async() => {
        await logOutUser();
    }
    useEffect(()=>{
        if(loggedOutIsSuccess){
            toast.success(loggedOutData.message || "User Logged Out successfully.");
            navigate("login");
        }
        if(isError){
            toast.error(error.message || "Failed to Log out.");
        }
    },[loggedOutIsSuccess,loggedOutData])

  return (
    <div className='h-16 dark:bg-[#0A0A0A] bg-white border-b dark:border-b-gray-800 border-b-gray-200 fixed top-0 left-0 right-0 duration-300 z-10' >
        {/* Desktop */}
        <div className='max-w-7xl mx-auto hidden md:flex justify-between items-center gap-10 h-full'>
            <div className='flex gap-2'>
                <School size={30}></School>
                <Link to={"/"}>
                    <h1 className='hidden md:block font-extrabold text-2xl'>E-learning</h1>
                </Link>
            </div>
            {/* User icons and dart mode icon */}
            <div className='flex items-center gap-8'>
                {
                    user ? 
                    (
                        <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Avatar>
                                <AvatarImage src={user?.photoUrl || "https://github.com/shadcn.png"} />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="start">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuGroup>
                            <DropdownMenuItem>
                                <Link to="my-learning">My learning</Link>  
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Link to="profile">Edit Profile </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                               <div onClick={logOutHandler}> Log out</div>
                            </DropdownMenuItem>
                            </DropdownMenuGroup>
                            {
                                user?.role === "Instructor" && (
                                    <>
                                        <DropdownMenuItem>
                                            <Link to={"/admin/dashboard"}>Dashboard</Link>
                                        </DropdownMenuItem>
                                    </>
                                )
                            }
                            
                        </DropdownMenuContent>
                        </DropdownMenu>
                    ) : 
                    (
                        <div className='flex items-center gap-2'>
                            <Button variant="outline" onClick={()=> navigate("login")}>Login</Button>
                            <Button onClick={()=> navigate("login")}>Signup</Button>
                        </div>
                    )
                }
                <DarkMode/>
            </div>
        </div>
        {/* Mobile Device */}
        <div className='flex md:hidden items-center justify-between p-4 h-full'>
            <h1 className='text-2xl font-extrabold'>E-Learning</h1>
            <MobileNavbar user={user}/>
        </div>
    </div>
  )
}

const MobileNavbar = ({user}) => {
    const navigate = useNavigate();
    return (
        <Sheet>
  <SheetTrigger asChild>
    <Button size='icon' className='rounded-full bg-gray-200 hover:bg-gray-200 p-2 text-black'>
        <Menu></Menu>
    </Button>
  </SheetTrigger>
  <SheetContent className="p-4">
    <SheetHeader className="flex flex-row items-center justify-between pt-2">
      <SheetTitle className="font-extrabold text-2xl"><Link to={`/`}>E-Learning</Link></SheetTitle>
      <DarkMode></DarkMode>
      
    </SheetHeader>
    <Separator className='mr-2'></Separator>
    <nav className='flex flex-col space-y-4 px-2 text-xl '>
        <Link to={'/my-learning'}>My Learning</Link>
        <Link to={'/profile'}>Edit Profile</Link>
        <Link to={'/logout'}>Log out</Link>
    </nav>
    <nav>
        {
            user?.role === "Instructor" && (
                <div className='pt-4'>
                    <SheetClose asChild>
                    <Button type="submit" onClick={()=> navigate(`/admin/dashboard`)} className="w-full mr-2 ml-2 text-md font-bold">Dashboard</Button>
                    </SheetClose>
                </div>
            )
        }
    </nav>
    
        
  </SheetContent>
</Sheet>
    )
}

export default Navbar;