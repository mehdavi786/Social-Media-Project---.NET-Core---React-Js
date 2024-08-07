import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        const data = {
            email,
            password
        };

        const response = await fetch('https://localhost:7199/api/Users/Login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })

        if (!response.ok) {
            alert("Error in login.")
        }
        else {
            const userData = await response.json();
            const extractedId = userData.id;
            localStorage.setItem('userId', extractedId);
            navigate('/profile');
        }
    }


    return (
        <>
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#"><b>Pulse</b></a>
                    <div className="d-flex">
                        <Link className="nav-link mx-2" to="/register">Register</Link>
                        <Link className="nav-link mx-2" to="/login">Login</Link>
                    </div>
                </div>
            </nav>
            <div className="container vh-100 d-flex justify-content-center align-items-center">
                <div className="card shadow-sm p-4">
                    <h3 className="text-center mb-4">Login</h3>
                    <form onSubmit={ handleSubmit }>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email address</label>
                            <input required type="email" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input required type="password" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <button type="submit" className="btn btn-primary w-100">Login</button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Login;