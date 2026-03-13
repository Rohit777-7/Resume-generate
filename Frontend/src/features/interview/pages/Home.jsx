import React, { useState, useRef } from "react"
import "../../style/home.scss"
import { useInterview } from "../hooks/useInterview.js"
import { useNavigate } from "react-router-dom"

const Home = () => {

    const { loading, generateReport, reports } = useInterview()

    const [jobDescription, setJobDescription] = useState("")
    const [selfDescription, setSelfDescription] = useState("")

    const resumeInputRef = useRef()

    const navigate = useNavigate()


    const handleGenerateReport = async () => {

        const resumeFile = resumeInputRef.current?.files?.[0]

        if (!jobDescription) {
            alert("Job description is required")
            return
        }

        if (!resumeFile && !selfDescription) {
            alert("Upload a resume or write self description")
            return
        }

        const data = await generateReport({
            jobDescription,
            selfDescription,
            resumeFile
        })

        if (!data || !data._id) {
            alert("Failed to generate interview report")
            return
        }

        navigate(`/interview/${data._id}`)
    }


    if (loading) {
        return (
            <main className="loading-screen">
                <h1>Loading your interview plan...</h1>
            </main>
        )
    }


    return (
        <div className="home-page">

            {/* Page Header */}
            <header className="page-header">
                <h1>Create Your Custom <span className="highlight">Interview Plan</span></h1>
                <p>Let our AI analyze the job requirements and your unique profile to build a winning strategy.</p>
            </header>


            {/* Main Card */}
            <div className="interview-card">
                <div className="interview-card__body">


                    {/* Left Panel */}
                    <div className="panel panel--left">
                        <div className="panel__header">
                            <h2>Target Job Description</h2>
                        </div>

                        <textarea
                            onChange={(e) => setJobDescription(e.target.value)}
                            className="panel__textarea"
                            placeholder="Paste the full job description here..."
                            maxLength={5000}
                        />

                        <div className="char-counter">
                            {jobDescription.length} / 5000 chars
                        </div>
                    </div>


                    {/* Divider */}
                    <div className="panel-divider" />


                    {/* Right Panel */}
                    <div className="panel panel--right">

                        <div className="panel__header">
                            <h2>Your Profile</h2>
                        </div>


                        {/* Upload Resume */}
                        <div className="upload-section">

                            <label className="section-label">
                                Upload Resume
                            </label>

                            <label className="dropzone" htmlFor="resume">

                                <p className="dropzone__title">
                                    Click to upload or drag & drop
                                </p>

                                <p className="dropzone__subtitle">
                                    PDF or DOCX (Max 5MB)
                                </p>

                                <input
                                    ref={resumeInputRef}
                                    hidden
                                    type="file"
                                    id="resume"
                                    name="resume"
                                    accept=".pdf,.docx"
                                />

                            </label>

                        </div>


                        <div className="or-divider">
                            <span>OR</span>
                        </div>


                        {/* Self Description */}
                        <div className="self-description">

                            <label className="section-label">
                                Quick Self Description
                            </label>

                            <textarea
                                onChange={(e) => setSelfDescription(e.target.value)}
                                className="panel__textarea panel__textarea--short"
                                placeholder="Briefly describe your experience..."
                            />

                        </div>


                        {/* Info */}
                        <div className="info-box">
                            <p>
                                Either a <strong>Resume</strong> or a <strong>Self Description</strong> is required.
                            </p>
                        </div>

                    </div>

                </div>


                {/* Footer */}
                <div className="interview-card__footer">

                    <span className="footer-info">
                        AI-Powered Strategy Generation • Approx 30s
                    </span>

                    <button
                        onClick={handleGenerateReport}
                        className="generate-btn"
                    >
                        Generate My Interview Strategy
                    </button>

                </div>
            </div>



            {/* Recent Reports */}
            {reports?.length > 0 && (

                <section className="recent-reports">

                    <h2>My Recent Interview Plans</h2>

                    <ul className="reports-list">

                        {reports.map(report => (

                            <li
                                key={report._id}
                                className="report-item"
                                onClick={() => navigate(`/interview/${report._id}`)}
                            >

                                <h3>{report.title || "Untitled Position"}</h3>

                                <p className="report-meta">
                                    Generated on {new Date(report.createdAt).toLocaleDateString()}
                                </p>

                                <p className="match-score">
                                    Match Score: {report.matchScore}%
                                </p>

                            </li>

                        ))}

                    </ul>

                </section>

            )}


            {/* Footer */}
            <footer className="page-footer">
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Service</a>
                <a href="#">Help Center</a>
            </footer>

        </div>
    )
}

export default Home