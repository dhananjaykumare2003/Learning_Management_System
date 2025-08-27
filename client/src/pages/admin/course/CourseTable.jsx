import React, { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Edit} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useGetCreatorCourseQuery } from '@/features/api/courseApi'

const CourseTable = () => {
  
  const navigate = useNavigate();

  const {data, isLoading} = useGetCreatorCourseQuery();
  
  if(isLoading) return <h1>Loading ...</h1>

  const courses = data.courses;

  return (
    <div>
      <Button onClick={() => navigate(`create`)}>Create a new Course</Button>
      <Table>
        <TableCaption>A list of your recent courses.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Title</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.map((course) => (
            <TableRow key={course._id}>
              <TableCell className="font-medium">{course?.coursePrice || "NA"}</TableCell>
              <TableCell><Badge>{course?.isPublished ? "Published" : "Draft"}</Badge></TableCell>
              <TableCell>{course?.courseTitle}</TableCell>
              <TableCell className="text-right"><Button size={"sm"} variant='ghost' onClick={() => navigate(`${course._id}`)}><Edit></Edit></Button></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default CourseTable