// Global data storage
let lifeData = null;

// Load life data on page load
document.addEventListener('DOMContentLoaded', async () => {
    await loadLifeData();
    populatePage();
    updateCopyright();
    
    // Add smooth scroll behavior
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
});

// Load my_life.json data
async function loadLifeData() {
    try {
        const response = await fetch('my_life.json');
        if (!response.ok) {
            throw new Error('Failed to load life data');
        }
        lifeData = await response.json();
    } catch (error) {
        console.error('Error loading life data:', error);
        // Fallback data structure
        lifeData = {
            technical_skills: {},
            career_timeline: [],
            identity: {}
        };
    }
}

// Populate page with data
function populatePage() {
    if (!lifeData) return;
    
    populateSkills();
    populateExperience();
    populateEducation();
}

// Populate skills section
function populateSkills() {
    if (!lifeData.technical_skills) return;
    
    const skills = lifeData.technical_skills;
    
    // Languages
    const languagesList = document.getElementById('languages-list');
    if (languagesList && skills.languages) {
        skills.languages.forEach(lang => {
            const li = document.createElement('li');
            li.textContent = lang;
            languagesList.appendChild(li);
        });
    }
    
    // Backend frameworks
    const backendList = document.getElementById('backend-list');
    if (backendList && skills.backend_frameworks) {
        skills.backend_frameworks.forEach(framework => {
            const li = document.createElement('li');
            li.textContent = framework;
            backendList.appendChild(li);
        });
    }
    
    // Databases
    const databasesList = document.getElementById('databases-list');
    if (databasesList && skills.databases) {
        skills.databases.forEach(db => {
            const li = document.createElement('li');
            li.textContent = db;
            databasesList.appendChild(li);
        });
    }
    
    // Cloud and tools combined
    const cloudList = document.getElementById('cloud-list');
    if (cloudList) {
        const allItems = [];
        if (skills.cloud) allItems.push(...skills.cloud);
        if (skills.tools) allItems.push(...skills.tools);
        allItems.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            cloudList.appendChild(li);
        });
    }
}

// Populate experience section
function populateExperience() {
    if (!lifeData.career_timeline) return;
    
    const timeline = document.getElementById('experience-timeline');
    if (!timeline) return;
    
    // Filter for professional experience (exclude pure education)
    const experience = lifeData.career_timeline.filter(item => {
        const role = item.role.toLowerCase();
        return !role.includes('student') || role.includes('assistant');
    });
    
    experience.forEach(item => {
        const div = document.createElement('div');
        div.className = 'timeline-item';
        div.innerHTML = `
            <div class="timeline-header">
                <div>
                    <div class="timeline-org">${escapeHtml(item.organization)}</div>
                    <div class="timeline-role">${escapeHtml(item.role)}</div>
                </div>
                <div class="timeline-period">${escapeHtml(item.period)}</div>
            </div>
            <div class="timeline-details">${escapeHtml(item.details)}</div>
        `;
        timeline.appendChild(div);
    });
}

// Populate education section
function populateEducation() {
    if (!lifeData.career_timeline) return;
    
    const timeline = document.getElementById('education-timeline');
    if (!timeline) return;
    
    // Filter for education
    const education = lifeData.career_timeline.filter(item => {
        const role = item.role.toLowerCase();
        return role.includes('student') && !role.includes('assistant');
    });
    
    education.forEach(item => {
        const div = document.createElement('div');
        div.className = 'timeline-item';
        div.innerHTML = `
            <div class="timeline-header">
                <div>
                    <div class="timeline-org">${escapeHtml(item.organization)}</div>
                    <div class="timeline-role">${escapeHtml(item.role)}</div>
                </div>
                <div class="timeline-period">${escapeHtml(item.period)}</div>
            </div>
            <div class="timeline-details">${escapeHtml(item.details)}</div>
        `;
        timeline.appendChild(div);
    });
}

// Scroll to section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const headerOffset = 80;
        const elementPosition = section.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

// Open AI popup
function openAIPopup() {
    const popup = document.getElementById('ai-popup');
    if (popup) {
        popup.classList.add('show');
        popup.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }
}

// Close AI popup
function closeAIPopup() {
    const popup = document.getElementById('ai-popup');
    if (popup) {
        popup.classList.remove('show');
        popup.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        // Clear response
        const response = document.getElementById('ai-response');
        if (response) {
            response.classList.remove('show');
            response.innerHTML = '';
        }
    }
}

// Close popup on overlay click
document.addEventListener('DOMContentLoaded', () => {
    const popup = document.getElementById('ai-popup');
    if (popup) {
        popup.addEventListener('click', (e) => {
            if (e.target === popup) {
                closeAIPopup();
            }
        });
    }
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAIPopup();
        }
    });
});

// Ask question (from suggested or custom)
function askQuestion(question) {
    if (!lifeData) {
        showAIResponse('Error: Life data not loaded. Please refresh the page.');
        return;
    }
    
    const response = generateAIResponse(question);
    showAIResponse(response);
}

// Ask custom question
function askCustomQuestion() {
    const input = document.getElementById('custom-question-input');
    if (!input || !input.value.trim()) {
        return;
    }
    
    askQuestion(input.value.trim());
    input.value = '';
}

// Generate AI response based on life data
function generateAIResponse(question) {
    if (!lifeData) {
        return 'I apologize, but I cannot access Nathan\'s information at this time.';
    }
    
    const q = question.toLowerCase();
    let response = '';
    
    // Professional background
    if (q.includes('background') || q.includes('experience') || q.includes('history')) {
        response = `Nathan Allen is a Python backend developer with over 20 years of technical experience. `;
        response += `His background spans IT support, software development, databases, and cloud-based systems. `;
        response += `He has production experience building and maintaining FastAPI applications, SQL-backed services, and AWS ETL pipelines. `;
        response += `Currently, he works as Owner/Technical Consultant at Allen Data Services, providing IT support and technical consulting. `;
        response += `Previously, he worked as a Developer at Directions Research where he migrated Jupyter workflows into FastAPI services, troubleshot databases, and wrote Pytest test suites.`;
    }
    // Core strengths
    else if (q.includes('strength') || q.includes('skill') || q.includes('expertise') || q.includes('good at')) {
        response = `Nathan's core strengths include:\n\n`;
        if (lifeData.core_strengths) {
            lifeData.core_strengths.forEach((strength, index) => {
                response += `${index + 1}. ${strength}\n`;
            });
        }
        response += `\nHe emphasizes Python backend development, debugging, system reliability, and has real production experience.`;
    }
    // Technologies
    else if (q.includes('technolog') || q.includes('tech stack') || q.includes('tools') || q.includes('language') || q.includes('framework')) {
        response = `Nathan works with the following technologies:\n\n`;
        if (lifeData.technical_skills) {
            const skills = lifeData.technical_skills;
            if (skills.languages) {
                response += `Languages: ${skills.languages.join(', ')}\n`;
            }
            if (skills.backend_frameworks) {
                response += `Backend Frameworks: ${skills.backend_frameworks.join(', ')}\n`;
            }
            if (skills.databases) {
                response += `Databases: ${skills.databases.join(', ')}\n`;
            }
            if (skills.cloud) {
                response += `Cloud: ${skills.cloud.join(', ')}\n`;
            }
            if (skills.tools) {
                response += `Tools: ${skills.tools.join(', ')}\n`;
            }
        }
    }
    // What looking for / role / position
    else if (q.includes('looking for') || q.includes('seeking') || q.includes('want') || q.includes('role') || q.includes('position')) {
        response = `Nathan is seeking a junior-to-mid-level Python backend developer role. `;
        if (lifeData.identity && lifeData.identity.target_roles) {
            response += `Specifically, he's interested in positions as a ${lifeData.identity.target_roles.join(' or ')}. `;
        }
        response += `He's looking for opportunities with solid engineering practices where he can continue to grow. `;
        response += `He values maintainability, clarity, and system reliability in his work. `;
        if (lifeData.identity && lifeData.identity.open_to_remote) {
            response += `He is open to remote work and is located in Mobile, Alabama, USA.`;
        }
    }
    // Work style / values
    else if (q.includes('work style') || q.includes('approach') || q.includes('values') || q.includes('philosophy')) {
        if (lifeData.work_style_and_values) {
            response = `Nathan's work style is methodical, calm, and correctness-focused. `;
            response += `His priorities are: ${lifeData.work_style_and_values.priorities.join(', ')}. `;
            response += `His communication style is ${lifeData.work_style_and_values.communication_style}. `;
            response += `He believes that "${lifeData.work_style_and_values.beliefs}".`;
        }
    }
    // Education
    else if (q.includes('education') || q.includes('degree') || q.includes('school')) {
        response = `Nathan has a diverse educational background:\n\n`;
        if (lifeData.career_timeline) {
            const education = lifeData.career_timeline.filter(item => 
                item.role.toLowerCase().includes('student')
            );
            education.forEach(item => {
                response += `${item.period}: ${item.details} (${item.organization})\n`;
            });
        }
    }
    // Default response
    else {
        response = `Based on Nathan's profile: `;
        response += lifeData.professional_summary || 'Nathan is a Python backend developer with extensive technical experience.';
        response += `\n\nYou can ask about his background, strengths, technologies, what he's looking for, work style, or education.`;
    }
    
    return response;
}

// Show AI response
function showAIResponse(text) {
    const responseDiv = document.getElementById('ai-response');
    if (responseDiv) {
        responseDiv.innerHTML = `<h4>Response:</h4><pre>${escapeHtml(text)}</pre>`;
        responseDiv.classList.add('show');
        responseDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

// Analyze job match
function analyzeJobMatch() {
    const textarea = document.getElementById('job-description');
    const resultsDiv = document.getElementById('match-results');
    
    if (!textarea || !textarea.value.trim()) {
        alert('Please paste a job description first.');
        return;
    }
    
    if (!lifeData) {
        resultsDiv.innerHTML = '<p>Error: Life data not loaded. Please refresh the page.</p>';
        resultsDiv.classList.add('show');
        return;
    }
    
    const jobDescription = textarea.value.toLowerCase();
    const analysis = performJobMatchAnalysis(jobDescription);
    
    let html = `<h3>Match Analysis</h3>`;
    html += `<div class="match-score">${analysis.score}</div>`;
    html += `<p>${analysis.summary}</p>`;
    
    if (analysis.matchingSkills.length > 0) {
        html += `<div class="match-highlights"><h4>Matching Skills:</h4>`;
        analysis.matchingSkills.forEach(skill => {
            html += `<div class="highlight-item">✓ ${escapeHtml(skill)}</div>`;
        });
        html += `</div>`;
    }
    
    if (analysis.matchingGoals.length > 0) {
        html += `<div class="match-highlights"><h4>Matching Goals:</h4>`;
        analysis.matchingGoals.forEach(goal => {
            html += `<div class="highlight-item">✓ ${escapeHtml(goal)}</div>`;
        });
        html += `</div>`;
    }
    
    if (analysis.gaps.length > 0) {
        html += `<div class="match-highlights"><h4>Potential Gaps:</h4>`;
        analysis.gaps.forEach(gap => {
            html += `<div class="highlight-item">⚠ ${escapeHtml(gap)}</div>`;
        });
        html += `</div>`;
    }
    
    resultsDiv.innerHTML = html;
    resultsDiv.classList.add('show');
    resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Perform job match analysis
function performJobMatchAnalysis(jobDesc) {
    const matchingSkills = [];
    const matchingGoals = [];
    const gaps = [];
    
    // Check for matching skills
    if (lifeData.technical_skills) {
        const allSkills = [
            ...(lifeData.technical_skills.languages || []),
            ...(lifeData.technical_skills.backend_frameworks || []),
            ...(lifeData.technical_skills.databases || []),
            ...(lifeData.technical_skills.cloud || []),
            ...(lifeData.technical_skills.tools || [])
        ];
        
        allSkills.forEach(skill => {
            if (jobDesc.includes(skill.toLowerCase())) {
                matchingSkills.push(skill);
            }
        });
    }
    
    // Check for Python specifically
    if (jobDesc.includes('python') && !matchingSkills.includes('Python')) {
        matchingSkills.push('Python');
    }
    
    // Check for backend development
    if (jobDesc.includes('backend') || jobDesc.includes('api') || jobDesc.includes('rest')) {
        matchingGoals.push('Backend development focus');
    }
    
    // Check for junior/mid level
    if (jobDesc.includes('junior') || jobDesc.includes('mid') || jobDesc.includes('mid-level')) {
        matchingGoals.push('Appropriate seniority level');
    }
    
    // Check for remote work
    if (jobDesc.includes('remote') && lifeData.identity && lifeData.identity.open_to_remote) {
        matchingGoals.push('Remote work option');
    }
    
    // Check for potential gaps
    if (jobDesc.includes('senior') && !jobDesc.includes('junior') && !jobDesc.includes('mid')) {
        gaps.push('Position may require senior-level experience');
    }
    
    if (jobDesc.includes('frontend') && !jobDesc.includes('backend')) {
        gaps.push('Position may be frontend-focused (Nathan\'s strength is backend)');
    }
    
    if (jobDesc.includes('react') || jobDesc.includes('angular') || jobDesc.includes('vue')) {
        if (!jobDesc.includes('backend') && !jobDesc.includes('full stack')) {
            gaps.push('Position may require more frontend expertise than Nathan\'s primary focus');
        }
    }
    
    // Calculate match score
    const skillMatchRatio = matchingSkills.length / Math.max(1, (lifeData.technical_skills ? 
        Object.values(lifeData.technical_skills).flat().length : 10));
    const goalMatchCount = matchingGoals.length;
    const gapPenalty = gaps.length * 0.1;
    
    let scorePercentage = Math.min(100, Math.round((skillMatchRatio * 60 + goalMatchCount * 20 - gapPenalty * 20)));
    scorePercentage = Math.max(0, scorePercentage);
    
    let scoreText = '';
    if (scorePercentage >= 80) {
        scoreText = `STRONG MATCH (${scorePercentage}%)`;
    } else if (scorePercentage >= 60) {
        scoreText = `GOOD MATCH (${scorePercentage}%)`;
    } else if (scorePercentage >= 40) {
        scoreText = `MODERATE MATCH (${scorePercentage}%)`;
    } else {
        scoreText = `LOW MATCH (${scorePercentage}%)`;
    }
    
    let summary = '';
    if (matchingSkills.length > 0) {
        summary += `Nathan has ${matchingSkills.length} matching technical skill(s). `;
    }
    if (matchingGoals.length > 0) {
        summary += `The position aligns with ${matchingGoals.length} of Nathan's goals. `;
    }
    if (gaps.length > 0) {
        summary += `There are ${gaps.length} potential gap(s) to consider.`;
    }
    if (!summary) {
        summary = 'Limited match found. Review the job requirements carefully.';
    }
    
    return {
        score: scoreText,
        summary: summary,
        matchingSkills: matchingSkills,
        matchingGoals: matchingGoals,
        gaps: gaps
    };
}

// Update copyright year
function updateCopyright() {
    const copyrightEl = document.getElementById('copyright');
    if (copyrightEl) {
        const year = new Date().getFullYear();
        copyrightEl.textContent = `© ${year} Jerome Nathan Allen. All rights reserved.`;
    }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
