import React, { useState } from "react";
import "./Contact.css";

const Contact = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState('idle'); // idle, sending, sent, error

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('sending');

        try {
            const res = await fetch('https://formspree.io/f/mjgaokjr', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setStatus('sent');
                setFormData({ name: '', email: '', message: '' });
                setTimeout(() => setStatus('idle'), 4000);
            } else {
                setStatus('error');
                setTimeout(() => setStatus('idle'), 4000);
            }
        } catch {
            setStatus('error');
            setTimeout(() => setStatus('idle'), 4000);
        }
    };

    const statusText = status === 'sent' ? 'Message sent successfully!' : status === 'error' ? 'Failed to send. Please try again.' : '';

    return (
        <section id="contact" className="contact">
            <h1>CONTACT</h1>
            <div className="contact-content">
                <h2>Let's work together!</h2>
                <form className="contact-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="contact-name">Name</label>
                        <input
                            id="contact-name"
                            type="text"
                            name="name"
                            placeholder="Your Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="contact-email">Email</label>
                        <input
                            id="contact-email"
                            type="email"
                            name="email"
                            placeholder="Your Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="contact-message">Message</label>
                        <textarea
                            id="contact-message"
                            name="message"
                            placeholder="Your Message"
                            rows="4"
                            value={formData.message}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className="contact-submit" disabled={status === 'sending'}>
                        {status === 'sending' ? 'Sending...' : status === 'sent' ? 'Sent!' : status === 'error' ? 'Failed - Try Again' : 'Send Message'}
                    </button>
                    <p className="contact-status" aria-live="polite" role="status">
                        {statusText}
                    </p>
                </form>
                <p className="contact-alt">
                    Or email me directly at{' '}
                    <button
                        type="button"
                        className="contact-email"
                        onClick={() => navigator.clipboard.writeText('arunbh.y@gmail.com')}
                        aria-label="Copy email address arunbh.y@gmail.com to clipboard"
                    >
                        arunbh.y@gmail.com
                    </button>
                </p>
            </div>
        </section>
    );
};

export default Contact;
