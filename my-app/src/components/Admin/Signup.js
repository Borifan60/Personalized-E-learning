import Swal from 'sweetalert2';
import React, { useState } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';

function Signup() {
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post(
                'http://localhost:8080/userInfo/Signup',
                { firstname, lastname, email, password },
                { headers: { 'Content-Type': 'application/json' } }
            );

            // ⭐ SweetAlert Success Message
            Swal.fire({
                title: "Success!",
                text: "User added successfully!",
                icon: "success",
                confirmButtonColor: "#3085d6",
            });

            // Clear form
            setFirstname('');
            setLastname('');
            setEmail('');
            setPassword('');

        } catch (error) {
            // ❗ SweetAlert Error Message
            Swal.fire({
                title: "Error!",
                text: "Signup failed. Try again.",
                icon: "error",
                confirmButtonColor: "#d33",
            });
        }
    };

    return (
        <>
        <div className="main-content">

            <Sidebar />
            <div className="content">
        <form onSubmit={handleSubmit}>
            <h4>Registration Form</h4>

            <div>
                <label htmlFor="firstname">Firstname:</label>
                <input
                    className="form-control"
                    type="text"
                    id="firstname"
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                    required
                />
            </div>

            <div>
                <label htmlFor="lastname">Lastname:</label>
                <input
                    className="form-control"
                    type="text"
                    id="lastname"
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                    required
                />
            </div>

            <div>
                <label htmlFor="email">Email:</label>
                <input
                    className="form-control"
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>

            <div>
                <label htmlFor="password">Password:</label>
                <input
                    className="form-control"
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>

            <button type="submit" className="btn btn-primary">Sign Up</button>
            
        </form>
        </div>
        </div>
        </>
    );
}

export default Signup;
