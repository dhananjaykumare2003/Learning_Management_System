import React, { useEffect, useState } from 'react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Dialog, DialogHeader, DialogContent, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'
import Course from './Course'
import { useLoadUserQuery, useUpdateUserMutation } from '@/features/api/authApi'
import { toast } from 'sonner'

const Profile = () => {

    const [name, setName] = useState("");
    const [profilePhoto, setProfilePhoto] = useState("");

    const {data, isLoading, refetch} = useLoadUserQuery();
    const [updateUser, {data:updateUserData, error : updateUserError, isLoading: updateUserIsLoading, isSuccess: updateUserIsSuccess, isError}] = useUpdateUserMutation();

    const onChangeHandler = (e) => {
        const file = e.target.files?.[0];
        if(file) setProfilePhoto(file);
    }


     const user = data?.user;


    const updateUserHandler = async() => {
        const formData = new FormData();
        formData.append("name",name);
        formData.append("profilePhoto", profilePhoto);
        await updateUser(formData);
    }

    useEffect(() => {
        refetch();
    },[]);

    useEffect(() => {
        if(updateUserIsSuccess){
            refetch();
            toast.success(updateUserData?.message || "Profile Updated!");
        }
        if(isError){
            toast.error(updateUserError.message || "Failed to update profile!")
        }
        
    },[updateUserData,  updateUserIsSuccess, isError, updateUserError]);


  return (
    <div className='max-w-4xl mx-auto px-4 my-20'>
        {
            isLoading ? (
            <h1>Profile Loading...</h1>  ):(
                <>
                     <h1 className='font-bold text-2xl text-center md:text-left'>PROFILE</h1>
                        <div className='flex flex-col md:flex-row items-center md:items-start gap-8 my-5'>
                            <div className='flex flex-col items-center'>
                                <Avatar className="h-24 w-24 md:h-32 md:w-32 mb-4 rounded-full">
                                    <AvatarImage src={user?.photoUrl || "https://github.com/shadcn.png"} alt='@shadcn' className='rounded-full'/>
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                            </div>
                            <div>
                                <div>
                                    <h1 className='font-semibold text-gray-900 dark:text-gray-100'>
                                        Name: 
                                        <span className='font-normal text-gray-700 dark:text-gray-300 ml-2'> {user.name}</span>
                                    </h1>
                                </div>
                                <div>
                                    <h1 className='font-semibold text-gray-900 dark:text-gray-100'>
                                        Email: 
                                        <span className='font-normal text-gray-700 dark:text-gray-300 ml-2'> {user.email}</span>
                                    </h1>
                                </div>
                                <div>
                                    <h1 className='font-semibold text-gray-900 dark:text-gray-100'>
                                        Role: 
                                        <span className='font-normal text-gray-700 dark:text-gray-300 ml-2 uppercase'> {user.role}</span>
                                    </h1>
                                </div>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button size={'sm'} className='mt-2'>Edit Profile</Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Edit Profile</DialogTitle>
                                            <DialogDescription>
                                                Make changes to your profile here. Click save when you're done.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className='grid gap-4 py-4'>
                                            <div className='grid grid-cols-4 items-center gap-4'>
                                                <Label>Name</Label>
                                                <Input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)}  className={'col-span-3'}></Input>
                                            </div>
                                            <div className='grid grid-cols-4 items-center gap-4'>
                                                <Label>Profile Picture</Label>
                                                <Input type="file" accept="image/*" onChange={(e) => onChangeHandler(e)} className={'col-span-3'}></Input>
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button disabled={updateUserIsLoading} onClick={updateUserHandler}>
                                                {
                                                    updateUserIsLoading ?
                                                    (
                                                        <>
                                                            <Loader2 className='mr-2 h-4 w-4 animate-spin'/>Please Wait
                                                        </>
                                                    ) : "Save Changes"
                                                }
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                        <div>
                            <h1 className='font-medium text-lg'>Courses you're enrolled in</h1>
                            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-5'>
                                {
                                    user.enrolledCourses.length === 0 ? 
                                    (<h1>You haven't enrolled yet</h1>):
                                    (
                                        user.enrolledCourses.map((course,index) => <Course key={course._id} course={course}/>)
                                    )  
                                }
                            </div>
                        </div>
                </>
            )
        }
       
    </div>
  )
}

export default Profile