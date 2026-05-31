import React, { useMemo, useState } from "react";
import "./Timeline.css";
import { work } from "../../assets/files/WorkDetails.js";
import { education } from "../../assets/files/EducationDetails.js";
import useInView from "../../hooks/useInView";

const MONTH_MAP = {
    january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
    july: 6, august: 7, september: 8, october: 9, november: 10, december: 11,
    jan: 0, feb: 1, mar: 2, apr: 3, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
};

const parseStartDate = (timeStr) => {
    const clean = timeStr.split("·")[0].split("-")[0].trim();
    const parts = clean.split(/\s+/);
    if (parts.length >= 2) {
        const month = MONTH_MAP[parts[0].toLowerCase()] ?? 0;
        const year = parseInt(parts[1], 10);
        return new Date(year, month);
    }
    return new Date(0);
};

// "April 2023 - June 2024" -> "2023–24"; "Apr 2026 - Present" -> "2026–"
const formatRange = (timeStr) => {
    const base = timeStr.split("·")[0].trim();
    const segs = base.split("-").map((s) => s.trim());
    const yearOf = (s) => {
        const m = s.match(/\b(19|20)\d{2}\b/);
        return m ? m[0] : (/present|now|current/i.test(s) ? "" : "");
    };
    const start = yearOf(segs[0]);
    const end = segs[1] ? yearOf(segs[1]) : start;
    if (!start) return base;
    if (!end) return `${start}–`;
    if (end === start) return start;
    return `${start}–${end.slice(2)}`;
};

const XpRow = ({ item, index, expanded, onToggle }) => {
    const [ref, inView] = useInView();

    return (
        <div
            ref={ref}
            className={`xp-row rev ${inView ? "in" : ""} ${expanded ? "open" : ""}`}
            style={{ transitionDelay: `${index * 70}ms` }}
            onClick={onToggle}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onToggle(); } }}
            role="button"
            tabIndex={0}
            aria-expanded={expanded}
        >
            <div className="xp-year">{item.range}</div>

            <div className="xp-main">
                <h3>{item.title}</h3>
                <div className="xp-org">{item.org}</div>

                <div className="xp-detail">
                    <p className="xp-loc">{item.time}{item.location ? ` · ${item.location}` : ""}</p>
                    {item.summary && item.summary.split("\n").map((line, i) => (
                        <p key={i}>{line}</p>
                    ))}
                    {item.coursework && (
                        <div className="xp-course">
                            {item.coursework.map((c, i) => (
                                <span className="tag" key={i}>{c}</span>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="xp-kind">
                {item.kind}
                <span className="xp-chevron">↓</span>
            </div>
        </div>
    );
};

const Timeline = () => {
    const [expandedIndex, setExpandedIndex] = useState(null);

    const items = useMemo(() => {
        const workItems = work.map((w) => ({
            kind: "Work",
            range: formatRange(w.time),
            title: w.role,
            org: w.name,
            time: w.time,
            location: w.location,
            summary: w.summary,
            sortDate: parseStartDate(w.time),
        }));

        const eduItems = education.map((e) => ({
            kind: "Education",
            range: formatRange(e.time),
            title: e.degree,
            org: e.name,
            time: e.time,
            location: e.location,
            coursework: e.coursework,
            sortDate: parseStartDate(e.time),
        }));

        return [...workItems, ...eduItems].sort((a, b) => b.sortDate - a.sortDate);
    }, []);

    const toggle = (i) => setExpandedIndex(expandedIndex === i ? null : i);

    return (
        <section id="timeline" className="ed-section">
            <div className="wrap">
                <div className="sec-head">
                    <h2>Experience</h2>
                    <span className="idx">02 / 06</span>
                </div>
                <div className="xp-list">
                    {items.map((item, index) => (
                        <XpRow
                            key={index}
                            item={item}
                            index={index}
                            expanded={expandedIndex === index}
                            onToggle={() => toggle(index)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Timeline;
