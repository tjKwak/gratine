import React, { useState } from "react";
import { getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword } from "firebase/auth";

const AuthForm = () => {
    const auth = getAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newAccount, setNewAccount] = useState(true);
    const [error, setError] = useState("");

    //로그인 기능
    const onChange = (event) => {
        const {
            target: {name, value}
        } = event;
        if(name ==="email"){
            setEmail(value);
        }
        else if (name === "password"){
            setPassword(value);
        }
    };

    const onSubmit = async(event) => {
        event.preventDefault();
        try{
            let data;
            if(newAccount){
                //create account
                // data = await auth.createUserWithEmailAndPassword(
                //     email, password
                // )
                data = await createUserWithEmailAndPassword(
                    auth, email, password
                )
            }
            else{
                //log in
                data = await signInWithEmailAndPassword(
                    auth, email, password
                )
            }
            console.log(data)
        }
        catch(error){
            setError(error.message);
        }
    }

    const toggleAccount = () => setNewAccount((prev) => !prev);
    
    return (
        <div>
            <form onSubmit={onSubmit}>
                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    required
                    value={email}
                    onChange={onChange}
                />
                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    required
                    value={password}
                    onChange={onChange}
                />
                <input
                    type="submit"
                    value={newAccount ? "Create Account" : "Log In"}
                />
                {error}
            </form>
            <span onClick={toggleAccount}>{newAccount ? "Log in" : "Create Account"}</span>
        </div>
    );
};

export default AuthForm;