import React, { createContext } from "react";

export AuthContext = createContext(null);

//  2. Tạo Pro vider Component
export const AuthProvider = ({children}) => {
    const [authState,setAuthState] = useState({
        token: null,
        user: null,
        isAuthenticated : false,
        isLoading : true
    })

    useEffect(()=>{
        console.log("AuthProvider mounted, checking local Storage...");
        const storedToken = localStorage.getItem("authToken");

        if(storedToken) {
            console.log("Token found in local storage:",storedToken);
            
            setAuthState({
                token : storedToken,
                user:null,
                isAuthenticated : true,
                isLoading : false
            });

        } else {
            console.log("No token found in local storage");

            // Neu khong co token, set Trang thai chua dang nhap
            setAuthState({
                token : null,
                user: null,
                isAuthenticated : false,
                isLoading : false
            })
        }

    },[]);

    const login = (token,userData) => {
        console.log("Login function called in AuthContext");
        localStorage.setItem("authToken",token);

        setAuthState({
            // cap nhat state
            token : token,
            user : userData,
            isAuthenticated : true,
            isLoading : false
        })
    
    }
    const logout = () => {
        console.log("Logout function called in AuthContext");
        localStorage.removeItem("authToken");

        setAuthState({
            token : null,
            user : null,
            isAuthenticated : false,
            isLoading : false
        })


    };

    const value = {
        authState,
        login,
        logout
    }


    return (

        <AuthContext.Provider >
            {
                !authState.isLoading && children 
            }
        </AuthContext.Provider>
    )

}
