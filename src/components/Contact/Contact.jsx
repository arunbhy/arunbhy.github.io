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

    const statusText = status === 'sent'
        ? 'Message sent. I will get back to you soon.'
        : status === 'error'
            ? 'Something went wrong. Please try again.'
            : '';

    return (
        <section id="contact" className="ed-contact">
            <div className="wrap">
                <div className="kicker">Let's build something</div>
                <h2 className="contact-head">
                    <a href="mailto:arunbh.y@gmail.com">arunbh.y@gmail.com</a>
                </h2>

                <div className="contact-grid">
                    <form className="contact-form" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="contact-name">Name</label>
                            <input
                                id="contact-name"
                                type="text"
                                name="name"
                                placeholder="Your name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="contact-email">Email</label>
                            <input
                                id="contact-email"
                                type="email"
                                name="email"
                                placeholder="you@somewhere.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="contact-message">Message</label>
                            <textarea
                                id="contact-message"
                                name="message"
                                placeholder="What's on your mind?"
                                rows="4"
                                value={formData.message}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <button type="submit" className="btn solid" disabled={status === 'sending'}>
                            {status === 'sending' ? 'Sending…' : status === 'sent' ? 'Sent' : 'Send message'} <span className="arr">→</span>
                        </button>
                        <p className="contact-status" aria-live="polite" role="status">{statusText}</p>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Contact;
