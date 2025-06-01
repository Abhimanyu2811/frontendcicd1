import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../services/authService';
import authService from '../services/authService';
import Navbar from '../components/Navbar';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (!formData.email || !formData.password) {
                throw new Error('Email and password are required');
            }

            if (!formData.password.trim()) {
                throw new Error('Password cannot be empty');
            }

            await login(formData.email, formData.password);

            const userData = authService.getCurrentUser();

            if (userData.role === ROLES.INSTRUCTOR) {
                navigate('/instructor-dashboard');
            } else {
                navigate('/student-dashboard');
            }
        } catch (err) {
            setError(err.message || 'An error occurred during login. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <style>
                {`
                    .login-container {
                        background: linear-gradient(135deg, #1a1a1a 0%, #000000 100%);
                        min-height: 100vh;
                        padding: 2rem 0;
                    }
                    .login-card {
                        background: rgba(255, 255, 255, 0.05);
                        backdrop-filter: blur(10px);
                        border: 1px solid rgba(255, 255, 255, 0.1);
                        border-radius: 20px;
                        box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
                    }
                    .login-input {
                        background: rgba(255, 255, 255, 0.05) !important;
                        border: 1px solid rgba(255, 255, 255, 0.1) !important;
                        color: white !important;
                        padding: 12px 20px !important;
                        border-radius: 12px !important;
                        transition: all 0.3s ease;
                    }
                    .login-input:focus {
                        background: rgba(255, 255, 255, 0.1) !important;
                        border-color: rgba(255, 255, 255, 0.2) !important;
                        box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.1);
                    }
                    .login-input::placeholder {
                        color: rgba(255, 255, 255, 0.6) !important;
                    }
                    .login-button {
                        background: linear-gradient(45deg, #2196F3, #1976D2) !important;
                        border: none !important;
                        padding: 12px 30px !important;
                        border-radius: 12px !important;
                        font-weight: 600 !important;
                        letter-spacing: 0.5px !important;
                        transition: all 0.3s ease !important;
                    }
                    .login-button:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 5px 15px rgba(33, 150, 243, 0.3);
                    }
                    .login-button:disabled {
                        background: linear-gradient(45deg, #90CAF9, #64B5F6) !important;
                        transform: none;
                        box-shadow: none;
                    }
                    .login-image {
                        border-radius: 20px;
                        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                        transition: transform 0.3s ease;
                    }
                    .login-image:hover {
                        transform: scale(1.02);
                    }
                    .error-alert {
                        background: rgba(220, 53, 69, 0.1);
                        border: 1px solid rgba(220, 53, 69, 0.2);
                        color: #ff6b6b;
                        border-radius: 12px;
                        padding: 12px 20px;
                    }
                `}
            </style>
            <div className="login-container">
                <div className="container">
                    <div className="row justify-content-center align-items-center min-vh-100">
                        <div className="col-lg-6 d-none d-lg-block" style={{ marginTop: '-12vh', marginRight: '4rem' }}>
                        <img 
                             src="https://media.istockphoto.com/id/1485715402/photo/lms-learning-management-system-for-lesson-and-online-education-course-application-study-e.jpg?s=612x612&w=0&k=20&c=_pt8OIMpvfOgQKHW_5u2rB6fXAg5KT0G-0Yy1UqOwZM=" 
                             alt="Login visual" 
                             className="img-fluid login-image" 
                            style={{ maxHeight: '800px', maxWidth: '100%', width: '100%', objectFit: 'cover' }} 
                         />

                        </div>

                        {/* Shifted login form slightly up with marginTop */}
                        <div className="col-lg-5 col-md-8 col-sm-12" style={{ marginTop: '-10vh' }}>
                            <div className="login-card p-4 p-md-5">
                                <h2 className="text-center text-white mb-4" style={{ 
                                    fontSize: '2.5rem', 
                                    fontWeight: '700',
                                    background: 'linear-gradient(45deg, #fff, #e0e0e0)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent'
                                }}>
                                    Welcome Back
                                </h2>
                                <p className="text-center text-white-50 mb-5" style={{ fontSize: '1.1rem' }}>
                                    Sign in to continue your learning journey
                                </p>
                                
                                {error && (
                                    <div className="error-alert mb-4" role="alert">
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit}>
                                    <div className="mb-4">
                                        <input
                                            type="email"
                                            className="form-control login-input"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="Enter your Email"
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <input
                                            type="password"
                                            className="form-control login-input"
                                            id="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="Enter Password"
                                            required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="btn btn-primary w-100 login-button"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <span>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Logging in...
                                            </span>
                                        ) : 'Sign In'}
                                    </button>
                                </form>

                                <div className="text-center mt-4">
                                    <p className="text-white-50" style={{ fontSize: '1rem' }}>
                                        Don't have an account?{' '}
                                        <Link to="/register" className="text-primary text-decoration-none fw-bold">
                                            Create Account
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;
