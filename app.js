// CISSP Study App
class CISSPStudyApp {
    constructor() {
        this.studyData = [];
        this.filteredData = [];
        this.currentStudyIndex = 0;
        this.currentMode = 'study';
        this.studiedItems = new Set();
        this.quizData = [];
        this.currentQuizIndex = 0;
        this.quizScore = 0;
        this.selectedAnswer = null;
        this.quizAnswers = [];
        
        // 도메인 매핑
        this.domainMapping = {
            'cissp_security_risk_management_study.json': 'Security and Risk Management',
            'cissp_asset_security_study.json': 'Asset Security',
            'cissp_security_architecture_engineering_study.json': 'Security Architecture and Engineering',
            'cissp_communication_network_security_study.json': 'Communication and Network Security',
            'cissp_identity_access_management_study.json': 'Identity and Access Management',
            'cissp_security_assessment_testing_study.json': 'Security Assessment and Testing',
            'cissp_security_operations_study.json': 'Security Operations',
            'cissp_software_development_security_study.json': 'Software Development Security'
        };

        this.init();
    }

    async init() {
        this.showLoading(true);
        await this.loadAllData();
        this.setupEventListeners();
        this.loadStudiedItems();
        this.setupDomainFilter();
        this.updateDisplay();
        this.showLoading(false);
    }

    async loadAllData() {
        try {
            const dataFiles = [
                'data/cissp_security_risk_management_study.json',
                'data/cissp_asset_security_study.json',
                'data/cissp_security_architecture_engineering_study.json',
                'data/cissp_communication_network_security_study.json',
                'data/cissp_identity_access_management_study.json',
                'data/cissp_security_assessment_testing_study.json',
                'data/cissp_security_operations_study.json',
                'data/cissp_software_development_security_study.json'
            ];

            const promises = dataFiles.map(async (file) => {
                const response = await fetch(file);
                if (!response.ok) {
                    throw new Error(`Failed to load ${file}`);
                }
                const data = await response.json();
                const domain = this.getDomainFromFile(file);
                return data.map(item => ({
                    ...item,
                    domain: domain,
                    file: file
                }));
            });

            const results = await Promise.all(promises);
            this.studyData = results.flat();
            this.filteredData = [...this.studyData];
            
            console.log(`Loaded ${this.studyData.length} study items`);
        } catch (error) {
            console.error('Error loading data:', error);
            this.showToast('데이터 로딩 중 오류가 발생했습니다.', 'error');
        }
    }

    getDomainFromFile(filename) {
        const basename = filename.split('/').pop();
        return this.domainMapping[basename] || 'Unknown Domain';
    }

    setupEventListeners() {
        // Navigation tabs
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const mode = e.target.closest('.nav-tab').dataset.mode;
                this.switchMode(mode);
            });
        });

        // Study mode controls
        document.getElementById('prevBtn').addEventListener('click', () => this.previousCard());
        document.getElementById('nextBtn').addEventListener('click', () => this.nextCard());
        document.getElementById('markStudiedBtn').addEventListener('click', () => this.markAsStudied());
        document.getElementById('randomBtn').addEventListener('click', () => this.randomizeCards());
        document.getElementById('resetBtn').addEventListener('click', () => this.resetProgress());

        // Quiz mode controls
        document.getElementById('startQuizBtn').addEventListener('click', () => this.startQuiz());
        document.getElementById('submitAnswerBtn').addEventListener('click', () => this.submitAnswer());
        document.getElementById('nextQuestionBtn').addEventListener('click', () => this.nextQuestion());
        document.getElementById('finishQuizBtn').addEventListener('click', () => this.finishQuiz());

        // Review mode controls
        document.getElementById('reviewStudiedBtn').addEventListener('click', () => this.reviewStudiedItems());

        // Search and filter
        document.getElementById('searchInput').addEventListener('input', (e) => this.handleSearch(e.target.value));
        document.getElementById('domainSelect').addEventListener('change', (e) => this.filterByDomain(e.target.value));
    }

    setupDomainFilter() {
        const domainSelect = document.getElementById('domainSelect');
        const domains = [...new Set(this.studyData.map(item => item.domain))];
        
        domains.forEach(domain => {
            const option = document.createElement('option');
            option.value = domain;
            option.textContent = domain;
            domainSelect.appendChild(option);
        });
    }

    switchMode(mode) {
        // Update nav tabs
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-mode="${mode}"]`).classList.add('active');

        // Update mode containers
        document.querySelectorAll('.mode-container').forEach(container => {
            container.classList.remove('active');
        });
        document.getElementById(`${mode}Mode`).classList.add('active');

        this.currentMode = mode;

        if (mode === 'review') {
            this.updateReviewStats();
        }
    }

    updateDisplay() {
        this.updateStudyCard();
        this.updateStats();
    }

    updateStudyCard() {
        if (this.filteredData.length === 0) {
            document.getElementById('studyTopic').textContent = '검색 결과가 없습니다';
            document.getElementById('studyDescription').textContent = '다른 키워드로 검색해보세요.';
            document.getElementById('studyReference').textContent = '';
            document.getElementById('currentDomain').textContent = '';
            return;
        }

        const currentItem = this.filteredData[this.currentStudyIndex];
        if (currentItem) {
            document.getElementById('studyTopic').textContent = currentItem.topic;
            document.getElementById('studyDescription').textContent = currentItem.description;
            document.getElementById('studyReference').textContent = currentItem.reference;
            document.getElementById('currentDomain').textContent = currentItem.domain;
            document.getElementById('currentIndex').textContent = this.currentStudyIndex + 1;
            document.getElementById('totalCards').textContent = this.filteredData.length;

            // Update mark studied button
            const isStudied = this.studiedItems.has(currentItem.id);
            const markBtn = document.getElementById('markStudiedBtn');
            if (isStudied) {
                markBtn.innerHTML = '<i class="fas fa-check-circle"></i> 학습완료됨';
                markBtn.classList.add('btn-secondary');
                markBtn.classList.remove('btn-success');
            } else {
                markBtn.innerHTML = '<i class="fas fa-check"></i> 학습완료';
                markBtn.classList.add('btn-success');
                markBtn.classList.remove('btn-secondary');
            }
        }
    }

    updateStats() {
        document.getElementById('totalQuestions').textContent = this.studyData.length;
        document.getElementById('studiedCount').textContent = this.studiedItems.size;
    }

    previousCard() {
        if (this.currentStudyIndex > 0) {
            this.currentStudyIndex--;
        } else {
            this.currentStudyIndex = this.filteredData.length - 1;
        }
        this.updateStudyCard();
    }

    nextCard() {
        if (this.currentStudyIndex < this.filteredData.length - 1) {
            this.currentStudyIndex++;
        } else {
            this.currentStudyIndex = 0;
        }
        this.updateStudyCard();
    }

    markAsStudied() {
        const currentItem = this.filteredData[this.currentStudyIndex];
        if (currentItem) {
            if (this.studiedItems.has(currentItem.id)) {
                this.studiedItems.delete(currentItem.id);
                this.showToast('학습 완료를 취소했습니다.', 'warning');
            } else {
                this.studiedItems.add(currentItem.id);
                this.showToast('학습 완료로 표시했습니다!', 'success');
            }
            this.saveStudiedItems();
            this.updateDisplay();
        }
    }

    randomizeCards() {
        // Fisher-Yates shuffle algorithm
        for (let i = this.filteredData.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.filteredData[i], this.filteredData[j]] = [this.filteredData[j], this.filteredData[i]];
        }
        this.currentStudyIndex = 0;
        this.updateStudyCard();
        this.showToast('카드 순서를 섞었습니다!', 'success');
    }

    resetProgress() {
        if (confirm('모든 학습 진행률을 초기화하시겠습니까?')) {
            this.studiedItems.clear();
            this.saveStudiedItems();
            this.updateDisplay();
            this.showToast('학습 진행률이 초기화되었습니다.', 'warning');
        }
    }

    handleSearch(query) {
        if (!query.trim()) {
            this.filteredData = [...this.studyData];
        } else {
            const lowerQuery = query.toLowerCase();
            this.filteredData = this.studyData.filter(item =>
                item.topic.toLowerCase().includes(lowerQuery) ||
                item.description.toLowerCase().includes(lowerQuery)
            );
        }
        
        // Apply domain filter if active
        const selectedDomain = document.getElementById('domainSelect').value;
        if (selectedDomain !== 'all') {
            this.filteredData = this.filteredData.filter(item => item.domain === selectedDomain);
        }

        this.currentStudyIndex = 0;
        this.updateStudyCard();
    }

    filterByDomain(domain) {
        if (domain === 'all') {
            this.filteredData = [...this.studyData];
        } else {
            this.filteredData = this.studyData.filter(item => item.domain === domain);
        }

        // Apply search filter if active
        const searchQuery = document.getElementById('searchInput').value;
        if (searchQuery.trim()) {
            this.handleSearch(searchQuery);
            return;
        }

        this.currentStudyIndex = 0;
        this.updateStudyCard();
    }

    // Quiz functionality
    startQuiz() {
        const quizCount = Math.min(10, this.filteredData.length);
        this.quizData = this.getRandomItems(this.filteredData, quizCount);
        this.currentQuizIndex = 0;
        this.quizScore = 0;
        this.quizAnswers = [];

        this.hideQuizControls();
        document.getElementById('submitAnswerBtn').style.display = 'block';
        document.getElementById('startQuizBtn').style.display = 'none';

        this.updateQuizDisplay();
    }

    getRandomItems(array, count) {
        const shuffled = [...array].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    updateQuizDisplay() {
        const currentItem = this.quizData[this.currentQuizIndex];
        if (!currentItem) return;

        // Update progress
        const progress = ((this.currentQuizIndex + 1) / this.quizData.length) * 100;
        document.getElementById('quizProgress').style.width = `${progress}%`;
        document.getElementById('quizCurrentIndex').textContent = this.currentQuizIndex + 1;
        document.getElementById('quizTotalQuestions').textContent = this.quizData.length;

        // Generate question
        const question = `다음 중 "${currentItem.topic}"에 대한 설명으로 가장 적절한 것은?`;
        document.getElementById('quizQuestion').textContent = question;

        // Generate options
        const options = this.generateQuizOptions(currentItem);
        const optionsContainer = document.getElementById('quizOptions');
        optionsContainer.innerHTML = '';

        options.forEach((option, index) => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'quiz-option';
            optionDiv.innerHTML = `
                <input type="radio" name="quizOption" value="${index}" id="option${index}">
                <label for="option${index}">${option.text}</label>
            `;
            optionDiv.addEventListener('click', () => this.selectOption(index));
            optionsContainer.appendChild(optionDiv);
        });

        // Hide explanation
        document.getElementById('quizExplanation').style.display = 'none';
        this.selectedAnswer = null;

        // Update score
        const scorePercentage = this.quizData.length > 0 ? Math.round((this.quizScore / this.quizData.length) * 100) : 0;
        document.getElementById('quizScore').textContent = `${scorePercentage}%`;
    }

    generateQuizOptions(correctItem) {
        const options = [{ text: correctItem.description, correct: true, item: correctItem }];
        
        // Get wrong options from other items
        const otherItems = this.studyData.filter(item => item.id !== correctItem.id);
        const wrongOptions = this.getRandomItems(otherItems, 3);
        
        wrongOptions.forEach(item => {
            options.push({ text: item.description, correct: false, item: item });
        });

        // Shuffle options
        return options.sort(() => 0.5 - Math.random());
    }

    selectOption(index) {
        // Remove previous selections
        document.querySelectorAll('.quiz-option').forEach(option => {
            option.classList.remove('selected');
        });

        // Add selection to clicked option
        document.querySelectorAll('.quiz-option')[index].classList.add('selected');
        this.selectedAnswer = index;
    }

    submitAnswer() {
        if (this.selectedAnswer === null) {
            this.showToast('답안을 선택해주세요.', 'warning');
            return;
        }

        const currentItem = this.quizData[this.currentQuizIndex];
        const options = Array.from(document.querySelectorAll('.quiz-option'));
        const selectedOption = options[this.selectedAnswer];
        
        // Check if answer is correct
        const selectedText = selectedOption.querySelector('label').textContent;
        const isCorrect = selectedText === currentItem.description;

        if (isCorrect) {
            this.quizScore++;
            selectedOption.classList.add('correct');
        } else {
            selectedOption.classList.add('wrong');
            // Highlight correct answer
            options.forEach((option, index) => {
                if (option.querySelector('label').textContent === currentItem.description) {
                    option.classList.add('correct');
                }
            });
        }

        // Store answer
        this.quizAnswers.push({
            question: currentItem,
            selectedAnswer: selectedText,
            correct: isCorrect
        });

        // Show explanation
        document.getElementById('explanationText').textContent = currentItem.description;
        document.getElementById('quizExplanation').style.display = 'block';

        // Update controls
        document.getElementById('submitAnswerBtn').style.display = 'none';
        
        if (this.currentQuizIndex < this.quizData.length - 1) {
            document.getElementById('nextQuestionBtn').style.display = 'block';
        } else {
            document.getElementById('finishQuizBtn').style.display = 'block';
        }

        // Update score display
        const scorePercentage = Math.round((this.quizScore / this.quizData.length) * 100);
        document.getElementById('quizScore').textContent = `${scorePercentage}%`;
    }

    nextQuestion() {
        this.currentQuizIndex++;
        this.hideQuizControls();
        document.getElementById('submitAnswerBtn').style.display = 'block';
        this.updateQuizDisplay();
    }

    finishQuiz() {
        const finalScore = Math.round((this.quizScore / this.quizData.length) * 100);
        const message = `퀴즈 완료!\n점수: ${this.quizScore}/${this.quizData.length} (${finalScore}%)\n\n다시 퀴즈를 시작하시겠습니까?`;
        
        if (confirm(message)) {
            this.startQuiz();
        } else {
            this.resetQuiz();
        }
    }

    resetQuiz() {
        this.hideQuizControls();
        document.getElementById('startQuizBtn').style.display = 'block';
        document.getElementById('quizQuestion').textContent = '퀴즈 문제가 여기에 표시됩니다.';
        document.getElementById('quizOptions').innerHTML = '';
        document.getElementById('quizExplanation').style.display = 'none';
        document.getElementById('quizProgress').style.width = '0%';
        document.getElementById('quizScore').textContent = '0%';
    }

    hideQuizControls() {
        document.getElementById('submitAnswerBtn').style.display = 'none';
        document.getElementById('nextQuestionBtn').style.display = 'none';
        document.getElementById('finishQuizBtn').style.display = 'none';
    }

    // Review functionality
    updateReviewStats() {
        const total = this.studyData.length;
        const completed = this.studiedItems.size;
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

        document.getElementById('reviewTotal').textContent = total;
        document.getElementById('reviewCompleted').textContent = completed;
        document.getElementById('reviewPercentage').textContent = `${percentage}%`;
    }

    reviewStudiedItems() {
        const studiedData = this.studyData.filter(item => this.studiedItems.has(item.id));
        
        if (studiedData.length === 0) {
            this.showToast('학습 완료한 항목이 없습니다.', 'warning');
            return;
        }

        this.filteredData = studiedData;
        this.currentStudyIndex = 0;
        this.switchMode('study');
        this.updateStudyCard();
        this.showToast(`${studiedData.length}개의 학습 완료 항목을 불러왔습니다.`, 'success');
    }

    // Storage functionality
    saveStudiedItems() {
        localStorage.setItem('cissStudiedItems', JSON.stringify(Array.from(this.studiedItems)));
    }

    loadStudiedItems() {
        const saved = localStorage.getItem('cissStudiedItems');
        if (saved) {
            this.studiedItems = new Set(JSON.parse(saved));
        }
    }

    // Utility functions
    showLoading(show) {
        const spinner = document.getElementById('loadingSpinner');
        spinner.style.display = show ? 'flex' : 'none';
    }

    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'exclamation-triangle'}"></i>
            ${message}
        `;
        
        document.getElementById('toastContainer').appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.cissApp = new CISSPStudyApp();
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (!window.cissApp || window.cissApp.currentMode !== 'study') return;
    
    switch(e.key) {
        case 'ArrowLeft':
            e.preventDefault();
            window.cissApp.previousCard();
            break;
        case 'ArrowRight':
            e.preventDefault();
            window.cissApp.nextCard();
            break;
        case ' ':
            e.preventDefault();
            window.cissApp.markAsStudied();
            break;
        case 'r':
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                window.cissApp.randomizeCards();
            }
            break;
    }
});