import { CourseProgress } from "../models/courseProgress.model.js";
import { Course }from "../models/course.model.js"

export const getCourseProgress = async(req, res) => {
    try {
        const {courseId} = req.params;
        const userId = req.id;

        //step-1 fetch the user course progress
        let courseProgress = await CourseProgress.findOne({userId, courseId}).populate("courseId");

        const courseDetails = await Course.findById(courseId).populate("lectures");

        if(!courseDetails){
            return res.status(404).json({
                message : "Course not found"
            });
        }

        // step-2 if no progress found, return course details with an empty progress
        if(!courseProgress){
            return res.status(200).json({
                data : {
                    courseDetails,
                    progress : [],
                    completed : false,
                }
            });
        }

        // step-3 Return the user's course progress along with course details
        return res.status(200).json({
            data : {
                courseDetails,
                progress : courseProgress.lectureProgress,
                completed : courseProgress.completed,
            }
        })
    } catch (error) {
        console.log(error);
    }
}

export const updateLectureProgress = async(req,res) => {
    try{
        const{lectureId, courseId} = req.params;
        const userId = req.id;

        // fetch or create course progress
        let courseProgress = await CourseProgress.findOne({courseId, userId});
        
        if(!courseProgress){
            // If no progress exist, create a new record
            courseProgress = new CourseProgress({
                userId,
                courseId,
                lectureProgress: [],
                completed: false,
            });
        }

        // find the lecture progress in the course progress
        const lectureIndex = courseProgress.lectureProgress.findIndex((lecture) => lecture.lectureId === lectureId);

        if(lectureIndex !== -1){
            // if lecture already exist, update its status
            courseProgress.lectureProgress[lectureIndex].viewed = true;
        }else{
            // Add new lecture progress
            courseProgress.lectureProgress.push({
                lectureId,
                viewed : true,
            });
        }

        // if all lecture is complete
        const lectureProgressLength = courseProgress.lectureProgress.filter((lectureProg) => lectureProg.viewed === true).length;

        const course = await Course.findById(courseId);

        if(course.lectures.length === lectureProgressLength){
            courseProgress.completed = true;
        }

        await courseProgress.save();

        return res.status(200).json({
            message : "Lecture progress updated successfully.",
        });

    }catch(error){
        console.log(error);
        return res.status(500).json({
            message: "Failed to update lecture progress",
        })
    }
}

export const markAsCompleted = async(req,res) => {
    try {
        const {courseId} = req.params;
        const userId = req.id;

        const courseProgress = await CourseProgress.findOne({courseId, userId});
        if(!courseProgress){
            return res.status(401).json({message : "Course progress not found"});
        }

        courseProgress.lectureProgress.forEach((lectureProg) => lectureProg.viewed = true);
        courseProgress.completed = true;
        await courseProgress.save();

        return res.status(200).json({ message : "Course marked as completed."});
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to mark as completed",
        })
    }
}

export const markAsInCompleted = async(req,res) => {
    try {
        const {courseId} = req.params;
        const userId = req.id;

        const courseProgress = await CourseProgress.findOne({courseId, userId});
        if(!courseProgress){
            return res.status(401).json({message : "Course progress not found"});
        }

        courseProgress.lectureProgress.map((lectureProg) => lectureProg.viewed = false);
        courseProgress.completed = false;
        await courseProgress.save();

        return res.status(200).json({ message : "Course marked as incompleted."});
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to mark as incompleted",
        })
    }
}