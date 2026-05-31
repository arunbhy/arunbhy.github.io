import React from "react";
import "./About.css";
import useInView from "../../hooks/useInView";

const About = () => {
    const [ref, inView] = useInView();

    return (
        <section id="about" className="ed-section">
            <div className="wrap">
                <div className="sec-head">
                    <h2>About</h2>
                    <span className="idx">01 / 06</span>
                </div>

                <div ref={ref} className={`about-grid rev ${inView ? 'in' : ''}`}>
                    <div>
                        <p>
                            <b>Data scientist with close to three years shipping production ML at scale.</b> At Optum (UnitedHealth Group) I built document-intelligence and NLP services that process tens of thousands of forms a month, hold a filed USPTO patent on image matching, and a peer-reviewed publication.
                        </p>
                        <p>
                            I recently completed my Master's in Data Science at the University of Maryland, College Park, with a focus on computer vision, agentic AI, and developer tooling. I care about systems that are not just accurate but trustworthy, and copy that sounds like a person wrote it.
                        </p>
                        <p>
                            Away from the keyboard I read books and comics in equal measure, lose hours to story-rich RPGs, and go looking for new running trails.
                        </p>
                    </div>

                    <aside className="about-side">
                        <img className="about-photo" src="images/pfp.JPG" alt="Arunbh Yashaswi" loading="lazy" />
                        <span className="k">Focus</span><br />
                        Computer Vision<br />NLP · Agentic AI<br />Document Intelligence<br /><br />
                        <span className="k">Stack</span><br />
                        Python · PyTorch<br />Azure · AWS · Databricks<br /><br />
                        <span className="k">Off-screen</span><br />
                        Comics · RPGs · Running
                        <br />
                        <a className="btn ghost" href="Resume_Arunbh.pdf" target="_blank" rel="noopener noreferrer">
                            Résumé <span className="arr">→</span>
                        </a>
                    </aside>
                </div>
            </div>
        </section>
    );
};

export default About;
