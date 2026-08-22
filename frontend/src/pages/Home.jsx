import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

import internship1 from "../assets/internship1.jpg";
import internship2 from "../assets/internship2.jpg";
import internship3 from "../assets/internship3.jpg";
import internship4 from "../assets/internship4.jpg";


/* ================================
   ANIMATED STATISTICS NUMBER
================================ */

function AnimatedNumber({ end, suffix = "" }) {

  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {

    const element = document.getElementById(`stat-${end}`);

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {

        if (entry.isIntersecting) {

          setIsVisible(true);

          observer.disconnect();

        }

      },
      {
        threshold: 0.5,
      }
    );

    observer.observe(element);

    return () => observer.disconnect();

  }, [end]);


  useEffect(() => {

    if (!isVisible) return;

    let current = 0;

    const duration = 1800;
    const stepTime = 16;

    const increment = end / (duration / stepTime);

    const timer = setInterval(() => {

      current += increment;

      if (current >= end) {

        current = end;

        clearInterval(timer);

      }

      setCount(Math.floor(current));

    }, stepTime);


    return () => clearInterval(timer);

  }, [isVisible, end]);


  return (
    <>
      {count.toLocaleString()}
      {suffix}
    </>
  );

}


/* ================================
   HOME PAGE
================================ */

function Home() {

  /* HERO SLIDESHOW */

  const [currentImage, setCurrentImage] = useState(0);

  const heroImages = [
    internship1,
    internship2,
    internship3,
    internship4,
  ];


  /* AUTOMATIC SLIDESHOW */

  useEffect(() => {

    const interval = setInterval(() => {

      setCurrentImage((previous) =>
        (previous + 1) % heroImages.length
      );

    }, 4000);

    return () => clearInterval(interval);

  }, []);


  return (

    <div className="home">


      {/* ================================
          NAVIGATION
      ================================= */}

      <nav className="navbar">

        <Link to="/" className="logo">
          Internship<span>Portal</span>
        </Link>


        <div className="nav-links">

          <Link to="/">
            Home
          </Link>

          <Link to="/about">
            About
          </Link>

          <Link to="/departments">
            Departments
          </Link>

          <Link to="/contact">
            Contact
          </Link>

        </div>


        <div className="nav-actions">

          <Link to="/login">

            <button className="login-btn">
              Login
            </button>

          </Link>


          <Link to="/login">

            <button className="apply-btn">
              Apply Now
            </button>

          </Link>

        </div>

      </nav>



      {/* ================================
          HERO SECTION
      ================================= */}

      <section className="hero">

        <div className="hero-content">

          <p className="hero-label">
            INTERNSHIP OPPORTUNITIES
          </p>


          <h1>

            Build Your Future

            <br />

            Through <span>Experience.</span>

          </h1>


          <p className="hero-description">

            Gain practical experience, develop valuable skills,
            and take the next step toward your professional career.

          </p>


          <div className="hero-buttons">

            <Link to="/departments">

              <button className="primary-btn">
                Explore Opportunities →
              </button>

            </Link>


            <Link to="/login">

              <button className="secondary-btn">
                Apply Now
              </button>

            </Link>

          </div>

        </div>



        {/* HERO IMAGE SLIDESHOW */}

        <div className="hero-image">

          {heroImages.map((image, index) => (

            <img
              key={image}
              src={image}
              alt={`Internship experience ${index + 1}`}
              className={`hero-slide ${
                currentImage === index ? "active" : ""
              }`}
            />

          ))}


          {/* SLIDE INDICATORS */}

          <div className="hero-slide-indicators">

            {heroImages.map((_, index) => (

              <button
                key={index}
                className={
                  currentImage === index
                    ? "active"
                    : ""
                }
                onClick={() => setCurrentImage(index)}
                aria-label={`Show image ${index + 1}`}
              />

            ))}

          </div>

        </div>

      </section>



      {/* ================================
          STATISTICS
      ================================= */}

      <section className="statistics">


        <div className="stat-item">

          <strong id="stat-1200">

            <AnimatedNumber
              end={1200}
              suffix="+"
            />

          </strong>

          <span>
            Students Registered
          </span>

        </div>



        <div className="stat-item">

          <strong id="stat-50">

            <AnimatedNumber
              end={50}
              suffix="+"
            />

          </strong>

          <span>
            Internship Opportunities
          </span>

        </div>



        <div className="stat-item">

          <strong id="stat-6">

            <AnimatedNumber
              end={6}
            />

          </strong>

          <span>
            Departments
          </span>

        </div>



        <div className="stat-item">

          <strong id="stat-95">

            <AnimatedNumber
              end={95}
              suffix="%"
            />

          </strong>

          <span>
            Student Satisfaction
          </span>

        </div>


      </section>



      {/* ================================
          WHY CHOOSE US
      ================================= */}

      <section
        className="features"
        id="about"
      >

        <div className="section-heading">

          <p>
            WHY CHOOSE US
          </p>


          <h2>
            More Than Just an Internship
          </h2>


          <span>

            We help students turn academic knowledge into
            meaningful professional experience.

          </span>

        </div>



        <div className="feature-grid">


          <div className="feature-card">

            <div className="feature-icon">
              01
            </div>


            <h3>
              Practical Experience
            </h3>


            <p>

              Work on real projects and gain hands-on experience
              in your chosen field.

            </p>

          </div>



          <div className="feature-card">

            <div className="feature-icon">
              02
            </div>


            <h3>
              Professional Growth
            </h3>


            <p>

              Develop the skills and confidence needed to succeed
              in the workplace.

            </p>

          </div>



          <div className="feature-card">

            <div className="feature-icon">
              03
            </div>


            <h3>
              Mentorship
            </h3>


            <p>

              Learn from experienced professionals and receive
              guidance throughout your internship.

            </p>

          </div>


        </div>

      </section>



      {/* ================================
          DEPARTMENTS
      ================================= */}

      <section
        className="opportunities"
        id="departments"
      >

        <div className="section-heading">

          <p>
            OPPORTUNITIES
          </p>


          <h2>
            Explore Our Departments
          </h2>


          <span>

            Discover opportunities across different areas
            of the organization.

          </span>

        </div>



        <div className="department-grid">


          <div className="department-card">

            <span>
              01
            </span>

            <h3>
              Information Technology
            </h3>

            <p>
              Software, networking, cybersecurity and technology.
            </p>

          </div>



          <div className="department-card">

            <span>
              02
            </span>

            <h3>
              Engineering
            </h3>

            <p>
              Gain practical experience working with engineering teams.
            </p>

          </div>



          <div className="department-card">

            <span>
              03
            </span>

            <h3>
              Finance
            </h3>

            <p>
              Develop skills in accounting, finance and financial management.
            </p>

          </div>



          <div className="department-card">

            <span>
              04
            </span>

            <h3>
              Human Resources
            </h3>

            <p>
              Learn about recruitment, employee relations and HR operations.
            </p>

          </div>



          <div className="department-card">

            <span>
              05
            </span>

            <h3>
              Operations
            </h3>

            <p>
              Understand how organizations manage daily operations.
            </p>

          </div>



          <div className="department-card">

            <span>
              06
            </span>

            <h3>
              Administration
            </h3>

            <p>
              Develop organizational and administrative skills.
            </p>

          </div>


        </div>

      </section>



      {/* ================================
          HOW IT WORKS
      ================================= */}

      <section className="how-it-works">

        <div className="section-heading">

          <p>
            HOW IT WORKS
          </p>


          <h2>
            Start Your Internship Journey
          </h2>


          <span>

            Applying for an internship has never been easier.

          </span>

        </div>



        <div className="steps-grid">


          <div className="step-card">

            <div className="step-number">
              01
            </div>

            <h3>
              Create Your Account
            </h3>

            <p>

              Register on the portal and create your student
              profile with your personal and academic information.

            </p>

          </div>



          <div className="step-card">

            <div className="step-number">
              02
            </div>

            <h3>
              Complete Your Application
            </h3>

            <p>

              Select your preferred department and provide the
              information required for your internship application.

            </p>

          </div>



          <div className="step-card">

            <div className="step-number">
              03
            </div>

            <h3>
              Submit Your Documents
            </h3>

            <p>

              Upload your CV, transcript and other required
              documents for review.

            </p>

          </div>



          <div className="step-card">

            <div className="step-number">
              04
            </div>

            <h3>
              Track Your Application
            </h3>

            <p>

              Monitor your application status and receive
              notifications throughout the process.

            </p>

          </div>


        </div>

      </section>



      {/* ================================
          CALL TO ACTION
      ================================= */}

      <section className="cta">

        <div className="cta-content">

          <p>
            START YOUR JOURNEY
          </p>


          <h2>
            Ready to Build Your Future?
          </h2>


          <span>

            Take the first step toward gaining valuable
            professional experience.

          </span>


          <Link to="/login">

            <button className="primary-btn">
              Apply for Internship →
            </button>

          </Link>

        </div>

      </section>



      {/* ================================
          FOOTER
      ================================= */}

      <footer id="contact">


        <div className="footer-top">


          <div>

            <Link
              to="/"
              className="footer-logo"
            >
              Internship<span>Portal</span>
            </Link>


            <p>

              Connecting students with opportunities to learn,
              grow, and succeed.

            </p>

          </div>



          <div className="footer-column">

            <h3>
              Portal
            </h3>


            <Link to="/about">
              About
            </Link>

            <Link to="/departments">
              Departments
            </Link>

            <Link to="/contact">
              Contact
            </Link>

          </div>



          <div className="footer-column">

            <h3>
              Students
            </h3>


            <Link to="/login">
              Login
            </Link>

            <Link to="/login">
              Apply
            </Link>

            <Link to="/login">
              Student Portal
            </Link>

          </div>


        </div>



        <div className="footer-bottom">

          <p>
            © 2026 Internship Portal. All rights reserved.
          </p>


          <span>
            Internship Opportunities Portal
          </span>

        </div>


      </footer>


    </div>

  );

}

export default Home;