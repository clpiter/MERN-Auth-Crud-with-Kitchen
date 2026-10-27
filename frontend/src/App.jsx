import {Routes, Route, Navigate} from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectUser } from './store/authSlice'
import Header from './pages/header/Header'
import Signup from './pages/auth/signup/Signup'
import Login from './pages/auth/login/Login'
import Dashboard from './pages/dashboard/Dashboard'
import ItemDetail from './pages/items/ItemDetail'
import ItemForm from './pages/items/ItemForm'
import Sessions from './pages/sessions/Sessions'
import ProtectedRoute from './components/ProtectedRoute'
import './App.css'

export default function App() {
  const user = useSelector(selectUser);
  return (
    <>
      <Header/>
      <Routes>
        <Route path ="/" element={<Navigate to={user ? "/dashboard" : "/login"} replace/>}></Route>
        <Route path ="/login" element={user ? <Navigate to="/dashboard" replace/> : <Login/>}></Route>
        <Route path ="/register" element={user ? <Navigate to="/dashboard" replace/> : <Signup/>}></Route>
        <Route path ="/dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>}></Route>
        <Route path ="/items/new" element={<ProtectedRoute><ItemForm/></ProtectedRoute>}></Route>
        <Route path ="/items/:id" element={<ProtectedRoute><ItemDetail/></ProtectedRoute>}></Route>
        <Route path ="/items/:id/edit" element={<ProtectedRoute><ItemForm/></ProtectedRoute>}></Route>
        <Route path ="/sessions" element={<ProtectedRoute><Sessions/></ProtectedRoute>}></Route>
        <Route path ="*" element={<Navigate to="/" replace/>}></Route>
      </Routes>
    </>
  )
}
