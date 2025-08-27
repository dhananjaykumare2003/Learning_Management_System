import React from 'react'
import { Skeleton } from "@/components/ui/skeleton"
import Course from './Course';
import { useGetPublishedCourseQuery } from '@/features/api/courseApi';

const Courses = () => {
    const {data, isLoading, isSuccess, isError} = useGetPublishedCourseQuery();
    console.log(data);
    if(isError) return <h1>Some error occured while fetching courses.</h1>
  return (
    <div className='bg-gray-50 dark:bg-[#141414]'>
        <div className='max-w-7xl mx-auto p-6'>
            <h2 className='font-bold text-center text-3xl mb-10'>Our Courses</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                {
                    isLoading ? 
                    Array.from({length:8}).map(( _ , index) => ( <CourseSkeleton key={index}></CourseSkeleton>))
                    : (
                        data?.courses && data?.courses.map((course, index) => <Course key={index} course={course}></Course>)
                    )
                }
            </div>
            
        </div>
    </div>
  )
}

export default Courses;

const CourseSkeleton = () => {
    return (
        <div className='bg-white shadow-md hover:shadow-lg transition-shadow rounded-lg overflow-hidden'>
            <Skeleton className="w-full h-36"></Skeleton>
            <div className='px-5 py-4 space-y-3'>
                <Skeleton className="h-6 w-3/4"></Skeleton>
                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                        <Skeleton className={"h-6 w-6 rounded-full"}></Skeleton>
                        <Skeleton className={"h-4 w-20"}></Skeleton>
                    </div>
                    <Skeleton className={"h-4 w-16"}></Skeleton>
                </div>
                <Skeleton className={"h-4 w-1/4"}></Skeleton>
            </div>
        </div>
    )
}