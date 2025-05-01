// Template Processor for Header Integration

class TemplateProcessor {
    constructor() {
        this.templates = {};
        this.baseUrl = this.determineBaseUrl();
    }

    determineBaseUrl() {
        const path = window.location.pathname;
        return path.includes('/pages/') ? '../' : '';
    }

    async loadTemplate(name) {
        if (this.templates[name]) {
            return this.templates[name];
        }

        try {
            const response = await fetch(`${this.baseUrl}templates/${name}.html`);
            const template = await response.text();
            this.templates[name] = template;
            return template;
        } catch (error) {
            console.error(`Error loading template ${name}:`, error);
            return '';
        }
    }

    processHeaderTemplate(template) {
        const currentPath = window.location.pathname;
        const activeClass = 'class="active"';
        
        // Determine active page
        const replacements = {
            '{$baseUrl}': this.baseUrl,
            '{$homeActive}': currentPath.endsWith('index.html') ? activeClass : '',
            '{$collegesActive}': currentPath.includes('colleges.html') ? activeClass : '',
            '{$questionsActive}': currentPath.includes('questions.html') ? activeClass : '',
            '{$aboutActive}': currentPath.includes('about.html') ? activeClass : ''
        };

        // Replace all placeholders
        return Object.entries(replacements).reduce((str, [key, value]) => {
            return str.replace(new RegExp(key, 'g'), value);
        }, template);
    }

    async initializeHeader() {
        const headerTemplate = await this.loadTemplate('header');
        if (headerTemplate) {
            const processedTemplate = this.processHeaderTemplate(headerTemplate);
            const headerContainer = document.querySelector('header');
            if (headerContainer) {
                headerContainer.outerHTML = processedTemplate;
                // Initialize header manager after template is loaded
                if (window.headerManager) {
                    window.headerManager.init();
                } else {
                    window.headerManager = new HeaderManager();
                }
            }
        }
    }
}

// Initialize template processor when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.templateProcessor = new TemplateProcessor();
    window.templateProcessor.initializeHeader();
});