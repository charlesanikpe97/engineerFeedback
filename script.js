    document.addEventListener('DOMContentLoaded', function() {
        // Sample feedback data with more varied dates and types
        const feedbackData = [
            {
                id: 1,
                type: 'positive',
                customer: 'John D.',
                message: 'Engineer was very helpful and resolved my issue quickly',
                timestamp: '2024-01-15 14:30',
                engineer: 'Charles Anikpe'
            },
            {
                id: 2,
                type: 'negative',
                customer: 'Sarah M.',
                message: 'Long wait time and issue wasn\'t fully resolved',
                timestamp: '2024-01-15 15:45',
                engineer: 'Charles Anikpe'
            },
            {
                id: 3,
                type: 'uncontrollable',
                customer: 'Mike R.',
                message: 'Chat closed due to inactivity',
                timestamp: '2023-12-20 16:20',
                engineer: 'Charles Anikpe'
            },
            {
                id: 4,
                type: 'positive',
                customer: 'Emma W.',
                message: 'Excellent support, very knowledgeable',
                timestamp: '2023-12-15 09:30',
                engineer: 'Charles Anikpe'
            },
            {
                id: 5,
                type: 'negative',
                customer: 'Tom H.',
                message: 'Resolution took too long',
                timestamp: '2023-11-10 11:20',
                engineer: 'Charles Anikpe'
            },
            {
                id: 6,
                type: 'uncontrollable',
                customer: 'Lisa P.',
                message: 'Customer disconnected during troubleshooting',
                timestamp: '2024-01-14 13:15',
                engineer: 'Charles Anikpe'
            },
            {
                id: 7,
                type: 'positive',
                customer: 'Alex M.',
                message: 'Great experience, issue resolved quickly',
                timestamp: '2024-01-13 16:45',
                engineer: 'Charles Anikpe'
            }
        ];
    
        // Function to organize feedback by date 
        function organizeFeedbackByDate(feedbackArray) {
            const organized = {};
            
            feedbackArray.forEach(feedback => {
                const date = new Date(feedback.timestamp);
                const year = date.getFullYear();
                const month = date.toLocaleString('default', { month: 'long' });
                const day = date.getDate();
    
                if (!organized[year]) {
                    organized[year] = {};
                }
                if (!organized[year][month]) {
                    organized[year][month] = {};
                }
                if (!organized[year][month][day]) {
                    organized[year][month][day] = [];
                }
                
                organized[year][month][day].push(feedback);
            });
    
            return organized;
        }
    
        // Function to render feedback vy it's date 
        function renderFeedback(filter = 'all') {
            const container = document.getElementById('feedback-container');
            container.innerHTML = '';
    
            // Filter feedback data based on selected type
            const filteredData = filter === 'all' 
                ? feedbackData 
                : feedbackData.filter(feedback => feedback.type === filter);
    
            const organizedFeedback = organizeFeedbackByDate(filteredData);
    
            // If no feedback show a message
            if (Object.keys(organizedFeedback).length === 0) {
                container.innerHTML = `
                    <div class="no-feedback">
                        No ${filter} feedback found
                    </div>
                `;
                return;
            }
    
            // Sort years in descending order
            Object.keys(organizedFeedback)
                .sort((a, b) => b - a)
                .forEach(year => {
                    const yearSection = document.createElement('div');
                    yearSection.className = 'year-section';
                    
                    // Count feedback items in this year
                    const yearCount = Object.values(organizedFeedback[year])
                        .flatMap(month => Object.values(month))
                        .flatMap(day => day).length;
                    
                    const yearHeader = document.createElement('div');
                    yearHeader.className = 'year-header';
                    yearHeader.innerHTML = `
                        <h3>${year} <span class="count">(${yearCount})</span></h3>
                        <span class="toggle-btn">▼</span>
                    `;
                    yearSection.appendChild(yearHeader);
    
                    const yearContent = document.createElement('div');
                    yearContent.className = 'year-content';
    
                    // Sort months in reverse chronological order
                    const months = Object.keys(organizedFeedback[year]);
                    months.sort((a, b) => {
                        return new Date(`${b} 1`).getTime() - new Date(`${a} 1`).getTime();
                    });
    
                    months.forEach(month => {
                        const monthSection = document.createElement('div');
                        monthSection.className = 'month-section';
                        
                        // Count feedback items in this month
                        const monthCount = Object.values(organizedFeedback[year][month])
                            .flatMap(day => day).length;
                        
                        const monthHeader = document.createElement('div');
                        monthHeader.className = 'month-header';
                        monthHeader.innerHTML = `
                            <h4>${month} <span class="count">(${monthCount})</span></h4>
                            <span class="toggle-btn">▼</span>
                        `;
                        monthSection.appendChild(monthHeader);
    
                        const monthContent = document.createElement('div');
                        monthContent.className = 'month-content';
    
                        // Sort days in descending order
                        Object.keys(organizedFeedback[year][month])
                            .sort((a, b) => b - a)
                            .forEach(day => {
                                const daySection = document.createElement('div');
                                daySection.className = 'day-section';
                                
                                const dayCount = organizedFeedback[year][month][day].length;
                                daySection.innerHTML = `<h5>${month} ${day} <span class="count">(${dayCount})</span></h5>`;
    
                                organizedFeedback[year][month][day].forEach(feedback => {
                                    const feedbackElement = document.createElement('div');
                                    feedbackElement.className = `feedback-item ${feedback.type}`;
                                    feedbackElement.innerHTML = `
                                        <div class="feedback-header">
                                            <h4>${feedback.customer}</h4>
                                            <span class="feedback-type ${feedback.type}">${feedback.type}</span>
                                        </div>
                                        <p>${feedback.message}</p>
                                        <div class="feedback-footer">
                                            <small>Engineer: ${feedback.engineer}</small>
                                            <small>Time: ${new Date(feedback.timestamp).toLocaleTimeString()}</small>
                                        </div>
                                    `;
                                    daySection.appendChild(feedbackElement);
                                });
    
                                monthContent.appendChild(daySection);
                            });
    
                        monthSection.appendChild(monthContent);
                        yearContent.appendChild(monthSection);
                    });
    
                    yearSection.appendChild(yearContent);
                    container.appendChild(yearSection);
                });
    
            // Add click handlers for collapsible sections
            document.querySelectorAll('.year-header, .month-header').forEach(header => {
                header.addEventListener('click', function() {
                    const content = this.nextElementSibling;
                    const toggleBtn = this.querySelector('.toggle-btn');
                    content.style.display = content.style.display === 'none' ? 'block' : 'none';
                    toggleBtn.textContent = content.style.display === 'none' ? '▶' : '▼';
                });
            });
        }
    
        // Initialize filter buttons
        const filterButtons = document.querySelectorAll('.filters button');
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                renderFeedback(this.dataset.filter);
            });
        });
    
        // Initialize the dashboard
        renderFeedback('all');
    
        function renderAIInsights() {
            // Word cloud insights section
            const wordCloud = document.getElementById('word-cloud');
            wordCloud.innerHTML = `
                <div class="ai-insight-card">
                    <div class="ai-header">
                        <span class="ai-icon">🤖</span>
                        <h4>AI Performance Insight</h4>
                    </div>
                    <div class="ai-message">
                        <p><strong>@Charles Anikpe:</strong> Analysis shows longer research times may impact CSAT. 
                        Consider leveraging Assist Engineers earlier in your troubleshooting process to:</p>
                        <ul>
                            <li>Reduce average resolution time by ~40%</li>
                            <li>Improve customer satisfaction scores</li>
                            <li>Prevent potential negative CSAT due to extended troubleshooting</li>
                        </ul>
                    </div>
                </div>
            `;
        
            // attributes/complements section
            const themesList = document.getElementById('themes-list');
            const attributes = [
                { text: 'Knowledgeable', count: 47, category: 'expertise' },
                { text: 'Fast Resolution', count: 38, category: 'efficiency' },
                { text: 'Professional', count: 35, category: 'conduct' },
                { text: 'Patient', count: 29, category: 'conduct' },
                { text: 'Clear Communication', count: 27, category: 'communication' },
                { text: 'Friendly', count: 25, category: 'conduct' },
                { text: 'Thorough', count: 23, category: 'expertise' },
                { text: 'Excellent Follow-up', count: 21, category: 'efficiency' },
                { text: 'Problem-solving', count: 19, category: 'expertise' },
                { text: 'Empathetic', count: 18, category: 'conduct' }
            ];
        
            themesList.innerHTML = `
                <div class="attributes-container">
                    ${attributes.map(attr => `
                        <div class="attribute-bubble ${attr.category}">
                            <span class="attribute-text">${attr.text}</span>
                            <span class="attribute-count">${attr.count}</span>
                        </div>
                    `).join('')}
                </div>
            `;
        }
        
        
        renderAIInsights();
    // Add click handler for Pending Reviews metric card
    const pendingReviewsCard = document.querySelector('.metric-card:nth-child(2)');
    pendingReviewsCard.addEventListener('click', function() {
        // Find the negative filter button and trigger click
        const negativeFilterButton = document.querySelector('button[data-filter="negative"]');
        if (negativeFilterButton) {
            // Remove active class from all filter buttons
            document.querySelectorAll('.filters button').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Add active class to negative filter button
            negativeFilterButton.classList.add('active');
            
            // Render negative feedback
            renderFeedback('negative');
            
            // Scroll to feedback section
            document.querySelector('.feedback-list').scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

