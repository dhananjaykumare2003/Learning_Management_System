
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userLoggedIn, userLoggedOut } from "../authSlice";
import { LogOut } from "lucide-react";

const USER_API = `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/`;

export const authApi = createApi({
    reducerPath:"authApi",
    baseQuery: fetchBaseQuery({
        baseUrl: USER_API,
        credentials: 'include'
    }),
    endpoints: (builder) => ({
        registerUser: builder.mutation({
            query:(inputData) => ({
                url:"signup",
                method: "POST",
                body:inputData
            })
        }),
        loginUser: builder.mutation({
            query:(inputData) => ({
                url:"login",
                method: "POST",
                body:inputData
            }), 
            async onQueryStarted(arg, {queryFulfilled, dispatch}){
                try{
                    const result = await queryFulfilled;
                    if (result?.data?.user) {
                        dispatch(userLoggedIn({ user: result.data.user }));
                    } else {
                        console.error("User not found in response:", result?.data);
                    }
                }catch(error){
                    console.log(error);
                }
            }
        }),
        logOutUser : builder.mutation({
            query:()=> ({
                url: "logout",
                method:"POST",
            }),
            async onQueryStarted(_, {queryFulfilled, dispatch}){
                try {
                    dispatch(userLoggedOut());
                } catch (error) {
                    console.log(error);
                }
            }
        }),
        loadUser : builder.query({
            query:() => ({
                url : "profile",
                method : "GET"
            }),
            async onQueryStarted(arg, {queryFulfilled, dispatch}){
                try{
                    const result = await queryFulfilled;
                    dispatch(userLoggedIn({ user: result.data.user }));
                }catch(error){
                    console.log(error);
                }
            }
        }),
        updateUser: builder.mutation({
            query:(formData) => ({
                url: "profile/update",
                method : "PUT",
                body : formData,
                credentials : "include"
            })
        })
    })
});


export const {useRegisterUserMutation, useLoginUserMutation, useLogOutUserMutation,useLoadUserQuery, useUpdateUserMutation} = authApi;