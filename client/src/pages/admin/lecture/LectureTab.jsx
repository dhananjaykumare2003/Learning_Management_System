import React, { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import axios from 'axios';
import { toast } from 'sonner';
import { Progress } from "@/components/ui/progress"
import { useEditLectureMutation, useGetLectureByIdQuery, useRemoveLectureMutation } from '@/features/api/courseApi';
import { useParams } from 'react-router-dom';

const MEDIA_API = "http://localhost:3000/api/v1/media";

const LectureTab = () => {

    const [lectureTitle, setLectureTitle] = useState("");
    const [uploadVideoInfo, setUploadvideoInfo] = useState(null);
    const [isFree, setIsFree] = useState(false);
    const [mediaProgress, setMediaProgress] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [btnDisable, setBtnDisable] = useState(true);
    const params = useParams();
    const {lectureId, courseId} = params;

    const {data : lectureData} = useGetLectureByIdQuery(lectureId);
    const lecture = lectureData?.lecture;

    useEffect(() => {
        if(lecture){
            setLectureTitle(lecture.lectureTitle);
            setIsFree(lecture.isPreviewFree);
            setUploadvideoInfo(lecture.videoInfo);
        }
    },[lecture]);

    const [editLecture, {data, isLoading, error, isSuccess}] = useEditLectureMutation();
    const [removeLecture, {data:removeData, isLoading:removeLoading, isSuccess:removeSuccess}] = useRemoveLectureMutation();

    const fileChangeHandler = async(e) => {
        const file = e.target.files[0];
        if(file){
            const formData = new FormData();
            formData.append("file", file);
            setMediaProgress(true);
            try {
                const res = await axios.post(`${MEDIA_API}/upload-video`, formData, {
                    onUploadProgress: ({loaded, total}) => {
                        setUploadProgress(Math.round((loaded*100)/total));
                    },
                });

                if(res.data.success){
                    console.log(res);
                    setUploadvideoInfo({
                        videoUrl : res.data.data.url,
                        publicId : res.data.data.public_id,
                    });
                    setBtnDisable(false);
                    toast.success(res.data.message);
                }
            } catch (error) {
                console.log(error);
                toast.error("video upload failed");
            } finally{
                setMediaProgress(false);
            }
        }
    }

    const editLectureHandler = async() => {
        console.log({lectureTitle, uploadVideoInfo, isFree, courseId, lectureId});

        await editLecture({
            lectureTitle,
            videoInfo : uploadVideoInfo,
            isPreviewFree:isFree,
            courseId,
            lectureId,
        });
    };

    const removeLectureHandler = async () => {
        await removeLecture(lectureId);
    }

    useEffect(() => {
        if(isSuccess){
            toast.success(data.message);
        }
        if(error){
            toast.error(error?.data.message || "something went wrong");
        }
    },[isSuccess, error]);

    useEffect(() => {
        if(removeSuccess){
            toast.success(removeData.message);
        }
    },[removeSuccess]);

  return (
    <Card>
        <CardHeader className={"flex justify-between"}>
            <div>
                <CardTitle>Edit Lecture</CardTitle>
                <CardDescription>
                    Make changes and click save when done.
                </CardDescription>
            </div>
            <div className='flex items-center gap-2'>
                <Button disabled={removeLoading} variant={"destructive"} onClick={removeLectureHandler}>
                    {
                        removeLoading ? <>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin'></Loader2>
                        Please Wait
                        </> : "Remove Lecture"
                    }
                </Button>
            </div>
        </CardHeader>
        <CardContent>  
            <div>
                <Label>Title</Label>
                <Input
                    type={"text"}
                    value={lectureTitle}
                    onChange={(e) => setLectureTitle(e.target.value)}
                    placeholder="Ex. Introduction to Javascript"
                ></Input>
            </div> 
            <div className="my-5">
                <Label>
                    Video <span className="text-red-500">*</span>
                </Label>
                <Input
                    type="file"
                    accept="video/*"
                    onChange={fileChangeHandler}
                    placeholder="Ex. Introduction to Javascript"
                    className="w-fit"
                />
            </div>
            <div className='flex items-center space-x-2 my-5'>
                <Switch checked={isFree} onCheckedChange={setIsFree} id="airplane-mode"></Switch>
                <Label htmlFor="airplane-mode">Is this video FREE</Label>
            </div>

            {
                mediaProgress && (
                    <div>
                        <Progress value={uploadProgress}></Progress>
                        <p>{uploadProgress}% uploaded</p>
                    </div>
                )
            }

            <div className='mt-4'>
                <Button disabled={isLoading} onClick={editLectureHandler}>
                    {
                        isLoading ? <>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin'></Loader2>
                        Please Wait
                        </> : "Update Lecture"
                    }
                </Button>
            </div>
        </CardContent>
    </Card>
  );
}

export default LectureTab