import { AppWindowIcon, CodeIcon, Loader2 } from "lucide-react"
// Password :MbvBcIr8omV6JSB5
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { useEffect, useState } from "react"
import { useLoginUserMutation, useRegisterUserMutation } from "@/features/api/authApi"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"


const Login = () => {
    const [signupInput, setSignupInput] = useState({name:"", email:"", password:""});
    const [loginInput, setLoginInput] = useState({email:"", password:"" });

    const [registerUser, {data:registerData, error: registerError, isLoading: registerIsLoading, isSuccess: registerIsSuccess}] = useRegisterUserMutation();
    const [loginUser,{data : loginData, error : loginError, isLoading : loginIsLoading, isSuccess : loginIsSuccess}] = useLoginUserMutation();

    const navigate = useNavigate();

    const changeInputHandler = (event,type) => {
        const {name, value} = event.target;
        if(type === "signup"){
            setSignupInput((prev) => {
                return {
                    ...prev,
                    [name] :value,
                };
            });
        }else{
            setLoginInput((prev) => {
                return {
                    ...prev,
                    [name] :value,
                };
            });
        }
        
    }

    const handleRegistration = async(type) => {
        const inputData = (type === "signup") ? signupInput : loginInput;
        const action = type === "signup" ? registerUser : loginUser;
        await action(inputData);
    }

    useEffect(() =>{
        if(registerIsSuccess && registerData){
            toast.success(registerData.message || "Signup successful.")
        }
        if(registerError){
            toast.error(registerError.data.message || "Signup Failed.");
        }
        if(loginIsSuccess && loginData){
            toast.success(loginData.message || "Login successful.");
            navigate('/');
        }
        if(loginError){
            toast.error(loginError.data.message || "Login Failed.");
        }
    }, [loginIsLoading, registerIsLoading, loginData, registerData, loginError, registerError])

    return (
        <div className="flex justify-center items-center mt-20">
            <div className="flex w-full max-w-sm flex-col gap-6">
                <Tabs defaultValue="login">
                    <TabsList>
                        <TabsTrigger value="signup">Signup</TabsTrigger>
                        <TabsTrigger value="login">Login</TabsTrigger>
                    </TabsList>
                    <TabsContent value="signup">
                        <Card>
                            <CardHeader>
                                <CardTitle>Signup</CardTitle>
                                <CardDescription>
                                    Create a new account and click signup when you're done.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-6">
                                <div className="grid gap-3">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                    name="name" 
                                    value={signupInput.name}
                                    type="text"
                                    placeholder="Eg. kumare" 
                                    required 
                                    onChange={(e) => changeInputHandler(e,"signup")}
                                    />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="email">Email</Label>
                                    <Input 
                                    type="email" 
                                    name="email"
                                    value={signupInput.email} 
                                    placeholder="Eg. kumare@gmail.com" 
                                    onChange={(e) => changeInputHandler(e,"signup")}
                                    required />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="password">Password</Label>
                                    <Input 
                                    type="password" 
                                    name="password" 
                                    value={signupInput.password}
                                    placeholder="Eg. 123*" 
                                    onChange={(e) => changeInputHandler(e,"signup")}
                                    required />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button disabled={registerIsLoading} onClick={() => handleRegistration("signup")} >
                                    {
                                        registerIsLoading ? (<Loader2 className="mr-2 h-4 w-4 animate-spin">Please wait</Loader2>) : "signup"
                                    }
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                    <TabsContent value="login">
                        <Card>
                            <CardHeader>
                                <CardTitle>Login</CardTitle>
                                <CardDescription>
                                    Login your password here. After signup, you'll be logged in.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-6">
                                <div className="grid gap-3">
                                    <Label htmlFor="current">Email</Label>
                                    <Input 
                                    type="email" 
                                    name="email" 
                                    value={loginInput.email}
                                    placeholder="Eg. kumare@gmail.com" 
                                    onChange={(e) => changeInputHandler(e,"login")}
                                    required />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="new">Password</Label>
                                    <Input 
                                    type="password" 
                                    name="password" 
                                    value={loginInput.password}
                                    placeholder="Eg. 123*" 
                                    onChange={(e) => changeInputHandler(e,"login")}
                                    required />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button disabled={loginIsLoading} onClick={() => handleRegistration("login")} >
                                    {
                                        loginIsLoading ? (<Loader2 className="mr-2 h-4 w-4 animate-spin">Please wait</Loader2>) : "Login"
                                    }
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>

    )
}

export default Login
