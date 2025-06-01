import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../services/authService';
import Navbar from '../components/Navbar';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: ROLES.STUDENT
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { register } = useAuth();

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
            await register(formData.name, formData.email, formData.password, formData.role);
            navigate(formData.role === ROLES.INSTRUCTOR ? '/instructor-dashboard' : '/student-dashboard');
        } catch (err) {
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <style>
                {`
                    .register-container {
                        background: linear-gradient(135deg, #121212 0%, #000000 100%);
                        min-height: 100vh;
                        padding: 2rem 0;
                        font-family: 'Segoe UI', sans-serif;
                    }
                    .register-card {
                        background: rgba(255, 255, 255, 0.05);
                        backdrop-filter: blur(10px);
                        border: 1px solid rgba(255, 255, 255, 0.1);
                        border-radius: 20px;
                        box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
                    }
                    .register-input {
                        background: rgba(255, 255, 255, 0.05) !important;
                        border: 1px solid rgba(255, 255, 255, 0.1) !important;
                        color: white !important;
                        padding: 12px 20px !important;
                        border-radius: 12px !important;
                        transition: all 0.3s ease;
                    }
                    .register-input:focus {
                        background: rgba(255, 255, 255, 0.1) !important;
                        border-color: rgba(255, 255, 255, 0.2) !important;
                        box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.1);
                        outline: none !important;
                    }
                    .register-input::placeholder {
                        color: rgba(255, 255, 255, 0.6) !important;
                    }
                    .register-select {
                        background: rgba(255, 255, 255, 0.05) !important;
                        border: 1px solid rgba(255, 255, 255, 0.1) !important;
                        color: white !important;
                        padding: 12px 20px !important;
                        border-radius: 12px !important;
                        transition: all 0.3s ease;
                        appearance: none;
                        padding-right: 3rem !important;
                    }
                    .register-select:focus {
                        background: rgba(255, 255, 255, 0.1) !important;
                        border-color: rgba(255, 255, 255, 0.2) !important;
                        box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.1);
                        outline: none !important;
                    }
                    .register-button {
                        background: linear-gradient(45deg, #2196F3, #1976D2) !important;
                        border: none !important;
                        padding: 12px 30px !important;
                        border-radius: 12px !important;
                        font-weight: 600 !important;
                        letter-spacing: 0.5px !important;
                        transition: all 0.3s ease !important;
                        color: white !important;
                    }
                    .register-button:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 5px 15px rgba(33, 150, 243, 0.3);
                    }
                    .register-button:disabled {
                        background: linear-gradient(45deg, #90CAF9, #64B5F6) !important;
                        transform: none;
                        box-shadow: none;
                    }
                    .register-image {
                        border-radius: 20px;
                        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                        transition: transform 0.3s ease;
                    }
                    .register-image:hover {
                        transform: scale(1.02);
                    }
                    .error-alert {
                        background: rgba(220, 53, 69, 0.1);
                        border: 1px solid rgba(220, 53, 69, 0.2);
                        color: #ff6b6b;
                        border-radius: 12px;
                        padding: 12px 20px;
                        margin-bottom: 1rem;
                    }
                `}
            </style>

            <div className="register-container">
                <div className="container">
                    <div className="row justify-content-center align-items-center min-vh-100">
                        <div className="col-lg-6 d-none d-lg-block" style={{ marginTop: '-10vh', marginRight: '4rem' }}>
                            <img
                                src="https://media.istockphoto.com/id/1485715402/photo/lms-learning-management-system-for-lesson-and-online-education-course-application-study-e.jpg?s=612x612&w=0&k=20&c=_pt8OIMpvfOgQKHW_5u2rB6fXAg5KT0G-0Yy1UqOwZM="
                                alt="Register visual"
                                className="img-fluid register-image"
                                style={{ maxHeight: '600px', objectFit: 'cover' }}
                            />
                        </div>

                        <div className="col-lg-5 col-md-8 col-sm-12" style={{ marginTop: '-5vh' }}>
                            <div className="register-card p-4 p-md-5">
                                <h2
                                    className="text-center mb-4"
                                    style={{
                                        fontSize: '2.5rem',
                                        fontWeight: '700',
                                        background: 'linear-gradient(45deg, #fff, #e0e0e0)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent'
                                    }}
                                >
                                    Create an Account
                                </h2>

                                {error && (
                                    <div className="error-alert" role="alert">
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit}>
                                    <div className="mb-4">
                                        <input
                                            type="text"
                                            className="form-control register-input"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Full Name"
                                            required
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <input
                                            type="email"
                                            className="form-control register-input"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="Email"
                                            required
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <input
                                            type="password"
                                            className="form-control register-input"
                                            id="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="Password"
                                            required
                                        />
                                    </div>

                                    <div className="mb-4 position-relative">
                                        <select
                                            className="form-select register-select"
                                            id="role"
                                            name="role"
                                            value={formData.role}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value={ROLES.STUDENT} className='text-dark'>Student</option>
                                            <option value={ROLES.INSTRUCTOR} className='text-dark'>Instructor</option>
                                        </select>
                                        <span
                                            className="position-absolute"
                                            style={{
                                                top: '50%',
                                                right: '1rem',
                                                transform: 'translateY(-50%)',
                                                pointerEvents: 'none',
                                                color: '#ccc',
                                                fontSize: '1rem'
                                            }}
                                        >
                                            ▼
                                        </span>
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn register-button w-100"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <span>
                                                <span
                                                    className="spinner-border spinner-border-sm me-2"
                                                    role="status"
                                                    aria-hidden="true"
                                                ></span>
                                                Registering...
                                            </span>
                                        ) : (
                                            'Register'
                                        )}
                                    </button>
                                </form>

                                <div className="text-center mt-4">
                                    <p className="text-white-50" style={{ fontSize: '1rem' }}>
                                        Already have an account?{' '}
                                        <Link to="/login" className="text-primary text-decoration-none fw-bold">
                                            Login here
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

export default Register;
