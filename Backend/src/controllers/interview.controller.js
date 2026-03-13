const pdfParse = require("pdf-parse")
const { generateInterviewReport, generateResumePdf } = require("../services/ai.services")
const interviewReportModel = require("../models/interviewReport.model")

/**
 * Safely parse PDF buffer
 */
async function parsePdfBuffer(buffer) {
    try {
        const result = await pdfParse(buffer);
        return result.text || "";
    } catch (error) {
        console.warn("PDF parsing failed:", error.message);
        return "Resume content could not be parsed";
    }
}

/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */
async function generateInterViewReportController(req, res) {
    try {
        let resumeText = ""

        // If resume uploaded, parse it
        if (req.file) {
            resumeText = await parsePdfBuffer(req.file.buffer)
        }

        const { selfDescription, jobDescription } = req.body

        if (!req.user) {
            return res.status(401).json({
                message: "User not authenticated"
            })
        }

        // Require at least resume OR self description
        if (!resumeText && !selfDescription) {
            return res.status(400).json({
                message: "Either resume or self description is required"
            })
        }

        const interViewReportByAi = await generateInterviewReport({
            resume: resumeText,
            selfDescription,
            jobDescription
        })

        console.log("Generated report data:", JSON.stringify(interViewReportByAi, null, 2))
        console.log("Technical Questions:", interViewReportByAi.technicalQuestions)
        console.log("Behavioral Questions:", interViewReportByAi.behavioralQuestions)
        console.log("Skill Gaps:", interViewReportByAi.skillGaps)
        console.log("Preparation Plan:", interViewReportByAi.preparationPlan)

        // Validate the data
        if (!interViewReportByAi) {
            throw new Error("Failed to generate interview report")
        }

        const interviewReport = await interviewReportModel.create({
            user: req.user._id,
            resume: resumeText,
            selfDescription,
            jobDescription,
            matchScore: interViewReportByAi.matchScore || 0,
            title: interViewReportByAi.title || "Interview Preparation Plan",
            technicalQuestions: Array.isArray(interViewReportByAi.technicalQuestions) ? interViewReportByAi.technicalQuestions : [],
            behavioralQuestions: Array.isArray(interViewReportByAi.behavioralQuestions) ? interViewReportByAi.behavioralQuestions : [],
            skillGaps: Array.isArray(interViewReportByAi.skillGaps) ? interViewReportByAi.skillGaps : [],
            preparationPlan: Array.isArray(interViewReportByAi.preparationPlan) ? interViewReportByAi.preparationPlan : []
        })

        res.status(201).json({
            message: "Interview report generated successfully.",
            interviewReport
        })
    } catch (error) {
        console.error("Error generating interview report:", error)
        res.status(500).json({
            message: "Error generating interview report",
            error: error.message
        })
    }
}

/**
 * @description Controller to get interview report by interviewId.
 */
async function getInterviewReportByIdController(req, res) {
    try {
        const { interviewId } = req.params

        const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user._id })

        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found."
            })
        }

        res.status(200).json({
            message: "Interview report fetched successfully.",
            interviewReport
        })
    } catch (error) {
        console.error("Error fetching interview report:", error)
        res.status(500).json({
            message: "Error fetching interview report",
            error: error.message
        })
    }
}


/** 
 * @description Controller to get all interview reports of logged in user.
 */
async function getAllInterviewReportsController(req, res) {
    try {
        const interviewReports = await interviewReportModel.find({ user: req.user._id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

        res.status(200).json({
            message: "Interview reports fetched successfully.",
            interviewReports
        })
    } catch (error) {
        console.error("Error fetching interview reports:", error)
        res.status(500).json({
            message: "Error fetching interview reports",
            error: error.message
        })
    }
}


/**
 * @description Controller to generate resume PDF based on user self description, resume and job description.
 */
async function generateResumePdfController(req, res) {
    try {
        const { interviewReportId } = req.params

        const interviewReport = await interviewReportModel.findById(interviewReportId)

        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found."
            })
        }

        const { resume, jobDescription, selfDescription } = interviewReport

        const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription })

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
        })

        res.send(pdfBuffer)
    } catch (error) {
        console.error("Error generating resume PDF:", error)
        res.status(500).json({
            message: "Error generating resume PDF",
            error: error.message
        })
    }
}

module.exports = { generateInterViewReportController, getInterviewReportByIdController, getAllInterviewReportsController, generateResumePdfController }