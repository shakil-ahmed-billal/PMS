import axios from "axios"


const axiosPublic = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL,
    withCredentials: true
})
const useAxiosPublic = () => {
    return axiosPublic
}

export default useAxiosPublic