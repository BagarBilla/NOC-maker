import React, { useState } from 'react';
import './App.css';

const template = `
This is to certify that <strong>[name]</strong>, [childOf] <strong>[fathers name]</strong>, bearing <strong>Registration Number [registration no]</strong>. is a bona fide student of Srinath University, Jamshedpur. [HeShe] is currently enrolled in the <strong>[sem]</strong> of the <strong>[course name]</strong>[specialisationSection], as part of the Academic Batch: <strong>[academic batch]</strong>.<br /><br />
The university has no objection to [pronoun] undertaking a summer internship at <strong>[company name]</strong>, <strong>[company address]</strong>. The internship is scheduled to take place from <strong>[internshipDuration]</strong>.<br /><br />
This certificate is issued upon request for official purposes.`;

const courseOptions = {
    BBA: {
        courseName: "Bachelor of Business Administration (BBA)",
        academicBatch: "2023-2026",
        showSpecialisation: true,
        internshipDuration: "16th June 2025 to 16th August 2025",
        sem: "Fourth Semester"
    },
    BCA: {
        courseName: "Bachelor of Computer Applications (BCA)",
        academicBatch: "2023-2026",
        showSpecialisation: false,
        internshipDuration: "15th June 2025 to 15th September 2025",
        sem: "Fourth Semester"
    },
    BCOM: {
        courseName: "Bachelor of Commerce (B.COM)",
        academicBatch: "2023-2026",
        showSpecialisation: true,
        internshipDuration: "15th June 2025 to 15th August 2025",
        sem: "Fourth Semester"
    },
    BTECH: {
        courseName: "Bachelor of Technology (BTECH)",
        academicBatch: "2022-2026",
        showSpecialisation: true,
        internshipDuration: "1st August 2025 to 1st October 2025",
        sem: "Sixth Semester"
    },
    MCA: {
        courseName: "Master of Computer Applications (MCA)",
        academicBatch: "2023-2026",
        showSpecialisation: false,
        internshipDuration: "16th June 2025 to 16th September 2025",
        sem: "Second Semester",
    },
    MBA: {
        courseName: "Master of Business Administration (MBA)",
        academicBatch: "2024-2026",
        showSpecialisation: true,
        internshipDuration: "16th June 2025 to 16th August 2025",
        sem: "Second Semester"
    },
    DIPLOMA: {
        courseName: "Diploma",
        academicBatch: "2023-2026",
        showSpecialisation: true,
        internshipDuration: "1st August 2025 to 1st October 2025",
        sem: "Fourth Semester"
    }
};

// Helper function to convert to Title Case
function toTitleCase(str) {
    return str.replace(/\w\S*/g, (txt) =>
        txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
}

function App() {
    const [form, setForm] = useState({
        name: '',
        fathersName: '',
        registrationNo: '',
        courseName: '',
        specialisation: '',
        academicBatch: '',
        companyName: '',
        companyAddress: ''
    });
    const [selectedCourse, setSelectedCourse] = useState('');
    const [gender, setGender] = useState('male');

    // Only auto-title-case fields except specialisation
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'specialisation') {
            setForm({ ...form, [name]: value });
        } else {
            setForm({ ...form, [name]: toTitleCase(value) });
        }
    };

    const handleCourseSelect = (courseKey) => {
        const course = courseOptions[courseKey];
        setSelectedCourse(courseKey);
        setForm((prev) => ({
            ...prev,
            courseName: course.courseName,
            academicBatch: course.academicBatch,
            specialisation: '' // reset specialisation on course change
        }));
    };

    // Gender-specific replacements
    const childOf = gender === 'male' ? 'son of' : 'daughter of';
    const pronoun = gender === 'male' ? 'his' : 'her';
    const heShe = gender === 'male' ? 'He' : 'She';

    // Specialisation section logic
    let specialisationSection = '';
    if (selectedCourse && courseOptions[selectedCourse].showSpecialisation) {
        specialisationSection = ` specialisation: <strong>${form.specialisation || '[specialisation]'}</strong>`;
    }

    // Internship duration logic
    const internshipDuration =
        (selectedCourse && courseOptions[selectedCourse].internshipDuration) ||
        "15th June 2025 to 15th August 2025";

    // Semester logic
    const semister =
        (selectedCourse && courseOptions[selectedCourse].sem) ||
        "[sem]";

    let filledTemplate = template
        .replace('[name]', form.name || '[name]')
        .replace('[fathers name]', form.fathersName || '[fathers name]')
        .replace('[registration no]', form.registrationNo || '[registration no]')
        .replace('[course name]', form.courseName || '[course name]')
        .replace('[academic batch]', form.academicBatch || '[academic batch]')
        .replace('[company name]', form.companyName || '[company name]')
        .replace('[company address]', form.companyAddress || '[company address]')
        .replace('[childOf]', childOf)
        .replace('[pronoun]', pronoun)
        .replace('[HeShe]', heShe)
        .replace('[specialisationSection]', specialisationSection)
        .replace('[internshipDuration]', internshipDuration)
        .replace('[sem]', semister);

    // Copy as HTML (preserves bold when pasting into Word)
    const handleCopy = () => {
        const html = filledTemplate;
        const plainText = filledTemplate
            .replace(/<br\s*\/?>/gi, '\n')
            .replace(/<strong>/g, '')
            .replace(/<\/strong>/g, '');
        if (navigator.clipboard && window.ClipboardItem) {
            const blobHtml = new Blob([html], { type: 'text/html' });
            const blobText = new Blob([plainText], { type: 'text/plain' });
            const data = {
                'text/html': blobHtml,
                'text/plain': blobText,
            };
            navigator.clipboard.write([new window.ClipboardItem(data)]);
        } else {
            navigator.clipboard.writeText(plainText);
        }
    };

    return (
        <div className="container">
            <h1>NOC Certificate Editor</h1>
            <div className="gender-buttons" style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '16px' }}>
                <button
                    type="button"
                    className={gender === 'male' ? 'selected' : ''}
                    onClick={() => setGender('male')}
                >
                    Male
                </button>
                <button
                    type="button"
                    className={gender === 'female' ? 'selected' : ''}
                    onClick={() => setGender('female')}
                >
                    Female
                </button>
            </div>
            <div className="course-buttons">
                {Object.keys(courseOptions).map((key) => (
                    <button
                        key={key}
                        type="button"
                        className={selectedCourse === key ? 'selected' : ''}
                        onClick={() => handleCourseSelect(key)}
                    >
                        {key}
                    </button>
                ))}
            </div>
            <div className="flex-row">
                <div className="form-section">
                    <form className="form">
                        <label>
                            Name:
                            <input type="text" name="name" value={form.name} onChange={handleChange} />
                        </label>
                        <label>
                            Father's Name:
                            <input type="text" name="fathersName" value={form.fathersName} onChange={handleChange} />
                        </label>
                        <label>
                            Registration No:
                            <input type="text" name="registrationNo" value={form.registrationNo} onChange={handleChange} />
                        </label>
                        <label>
                            Course Name:
                            <input type="text" name="courseName" value={form.courseName} readOnly />
                        </label>
                        {selectedCourse && courseOptions[selectedCourse].showSpecialisation && (
                            <label>
                                Specialisation:
                                <input type="text" name="specialisation" value={form.specialisation} onChange={handleChange} />
                            </label>
                        )}
                        <label>
                            Academic Batch:
                            <input type="text" name="academicBatch" value={form.academicBatch} readOnly />
                        </label>
                        <label>
                            Company Name:
                            <input type="text" name="companyName" value={form.companyName} onChange={handleChange} />
                        </label>
                        <label>
                            Company Address:
                            <input type="text" name="companyAddress" value={form.companyAddress} onChange={handleChange} />
                        </label>
                    </form>
                    <button className="copy-btn" onClick={handleCopy}>Copy Certificate</button>
                </div>
                <div className="preview-section">
                    <h2>Preview</h2>
                    <pre className="document-box" style={{fontFamily: "'Consolas', 'Courier New', monospace"}}>
                        <span dangerouslySetInnerHTML={{ __html: filledTemplate }} />
                    </pre>
                </div>
            </div>
        </div>
    );
}

export default App;