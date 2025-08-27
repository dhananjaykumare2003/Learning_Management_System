import React from 'react'
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import Course from './Course';
import { useLoadUserQuery } from '@/features/api/authApi';

const MyLearning = () => {
    const {data, isLoading} = useLoadUserQuery();
    const myLearningCourses = data?.user.enrolledCourses || [];
  return (
    <div className='max-w-4xl mx-auto my-24 px-4 md:px-0'>
        <h1 className='font-bold text-2xl'>MY LEARNING</h1>
        <div className='my-5'>
            {
                isLoading ?
                <MyLearningSkeleton/> : 
                (
                    myLearningCourses.length === 0 ?
                    (<p>You have not enrolled in any courses.</p>) :
                    (
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                            {
                                myLearningCourses.map((course,index) => <Course key={index} course={course}/>)
                            }
                        </div>
                        
                    )
                )
            }
        </div>
    </div>
  )
}

export default MyLearning;

const MyLearningSkeleton = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 3 }).map((_, index) => (
        <Card key={index} className="overflow-hidden rounded-lg shadow-lg">
          <div className="relative">
            <Skeleton className="w-full h-36" />
          </div>
          <CardContent className="px-5 py-4 space-y-3">
            <Skeleton className="h-5 w-3/4" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-4 w-14 rounded-full" />
            </div>
            <Skeleton className="h-5 w-16" />
          </CardContent>
        </Card>
      ))}
    </div>
    );
}