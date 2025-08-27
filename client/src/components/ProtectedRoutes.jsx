
import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom";


export const ProtectedRoute = ({children}) => {
    const {isAuthenticated} = useSelector(store=>store.auth);

    if(!isAuthenticated){
        return <Navigate to="/login"></Navigate>
    }

    return children;
}


export const AuthenticatedUser = ({children}) => {
    const {isAuthenticated} = useSelector(store=>store.auth);

    if(isAuthenticated){
        return <Navigate to="/"></Navigate>
    }

    return children;
}

export const AdminRoute = ({children}) => {
    const {user, isAuthenticated} = useSelector(store=>store.auth);

    if(!isAuthenticated){
        return <Navigate to={"/login/"} />
    }

    if(user?.role !== "Instructor"){
        return <Navigate to={"/"} />
    }

    return children;
}