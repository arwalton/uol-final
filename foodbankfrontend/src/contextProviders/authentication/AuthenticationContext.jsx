import { createContext, useEffect, useState } from 'react'
import { CREATE_USER_STATUS } from '../../enums/createUserStatus'
import { setAxiosAuthToken } from '../../utils/Utils'
import { useNavigate } from 'react-router-dom'

const AuthenticationContext = createContext({
    createUserStatus: CREATE_USER_STATUS.NONE,
    usernameError: '',
    passwordError: '',
    isSubmitted: false
})

export const AuthenticationContextProvider = ({children}) => {
    const navigate = useNavigate()
    /////////////////// User creation 
    const [createUserStatus, setCreateUserStatus] = useState(CREATE_USER_STATUS.NONE)
    const [usernameError, setUsernameError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [isSubmitted, setIsSubmitted] = useState(false)

    useEffect(() => {
        switch (createUserStatus) {
            case CREATE_USER_STATUS.CREATE_USER_SUBMITTED:
                setUsernameError('')
                setPasswordError('')
                setIsSubmitted(true)
                break;
            
            case CREATE_USER_STATUS.CREATE_USER_ERROR:
                setIsSubmitted(true)
                break;

            case CREATE_USER_STATUS.CREATE_USER_SUCCESS:
                setUsernameError('')
                setPasswordError('')
                setIsSubmitted(false)
                break;

            default:
                break;
        }
    }, [createUserStatus])

    const handleCreateUserSubmitted = () => {
        setCreateUserStatus(CREATE_USER_STATUS.CREATE_USER_SUBMITTED)
    }

    const handleCreateUserError = (errorData) => {
        setCreateUserStatus(CREATE_USER_STATUS.CREATE_USER_ERROR)
        if (errorData.hasOwnProperty("username")) {
            setUsernameError(errorData["username"])
        }
        if (errorData.hasOwnProperty("password")) {
            setPasswordError(errorData["password"])
        }
    }

    const handleCreateUserSuccess = () => {
        setCreateUserStatus(CREATE_USER_STATUS.CREATE_USER_SUCCESS)
    }

    ///////////// Login
    const [currentUser, setCurrentUser] = useState({})
    const [token, setToken] = useState('')
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    const handleSetCurrentUser = (user, redirectTo) => {
        if(user){
            setCurrentUser(user)
            console.log("set user", + redirectTo)

            if(redirectTo){
                console.log("redirectTo: ", redirectTo)
                navigate(redirectTo)
            }
            navigate("/")
        }

        setAxiosAuthToken("");
    }

    const handleSetToken = (token) => {
        setToken(token)
        setIsAuthenticated(true)
        setAxiosAuthToken(token);
    }


    return (
        <AuthenticationContext.Provider value={{
            createUserStatus, 
            usernameError, 
            passwordError, 
            isSubmitted,
            handleCreateUserSubmitted,
            handleCreateUserError,
            handleCreateUserSuccess,
            currentUser,
            token,
            isAuthenticated,
            handleSetToken,
            handleSetCurrentUser

        }}>
            {children}
        </AuthenticationContext.Provider>
    )
}

export default AuthenticationContext