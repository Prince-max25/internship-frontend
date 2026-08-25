import { Link } from "react-router-dom";
import "./About.css";

function About() {
  return (
    <div className="about-page">

      {/* Navigation */}
      <nav className="navbar">

        <Link to="/" className="logo">
          Internship<span>Portal</span>
        </Link>

        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/about" className="active">About</Link>
          <Link to="/departments">Departments</Link>
          <Link to="/contact">Contact</Link>
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


      {/* Hero */}
      <section className="about-hero">

        <div className="about-hero-content">

          <p className="about-label">
            ABOUT INTERNSHIP PORTAL
          </p>

          <h1>
            Connecting Students
            <br />
            With <span>Opportunity.</span>
          </h1>

          <p>
            Our internship portal helps students discover meaningful
            internship opportunities, develop professional skills,
            and take their first steps into the world of work.
          </p>

        </div>

      </section>


      {/* About Content */}
      <section className="about-intro">

        <div className="about-intro-text">

          <p className="section-label">
            WHO WE ARE
          </p>

          <h2>
            Helping Students Build Their Future
          </h2>

          <p>
            Internship Portal is designed to make the internship
            application process easier, more organized and more
            accessible for students.
          </p>

          <p>
            From creating a student profile to submitting documents
            and tracking an application, students can manage their
            entire internship journey from one platform.
          </p>

          <Link to="/departments" className="about-button">
            Explore Departments →
          </Link>

        </div>


        <div className="about-intro-card">

          <div className="about-card-number">
            01
          </div>

          <h3>
            Our Purpose
          </h3>

          <p>
            To connect students with opportunities where they can
            gain practical experience and prepare for successful
            careers.
          </p>

        </div>

      </section>


      {/* Mission & Vision */}
      <section className="mission-section">

        <div className="section-heading">

          <p>
            WHAT DRIVES US
          </p>

          <h2>
            Our Mission & Vision
          </h2>

        </div>


        <div className="mission-grid">

          <div className="mission-card">

            <div className="mission-icon">
              01
            </div>

            <h3>
              Our Mission
            </h3>

            <p>
              To provide students with access to quality internship
              opportunities while making the application and
              management process simple and efficient.
            </p>

          </div>


          <div className="mission-card">

            <div className="mission-icon">
              02
            </div>

            <h3>
              Our Vision
            </h3>

            <p>
              To become a trusted platform that helps students
              transition from academic learning to meaningful
              professional careers.
            </p>

          </div>

        </div>

      </section>


      {/* Benefits */}
      <section className="about-benefits">

        <div className="section-heading">

          <p>
            WHY INTERNSHIPS MATTER
          </p>

          <h2>
            Experience That Prepares You
          </h2>

          <span>
            An internship is more than a requirement.
            It is an opportunity to grow.
          </span>

        </div>


        <div className="benefit-grid">

          <div className="benefit-card">

            <span>01</span>

            <h3>
              Gain Experience
            </h3>

            <p>
              Apply what you have learned in school to real-world
              projects and professional environments.
            </p>

          </div>


          <div className="benefit-card">

            <span>02</span>

            <h3>
              Build Skills
            </h3>

            <p>
              Develop technical, communication and teamwork skills
              that employers value.
            </p>

          </div>


          <div className="benefit-card">

            <span>03</span>

            <h3>
              Grow Your Network
            </h3>

            <p>
              Meet professionals, build relationships and create
              connections that can support your career.
            </p>

          </div>


          <div className="benefit-card">

            <span>04</span>

            <h3>
              Prepare For Your Career
            </h3>

            <p>
              Gain confidence and experience that can help you
              transition successfully into the workplace.
            </p>

          </div>

        </div>

      </section>


      {/* CTA */}
      <section className="about-cta">

        <p>
          START YOUR JOURNEY
        </p>

        <h2>
          Ready to Gain Real Experience?
        </h2>

        <span>
          Explore available departments and begin your internship journey.
        </span>

        <Link to="/login">
          <button className="primary-btn">
            Apply for Internship →
          </button>
        </Link>

      </section>


      {/* Footer */}
      <footer>

        <div className="footer-top">

          <div>

            <Link to="/" className="footer-logo">
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

            <Link to="/dashboard">
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

export default About;