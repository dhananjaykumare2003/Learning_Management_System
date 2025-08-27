import Login from "./pages/Login";
import './App.css';
import Navbar from "./components/navbar";
import HeroSection from "./pages/student/HeroSection";
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import { RouterProvider } from "react-router";
import Courses from "./pages/student/Courses";
import MyLearning from "./pages/student/MyLearning";
import Profile from "./pages/student/Profile";
import Sidebar from "./pages/admin/Sidebar";
import Dashboard from "./pages/admin/Dashboard"
import CourseTable from "./pages/admin/course/CourseTable";
import CreateCourse from "./pages/admin/course/CreateCourse";
import EditCourse from "./pages/admin/course/EditCourse";
import CreateLecture from "./pages/admin/lecture/CreateLecture";
import EditLecture from "./pages/admin/lecture/EditLecture";
import CourseDetail from "./pages/student/CourseDetail";
import CourseProgress from "./pages/student/CourseProgress";
import SearchPage from "./pages/student/SearchPage";
import { AdminRoute, AuthenticatedUser, ProtectedRoute } from "./components/ProtectedRoutes";
import PurchaseCourseProtectedRoute from "./components/PurchaseCourseProtectedRoute";
import { ThemeProvider } from "./components/ThemeProvider";


const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children:[
      {
        path: "/",
        element:(
          <>
            <HeroSection></HeroSection>
            <Courses></Courses>
          </>
        )
      },
      {
        path: "login",
        element:<AuthenticatedUser>
          <Login />
        </AuthenticatedUser> 
      },
      {
        path: "my-learning",
        element :<ProtectedRoute>
          <MyLearning/>
        </ProtectedRoute> 
      },
      {
        path: "profile",
        element:<ProtectedRoute>
          <Profile/>
        </ProtectedRoute> 
      },
      {
        path: "course/search",
        element:<ProtectedRoute>
          <SearchPage />
        </ProtectedRoute> 
      },
      {
        path: "course-detail/:courseId",
        element:<ProtectedRoute>
          <CourseDetail></CourseDetail>
        </ProtectedRoute> 
      },
      {
        path: "course-progress/:courseId",
        element:<ProtectedRoute>
          <PurchaseCourseProtectedRoute>
            <CourseProgress></CourseProgress>
          </PurchaseCourseProtectedRoute>
        </ProtectedRoute> 
      },

      // Admin routes start from here
      {
        path:"admin",
        element:<AdminRoute>
          <Sidebar></Sidebar>,
        </AdminRoute> ,
        children:[
          {
            path:"dashboard",
            element: <Dashboard></Dashboard>
          },
          {
            path: "course",
            element : <CourseTable/>
          },
          {
            path: "course/create",
            element : <CreateCourse></CreateCourse>
          },
          {
            path: "course/:courseId",
            element: <EditCourse/>
          },
          {
            path: "course/:courseId/lecture",
            element: <CreateLecture/>
          },
          {
            path: "course/:courseId/lecture/:lectureId",
            element: <EditLecture></EditLecture>
          }
        ]
      }
    ]
  }
])

function App() {
  return (
    <div>
      <ThemeProvider>
        <RouterProvider router={appRouter}></RouterProvider>
      </ThemeProvider>
    </div>
  )
}
 
export default App