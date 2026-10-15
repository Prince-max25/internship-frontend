import { Link } from "react-router-dom";
import "./Contact.css";

function Contact() {
  return (
    <div className="contact-page">

      {/* Navigation */}
      <nav className="navbar">

        <Link to="/" className="logo">
          Internship<span>Portal</span>
        </Link>

        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/departments">Departments</Link>
          <Link to="/contact" className="active">
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


      {/* Hero with full-background slideshow */}
      <section className="contact-hero">

        <div
          className="contact-hero-slideshow"
          aria-hidden="true"
        >
          <div className="contact-hero-slide contact-slide-one"></div>
          <div className="contact-hero-slide contact-slide-two"></div>
          <div className="contact-hero-slide contact-slide-three"></div>
        </div>

        <div className="contact-hero-overlay"></div>

        <div className="contact-hero-content">

          <p>GET IN TOUCH</p>

          <h1>
            We're Here to
            <span> Help.</span>
          </h1>

          <span>
            Have a question about the internship portal or your
            application? Our team is here to assist you.
          </span>

        </div>

      </section>


      {/* Contact Content */}
      <section className="contact-section">

        <div className="contact-info">

          <p className="section-label">
            CONTACT US
          </p>

          <h2>
            Let's Talk
          </h2>

          <p className="contact-intro">
            Whether you need help with your application, have a
            technical issue, or simply need more information,
            feel free to reach out.
          </p>


          {/* Contact Details */}
          <div className="contact-details">

            <div className="contact-detail">

              <div className="contact-icon">
                ✉
              </div>

              <div>
                <strong>Email</strong>
                <span>support@internshipportal.com</span>
              </div>

            </div>


            <div className="contact-detail">

              <div className="contact-icon">
                ☎
              </div>

              <div>
                <strong>Phone</strong>
                <span>+233 XX XXX XXXX</span>
              </div>

            </div>


            <div className="contact-detail">

              <div className="contact-icon">
                ◉
              </div>

              <div>
                <strong>Office Hours</strong>
                <span>Monday – Friday, 8:00 AM – 5:00 PM</span>
              </div>

            </div>

          </div>

        </div>


        {/* Contact Form */}
        <div className="contact-form-card">

          <h2>
            Send Us a Message
          </h2>

          <p>
            Fill in the form below and we'll get back to you.
          </p>


          <form>

            <div className="contact-form-grid">

              <div className="contact-field">

                <label htmlFor="contact-name">
                  Full Name
                </label>

                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  required
                />

              </div>


              <div className="contact-field">

                <label htmlFor="contact-email">
                  Email Address
                </label>

                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  required
                />

              </div>

            </div>


            <div className="contact-field">

              <label htmlFor="contact-subject">
                Subject
              </label>

              <input
                id="contact-subject"
                type="text"
                name="subject"
                placeholder="What is your message about?"
                required
              />

            </div>


            <div className="contact-field">

              <label htmlFor="contact-message">
                Message
              </label>

              <textarea
                id="contact-message"
                name="message"
                rows="7"
                placeholder="Write your message here..."
                required
              ></textarea>

            </div>


            <button
              type="submit"
              className="contact-submit"
            >
              Send Message →
            </button>

          </form>

        </div>

      </section>


      {/* FAQ Cards with Background Images */}
      <section className="contact-faq">

        <div className="section-heading">

          <p>
            FREQUENTLY ASKED QUESTIONS
          </p>

          <h2>
            Common Questions
          </h2>

        </div>


        <div className="faq-grid">

          <div className="faq-card">

            <h3>
              How do I apply for an internship?
            </h3>

            <p>
              Create an account or log in to the student portal,
              complete your application and submit the required
              documents.
            </p>

          </div>


          <div className="faq-card">

            <h3>
              Can I apply to multiple departments?
            </h3>

            <p>
              Your application allows you to indicate your preferred
              department and internship interests.
            </p>

          </div>


          <div className="faq-card">

            <h3>
              How can I track my application?
            </h3>

            <p>
              Log in to your student dashboard and select
              Application Status to see the latest updates.
            </p>

          </div>


          <div className="faq-card">

            <h3>
              What documents do I need?
            </h3>

            <p>
              Applicants may be required to provide a CV,
              academic transcript, cover letter and recommendation
              letter.
            </p>

          </div>

        </div>

      </section>


      {/* Call to Action */}
      <section className="contact-cta">

        <p>
          READY TO GET STARTED?
        </p>

        <h2>
          Begin Your Internship Journey Today.
        </h2>

        <span>
          Create your account and start your application.
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

            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/departments">Departments</Link>
            <Link to="/contact">Contact</Link>

          </div>


          <div className="footer-column">

            <h3>
              Students
            </h3>

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

export default Contact;