import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Eye, EyeOff, MapPin } from 'lucide-react';
import TermsModal from '../../components/Common/TermsModal';
import PrivacyModal from '../../components/Common/PrivacyModal';

const RegisterPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        username: '',
        password: '',
        address: '',
        role: 'USER' // Default role - always customer user, not admin
    });
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [showTermsModal, setShowTermsModal] = useState(false);
    const [showPrivacyModal, setShowPrivacyModal] = useState(false);

    const validatePassword = (password) => {
        const minLength = 8;
        const hasLower = /[a-z]/.test(password);
        const hasUpper = /[A-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        if (password.length < minLength) {
            return 'Password must be at least 8 characters long';
        }
        if (!hasLower) {
            return 'Password must contain at least one lowercase letter';
        }
        if (!hasUpper) {
            return 'Password must contain at least one uppercase letter';
        }
        if (!hasNumber) {
            return 'Password must contain at least one number';
        }
        if (!hasSymbol) {
            return 'Password must contain at least one symbol (!@#$%^&*...)';
        }
        return '';
    };

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setFormData({...formData, password: newPassword});
        setPasswordError(validatePassword(newPassword));
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        // Validate password
        const passwordValidationError = validatePassword(formData.password);
        if (passwordValidationError) {
            setPasswordError(passwordValidationError);
            alert(passwordValidationError);
            return;
        }
        // Check terms and conditions
        if (!acceptedTerms) {
            alert('Please accept the Terms and Conditions and Privacy Policy');
            return;
        }

        // Prepare data to send
        const dataToSend = new URLSearchParams();
        dataToSend.append('name', formData.name);
        dataToSend.append('email', formData.email);
        dataToSend.append('username', formData.username);
        dataToSend.append('password', formData.password);
        dataToSend.append('address', formData.address);
        dataToSend.append('role', 'USER'); // fixed for customer reg

        try {
            const response = await fetch('http://localhost:8080/CAT201_project/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: dataToSend
            });

            const result = await response.json();

            if (response.ok && result.status === 'success') {
                alert('✅ Account created! Please login.');
                navigate('/login');
            } else {
                alert('❌ Registration Failed: ' + (result.message || 'Unknown error'));
            }
        } catch (error) {
            console.error("Register Error:", error);
            alert('❌ Server Error: Could not connect to backend.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh] py-10">
            <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md border-t-8 border-pink-500">
                <div className="text-center mb-8">
                    <UserPlus className="w-12 h-12 text-pink-500 mx-auto mb-2" />
                    <h2 className="text-3xl font-black text-gray-800">Register</h2>
                    <p className="text-gray-500">Join the
                        <Link to="/home">
                            <span className="hover:text-cyan-600 transition-colors tracking-tighter"> BookShelter </span>
                        </Link>
                        family</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                    <input type="text" placeholder="Full Name" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 outline-none"
                        onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                    <input
                        type="email"
                        placeholder="Email Address"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 outline-none"
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Choose Username"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 outline-none"
                        onChange={(e) => setFormData({...formData, username: e.target.value})}
                        required
                    />
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MapPin className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Shipping Address"
                            className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 outline-none"
                            onChange={(e) => setFormData({...formData, address: e.target.value})}
                            required
                        />
                    </div>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            className={`w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 focus:ring-pink-400 outline-none ${
                                passwordError ? 'border-red-400' : 'border-gray-200'
                            }`}
                            value={formData.password}
                            onChange={handlePasswordChange}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    {/* Password requirements */}
                    <div className="text-xs space-y-1 px-1">
                        <p className="text-gray-600 font-semibold">Password must contain:</p>
                        <div className="grid grid-cols-2 gap-1">
                            <p className={formData.password.length >= 8 ? 'text-green-600' : 'text-gray-400'}>
                                ✓ At least 8 characters
                            </p>
                            <p className={/[a-z]/.test(formData.password) ? 'text-green-600' : 'text-gray-400'}>
                                ✓ Lowercase letter
                            </p>
                            <p className={/[A-Z]/.test(formData.password) ? 'text-green-600' : 'text-gray-400'}>
                                ✓ Uppercase letter
                            </p>
                            <p className={/[0-9]/.test(formData.password) ? 'text-green-600' : 'text-gray-400'}>
                                ✓ Number
                            </p>
                            <p className={/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? 'text-green-600' : 'text-gray-400'}>
                                ✓ Symbol (!@#$%...)
                            </p>
                        </div>
                    </div>

                    {/* Terms and Conditions Checkbox */}
                    <div className="pt-4 border-t border-gray-200">
                        <label className="flex items-start space-x-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={acceptedTerms}
                                onChange={(e) => setAcceptedTerms(e.target.checked)}
                                className="mt-1 w-5 h-5 text-pink-500 border-gray-300 rounded focus:ring-pink-400"
                                required
                            />
                            <span className="text-sm text-gray-700">
                                I agree to the{' '}
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setShowTermsModal(true);
                                    }}
                                    className="text-pink-500 font-semibold hover:underline"
                                >
                                    Terms and Conditions
                                </button>{' '}
                                and{' '}
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setShowPrivacyModal(true);
                                    }}
                                    className="text-pink-500 font-semibold hover:underline"
                                >
                                    Privacy Policy
                                </button>
                            </span>
                        </label>
                    </div>

                    <button 
                        type="submit" 
                        className="w-full bg-pink-500 text-white font-bold py-3 rounded-xl hover:bg-pink-600 transition-all shadow-lg mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!acceptedTerms || passwordError !== ''}
                    >
                        Create Account
                    </button>
                </form>

                <p className="mt-6 text-center text-gray-600 text-sm">
                    Already have an account? <Link to="/login" className="text-pink-500 font-bold hover:underline">Login</Link>
                </p>
            </div>

            {/* Modals */}
            {showTermsModal && <TermsModal onClose={() => setShowTermsModal(false)} />}
            {showPrivacyModal && <PrivacyModal onClose={() => setShowPrivacyModal(false)} />}
        </div>
    );
};

export default RegisterPage;