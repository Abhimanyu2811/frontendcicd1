import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";

export default function LandingPage() {
  const [offsetY, setOffsetY] = useState(0);
  useEffect(() => {
    function handleScroll() {
      setOffsetY(window.pageYOffset);
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <style>{`
        .landing-gradient {
          background: linear-gradient(145deg, #121212, #1f1f1f);
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          color: #fff;
          display: flex;
          flex-direction: column;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .background-cubes {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: radial-gradient(circle, rgba(255,255,255,0.08) 1.5px, transparent 1.5px);
          background-size: 30px 30px;
          pointer-events: none;
          z-index: 0;
        }

        .glow-text {
          color: #ffffff;
          text-shadow:
            0 0 4px rgba(255, 255, 255, 0.5),
            0 0 8px rgba(255, 255, 255, 0.3);
        }

        .text-gradient {
          background: linear-gradient(90deg, #ffffff, #e0e0e0);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .btn-outline-light {
          color: #ffffff;
          border-color: #ffffff;
          transition: background-color 0.3s ease;
        }

        .btn-outline-light:hover {
          background-color: #ffffff;
          color: #121212;
        }

        /* Hero section layout */
        .hero-section {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          flex-wrap: nowrap;
          padding-left: 1vw;
          padding-right: 5vw;
          gap: 3rem;
          position: relative;
          z-index: 2;
          max-width: 1100px;
          margin: 0 auto;
        }

        .hero-text {
          order: 1;
          max-width: 480px;
          text-align: left;
          flex-shrink: 0;
        }

        .hero-illustration {
          order: 2;
          flex-shrink: 0;
          margin-top: 1.5rem;
        }

        .hero-illustration img {
          max-width: 420px;
          height: auto;
          border-radius: 1rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .about-section {
          display: flex;
          justify-content: space-between;
          gap: 2rem;
          margin-top: 5rem;
          margin-bottom: 3rem;
          max-width: 1100px;
          margin-left: auto;
          margin-right: auto;
          padding-left: 1vw;
          padding-right: 5vw;
          z-index: 2;
        }

        .about-text {
          flex: 1;
          color: rgba(255, 255, 255, 0.85);
          font-size: 1.1rem;
          line-height: 1.6;
        }

        .about-heading {
          font-size: 1.8rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 0.75rem;
          text-shadow:
            0 0 6px rgba(255, 255, 255, 0.5);
        }

        footer.text-secondary {
          color: #bbb;
          text-align: center;
          padding: 1rem 0;
          z-index: 2;
        }

        @media (max-width: 768px) {
          .hero-section {
            flex-direction: column;
            gap: 2rem;
            padding-left: 1.5rem;
            padding-right: 1.5rem;
          }

          .hero-text {
            order: 1;
            text-align: center;
          }

          .hero-illustration {
            order: 2;
          }

          .hero-illustration img {
            max-width: 100%;
            border-radius: 1rem;
          }

          .about-section {
            flex-direction: column;
            margin-top: 3rem;
            padding-left: 1.5rem;
            padding-right: 1.5rem;
          }
        }
      `}</style>

      <div className="landing-gradient">
        <Navbar />

        <div className="background-cubes" aria-hidden="true" />

        <main className="hero-section">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-text"
          >
            <h2 className="display-4 fw-bold mb-3 glow-text">
              Welcome to <br />
              <span className="text-gradient">EduSync LMS</span>
            </h2>
            <p className="lead glow-text mb-4">
              Empowering learners and educators with an intuitive platform to
              manage courses, quizzes, and performance analytics seamlessly.
            </p>
            <Link
              to="/register"
              className="btn btn-primary"
              style={{ color: "#fff", textDecoration: "none" }}
            >
              Get Started
            </Link>
          </motion.div>

          <div className="hero-illustration z-2">
            <img
              src="https://img.freepik.com/premium-vector/people-working-office-vector-illustration_1253202-263695.jpg?ga=GA1.1.485220390.1747887353&semt=ais_hybrid&w=740"
              alt="People working in an office"
              className="img-fluid"
            />
          </div>
        </main>

        <section className="about-section">
          <div className="about-text">
            <h2 className="about-heading">About EduSync</h2>
            <p>
              EduSync is a modern Learning Management System designed to make
              education streamlined and accessible. From interactive courses to
              real-time analytics, EduSync supports both students and educators
              in their journey.
            </p>
          </div>

          <div className="about-text">
            <h2 className="about-heading">What Sets Us Apart</h2>
            <p>
              Our platform emphasizes ease of use, insightful analytics, and
              interactive learning experiences that help you stay ahead in your
              academic goals.
            </p>
          </div>
        </section>

        <footer className="text-secondary text-center py-3">
          <small>&copy; 2025 EduSync. All rights reserved.</small>
        </footer>
      </div>
    </>
  );
}
