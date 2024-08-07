import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';

function Register() {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [image, setImage] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();


        if (password !== confirmPassword) {
            alert("Passwords do not match!")
            return;
        }

        if (password.length < 6 || password.length > 32) {
            alert("Password length must be in between 6 and 32 characters.");
            return;
        }

        const data = {
            name,
            email,
            password,
            image
        };

        
        const response = await fetch('https://localhost:7199/api/Users/Register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            alert("Error while creating user.")
        }
        else {
            alert("User registered Successfully.");
            navigate('/login');
            
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
                    <h3 className="text-center mb-4">Register</h3>
                    <form method='post' onSubmit={ handleSubmit }>
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">Name</label>
                            <input required type="text" className="form-control" id="name" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email address</label>
                            <input required type="email" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="image" className="form-label">Profile Picture</label>
                            <input type="text" className="form-control" id="image" value={image} onChange={(e) => setImage(e.target.value)} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input required type="password" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="confirm-password" className="form-label">Confirm Password</label>
                            <input required type="password" className="form-control" id="confirm-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                        </div>

                        <button type="submit" className="btn btn-primary w-100">Register</button>
                    </form>
                </div>
            </div>
        </>
    );

    
    
}

export default Register;