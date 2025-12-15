import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const RegisterPage = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '', // <--- NEW FIELD
        email: '',
        username: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        const { firstName, lastName, phone, email, username, password, confirmPassword } = formData;

        if (!firstName || !lastName || !phone || !email || !username || !password) {
            alert("Please fill in all fields.");
            return false;
        }
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return false;
        }
        // Simple Phone Validation
        if (phone.length < 10 || isNaN(phone.replace('+', ''))) {
            alert("Please enter a valid phone number.");
            return false;
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            alert("Password must be 8+ chars, include Upper, Lower, Number, and Symbol.");
            return false;
        }
        return true;
    };

    const handleRegister = (e) => {
        e.preventDefault();
        if (validateForm()) {
            const userToSave = {
                name: `${formData.firstName} ${formData.lastName}`,
                phone: formData.phone, // <--- SAVING PHONE
                email: formData.email,
                username: formData.username,
                password: formData.password,
                profilePic: null // Placeholder for image
            };
            localStorage.setItem("registeredUser", JSON.stringify(userToSave));
            alert("Registration Successful! Please Login now.");
            navigate('/login');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 py-10">
            <div className="bg-white p-8 rounded-lg shadow-md w-[500px]">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Create Account</h2>
                <form className="space-y-4" onSubmit={handleRegister}>
                    <div className="flex gap-4">
                        <input name="firstName" placeholder="First Name" className="w-1/2 p-2 border rounded" onChange={handleChange} />
                        <input name="lastName" placeholder="Last Name" className="w-1/2 p-2 border rounded" onChange={handleChange} />
                    </div>
                    {/* NEW PHONE INPUT */}
                    <input name="phone" type="tel" placeholder="Phone Number" className="w-full p-2 border rounded" onChange={handleChange} />
                    <input name="email" type="email" placeholder="Email" className="w-full p-2 border rounded" onChange={handleChange} />
                    <input name="username" type="text" placeholder="Username" className="w-full p-2 border rounded" onChange={handleChange} />
                    <input name="password" type="password" placeholder="Password (Min 8 chars, 1 Upper...)" className="w-full p-2 border rounded" onChange={handleChange} />
                    <input name="confirmPassword" type="password" placeholder="Confirm Password" className="w-full p-2 border rounded" onChange={handleChange} />

                    <button type="submit" className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 transition mt-4">Register</button>
                </form>
                <p className="mt-4 text-center text-sm text-gray-600">
                    Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;