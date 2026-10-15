import { Link } from "react-router-dom";
import "./Dashboard.css"
import "./Departments.css";

function Departments() {
  const departments = [
    {
      number: "01",
      name: "Information Technology",
      description:
        "Work with technology teams on software, networking, cybersecurity, databases and digital solutions.",
      skills: ["Software Development", "Networking", "Cybersecurity"],
    },
    {
      number: "02",
      name: "Engineering",
      description:
        "Gain practical experience supporting engineering projects, technical operations and problem-solving.",
      skills: ["Technical Design", "Project Work", "Problem Solving"],
    },
    {
      number: "03",
      name: "Finance",
      description:
        "Develop practical knowledge in accounting, financial analysis, reporting and financial management.",
      skills: ["Accounting", "Financial Analysis", "Reporting"],
    },
    {
      number: "04",
      name: "Human Resources",
      description:
        "Learn how organizations recruit, support and develop employees while gaining experience in HR operations.",
      skills: ["Recruitment", "Employee Relations", "HR Operations"],
    },
    {
      number: "05",
      name: "Operations",
      description:
        "Understand how organizations manage their daily activities, processes and operational performance.",
      skills: ["Operations", "Planning", "Process Management"],
    },
    {
      number: "06",
      name: "Administration",
      description:
        "Develop organizational, communication and administrative skills while supporting everyday business activities.",
      skills: ["Administration", "Communication", "Organization"],
    },
  ];

  return (
    <div className="departments-page">

      {/* Navigation */}
      <nav className="navbar">

        <Link to="/" className="logo">
          Internship<span>Portal</span>
        </Link>

        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/departments" className="active">
            Departments
          </Link>
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
      <section className="departments-hero">

        <div className="departments-hero-content">

          <p>INTERNSHIP OPPORTUNITIES</p>

          <h1>
            Find Your Place to
            <span> Grow.</span>
          </h1>

          <span>
            Explore our departments and discover where your skills,
            interests and career goals can take you.
          </span>

        </div>

      </section>


      {/* Departments */}
      <section className="departments-section">

        <div className="section-heading">

          <p>OUR DEPARTMENTS</p>

          <h2>
            Explore Your Opportunities
          </h2>

          <span>
            Choose a department that matches your academic background
            and career interests.
          </span>

        </div>


        <div className="departments-grid">

          {departments.map((department) => (

            <div
              className="department-detail-card"
              key={department.number}
            >

              <div className="department-top">

                <span className="department-number">
                  {department.number}
                </span>

                <span className="department-tag">
                  INTERNSHIP
                </span>

              </div>


              <h3>
                {department.name}
              </h3>


              <p className="department-description">
                {department.description}
              </p>


              <div className="skills">

                <p>
                  Skills you can gain
                </p>

                <div className="skill-list">

                  {department.skills.map((skill) => (
                    <span key={skill}>
                      {skill}
                    </span>
                  ))}

                </div>

              </div>


              <Link
                to="/login"
                className="department-apply"
              >
                Apply for this Department →
              </Link>

            </div>

          ))}

        </div>

      </section>


      {/* How to Choose */}
      <section className="choose-section">

        <div className="section-heading">

          <p>NOT SURE WHERE TO START?</p>

          <h2>
            Choose Based on Your Interests
          </h2>

        </div>


        <div className="interest-grid">

          <div className="interest-card">
            <strong>Technology</strong>
            <span>
              IT, software, networking and cybersecurity
            </span>
          </div>

          <div className="interest-card">
            <strong>Business</strong>
            <span>
              Finance, administration and operations
            </span>
          </div>

          <div className="interest-card">
            <strong>People</strong>
            <span>
              Human resources and employee development
            </span>
          </div>

          <div className="interest-card">
            <strong>Technical</strong>
            <span>
              Engineering and technical projects
            </span>
          </div>

        </div>

      </section>


      {/* CTA */}
      <section className="departments-cta">

        <p>
          READY TO BEGIN?
        </p>

        <h2>
          Your Career Starts With Experience.
        </h2>

        <span>
          Create your account and begin your internship application today.
        </span>

        <Link to="/login">
          <button className="primary-btn">
            Start Application →
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

            <h3>Portal</h3>

            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/departments">Departments</Link>
            <Link to="/contact">Contact</Link>

          </div>


          <div className="footer-column">

            <h3>Students</h3>

            <Link to="/login">Login</Link>
            <Link to="/login">Apply</Link>
            <Link to="/dashboard">Student Portal</Link>

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

export default Departments;