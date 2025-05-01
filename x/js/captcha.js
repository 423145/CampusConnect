// CAPTCHA and Spam Prevention Script
class SimpleCaptcha {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`Container with ID "${containerId}" not found.`);
            return;
        }
        
        this.options = {
            length: options.length || 6,
            width: options.width || 200,
            height: options.height || 60,
            font: options.font || '30px Arial',
            chars: options.chars || 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789',
            background: options.background || '#f8f9fa',
            textColor: options.textColor || '#333',
            noiseColor: options.noiseColor || '#999',
            noisePoints: options.noisePoints || 100,
            noiseLines: options.noiseLines || 10,
            refreshButton: options.refreshButton !== false,
            caseSensitive: options.caseSensitive !== false,
            ...options
        };
        
        this.captchaText = '';
        this.verified = false;
        
        this.init();
    }
    
    init() {
        // Create CAPTCHA container
        this.container.innerHTML = '';
        this.container.className = 'captcha-container';
        
        // Create canvas
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.options.width;
        this.canvas.height = this.options.height;
        this.ctx = this.canvas.getContext('2d');
        
        // Create input field
        this.input = document.createElement('input');
        this.input.type = 'text';
        this.input.className = 'captcha-input';
        this.input.placeholder = 'Enter the code above';
        this.input.autocomplete = 'off';
        
        // Create refresh button
        if (this.options.refreshButton) {
            this.refreshBtn = document.createElement('button');
            this.refreshBtn.type = 'button';
            this.refreshBtn.className = 'captcha-refresh';
            this.refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i>';
            this.refreshBtn.addEventListener('click', () => this.refresh());
        }
        
        // Create status message
        this.statusMessage = document.createElement('div');
        this.statusMessage.className = 'captcha-status';
        
        // Append elements to container
        const canvasContainer = document.createElement('div');
        canvasContainer.className = 'captcha-canvas-container';
        canvasContainer.appendChild(this.canvas);
        
        if (this.options.refreshButton) {
            canvasContainer.appendChild(this.refreshBtn);
        }
        
        this.container.appendChild(canvasContainer);
        this.container.appendChild(this.input);
        this.container.appendChild(this.statusMessage);
        
        // Generate CAPTCHA
        this.generate();
        
        // Add styles
        this.addStyles();
    }
    
    generate() {
        // Clear canvas
        this.ctx.fillStyle = this.options.background;
        this.ctx.fillRect(0, 0, this.options.width, this.options.height);
        
        // Generate random text
        this.captchaText = '';
        for (let i = 0; i < this.options.length; i++) {
            this.captchaText += this.options.chars.charAt(Math.floor(Math.random() * this.options.chars.length));
        }
        
        // Add noise (dots)
        this.ctx.fillStyle = this.options.noiseColor;
        for (let i = 0; i < this.options.noisePoints; i++) {
            const x = Math.random() * this.options.width;
            const y = Math.random() * this.options.height;
            this.ctx.fillRect(x, y, 1, 1);
        }
        
        // Add noise (lines)
        this.ctx.strokeStyle = this.options.noiseColor;
        this.ctx.lineWidth = 1;
        for (let i = 0; i < this.options.noiseLines; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(Math.random() * this.options.width, Math.random() * this.options.height);
            this.ctx.lineTo(Math.random() * this.options.width, Math.random() * this.options.height);
            this.ctx.stroke();
        }
        
        // Draw text
        this.ctx.font = this.options.font;
        this.ctx.fillStyle = this.options.textColor;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        // Draw each character with slight rotation and position variation
        const charWidth = this.options.width / (this.options.length + 1);
        for (let i = 0; i < this.captchaText.length; i++) {
            const char = this.captchaText.charAt(i);
            const x = (i + 1) * charWidth;
            const y = this.options.height / 2 + (Math.random() * 10 - 5);
            const rotation = Math.random() * 0.4 - 0.2; // Random rotation between -0.2 and 0.2 radians
            
            this.ctx.save();
            this.ctx.translate(x, y);
            this.ctx.rotate(rotation);
            this.ctx.fillText(char, 0, 0);
            this.ctx.restore();
        }
        
        // Reset input and status
        this.input.value = '';
        this.statusMessage.textContent = '';
        this.statusMessage.className = 'captcha-status';
        this.verified = false;
    }
    
    verify() {
        const inputText = this.options.caseSensitive ? this.input.value : this.input.value.toLowerCase();
        const captchaText = this.options.caseSensitive ? this.captchaText : this.captchaText.toLowerCase();
        
        if (inputText === captchaText) {
            this.statusMessage.textContent = 'Verification successful!';
            this.statusMessage.className = 'captcha-status success';
            this.verified = true;
            return true;
        } else {
            this.statusMessage.textContent = 'Incorrect code. Please try again.';
            this.statusMessage.className = 'captcha-status error';
            this.verified = false;
            this.refresh();
            return false;
        }
    }
    
    refresh() {
        this.generate();
    }
    
    isVerified() {
        return this.verified;
    }
    
    addStyles() {
        // Add CSS styles
        const style = document.createElement('style');
        style.textContent = `
            .captcha-container {
                margin-bottom: 1.5rem;
            }
            
            .captcha-canvas-container {
                position: relative;
                margin-bottom: 0.5rem;
            }
            
            .captcha-refresh {
                position: absolute;
                top: 50%;
                right: 10px;
                transform: translateY(-50%);
                background: rgba(255, 255, 255, 0.7);
                border: none;
                border-radius: 50%;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: background 0.3s;
            }
            
            .captcha-refresh:hover {
                background: rgba(255, 255, 255, 0.9);
            }
            
            .captcha-input {
                width: 100%;
                padding: 0.75rem;
                border: 1px solid #ced4da;
                border-radius: 4px;
                font-size: 1rem;
            }
            
            .captcha-status {
                margin-top: 0.5rem;
                font-size: 0.9rem;
            }
            
            .captcha-status.success {
                color: #28a745;
            }
            
            .captcha-status.error {
                color: #dc3545;
            }
        `;
        document.head.appendChild(style);
    }
}

// Spam detection function
function detectSpam(text) {
    if (!text) return false;
    
    // Convert to lowercase for case-insensitive matching
    const lowerText = text.toLowerCase();
    
    // Common spam patterns
    const spamPatterns = [
        /buy.{0,10}viagra/i,
        /buy.{0,10}cialis/i,
        /\bcasino\b/i,
        /\bpoker\b.{0,20}\bonline\b/i,
        /\bbet\b.{0,20}\bonline\b/i,
        /\bfree.{0,10}money\b/i,
        /\bmake.{0,10}money.{0,10}fast\b/i,
        /\bwork.{0,10}from.{0,10}home\b/i,
        /\bweight.{0,10}loss\b/i,
        /\bcheap.{0,10}(viagra|cialis)\b/i,
        /\b(viagra|cialis).{0,10}cheap\b/i,
        /\bfree.{0,10}iphone\b/i,
        /\bfree.{0,10}laptop\b/i,
        /\bfree.{0,10}gift\b/i,
        /\bfree.{0,10}trial\b/i,
        /\bfree.{0,10}sample\b/i,
        /\bfree.{0,10}shipping\b/i,
        /\bfree.{0,10}consultation\b/i,
        /\bfree.{0,10}quote\b/i,
        /\bfree.{0,10}estimate\b/i,
        /\bfree.{0,10}download\b/i,
        /\bfree.{0,10}access\b/i,
        /\bfree.{0,10}membership\b/i,
        /\bfree.{0,10}subscription\b/i,
        /\bfree.{0,10}account\b/i,
        /\bfree.{0,10}registration\b/i,
        /\bfree.{0,10}sign.{0,10}up\b/i,
        /\bfree.{0,10}bonus\b/i,
        /\bfree.{0,10}cash\b/i,
        /\bfree.{0,10}prize\b/i,
        /\bfree.{0,10}reward\b/i,
        /\bfree.{0,10}gift.{0,10}card\b/i,
        /\bfree.{0,10}coupon\b/i,
        /\bfree.{0,10}discount\b/i,
        /\bfree.{0,10}offer\b/i,
        /\bfree.{0,10}deal\b/i,
        /\bfree.{0,10}promotion\b/i,
        /\bfree.{0,10}giveaway\b/i,
        /\bfree.{0,10}raffle\b/i,
        /\bfree.{0,10}lottery\b/i,
        /\bfree.{0,10}sweepstakes\b/i,
        /\bfree.{0,10}contest\b/i,
        /\bfree.{0,10}drawing\b/i,
        /\bfree.{0,10}entry\b/i,
        /\bfree.{0,10}ticket\b/i,
        /\bfree.{0,10}pass\b/i,
        /\bfree.{0,10}admission\b/i,
        /\bfree.{0,10}event\b/i,
        /\bfree.{0,10}webinar\b/i,
        /\bfree.{0,10}seminar\b/i,
        /\bfree.{0,10}workshop\b/i,
        /\bfree.{0,10}training\b/i,
        /\bfree.{0,10}course\b/i,
        /\bfree.{0,10}class\b/i,
        /\bfree.{0,10}lesson\b/i,
        /\bfree.{0,10}tutorial\b/i,
        /\bfree.{0,10}guide\b/i,
        /\bfree.{0,10}ebook\b/i,
        /\bfree.{0,10}report\b/i,
        /\bfree.{0,10}whitepaper\b/i,
        /\bfree.{0,10}pdf\b/i,
        /\bfree.{0,10}video\b/i,
        /\bfree.{0,10}audio\b/i,
        /\bfree.{0,10}podcast\b/i,
        /\bfree.{0,10}newsletter\b/i,
        /\bfree.{0,10}subscription\b/i,
        /\bfree.{0,10}trial\b/i,
        /\bfree.{0,10}demo\b/i,
        /\bfree.{0,10}sample\b/i,
        /\bfree.{0,10}consultation\b/i,
        /\bfree.{0,10}assessment\b/i,
        /\bfree.{0,10}evaluation\b/i,
        /\bfree.{0,10}analysis\b/i,
        /\bfree.{0,10}review\b/i,
        /\bfree.{0,10}audit\b/i,
        /\bfree.{0,10}inspection\b/i,
        /\bfree.{0,10}estimate\b/i,
        /\bfree.{0,10}quote\b/i,
        /\bfree.{0,10}appraisal\b/i,
        /\bfree.{0,10}valuation\b/i,
        /\bfree.{0,10}diagnosis\b/i,
        /\bfree.{0,10}checkup\b/i,
        /\bfree.{0,10}exam\b/i,
        /\bfree.{0,10}test\b/i,
        /\bfree.{0,10}screening\b/i,
        /\bfree.{0,10}scan\b/i,
        /\bfree.{0,10}x-ray\b/i,
        /\bfree.{0,10}mri\b/i,
        /\bfree.{0,10}ct\b/i,
        /\bfree.{0,10}ultrasound\b/i,
        /\bfree.{0,10}mammogram\b/i,
        /\bfree.{0,10}colonoscopy\b/i,
        /\bfree.{0,10}endoscopy\b/i,
        /\bfree.{0,10}biopsy\b/i,
        /\bfree.{0,10}surgery\b/i,
        /\bfree.{0,10}procedure\b/i,
        /\bfree.{0,10}treatment\b/i,
        /\bfree.{0,10}therapy\b/i,
        /\bfree.{0,10}massage\b/i,
        /\bfree.{0,10}facial\b/i,
        /\bfree.{0,10}manicure\b/i,
        /\bfree.{0,10}pedicure\b/i,
        /\bfree.{0,10}haircut\b/i,
        /\bfree.{0,10}styling\b/i,
        /\bfree.{0,10}coloring\b/i,
        /\bfree.{0,10}highlights\b/i,
        /\bfree.{0,10}lowlights\b/i,
        /\bfree.{0,10}balayage\b/i,
        /\bfree.{0,10}ombre\b/i,
        /\bfree.{0,10}blowout\b/i,
        /\bfree.{0,10}updo\b/i,
        /\bfree.{0,10}makeup\b/i,
        /\bfree.{0,10}makeover\b/i,
        /\bfree.{0,10}consultation\b/i,
        /\bfree.{0,10}advice\b/i,
        /\bfree.{0,10}tip\b/i,
        /\bfree.{0,10}secret\b/i,
        /\bfree.{0,10}hack\b/i,
        /\bfree.{0,10}trick\b/i,
        /\bfree.{0,10}strategy\b/i,
        /\bfree.{0,10}tactic\b/i,
        /\bfree.{0,10}method\b/i,
        /\bfree.{0,10}system\b/i,
        /\bfree.{0,10}formula\b/i,
        /\bfree.{0,10}blueprint\b/i,
        /\bfree.{0,10}roadmap\b/i,
        /\bfree.{0,10}plan\b/i,
        /\bfree.{0,10}program\b/i,
        /\bfree.{0,10}course\b/i,
        /\bfree.{0,10}class\b/i,
        /\bfree.{0,10}workshop\b/i,
        /\bfree.{0,10}seminar\b/i,
        /\bfree.{0,10}webinar\b/i,
        /\bfree.{0,10}training\b/i,
        /\bfree.{0,10}coaching\b/i,
        /\bfree.{0,10}mentoring\b/i,
        /\bfree.{0,10}consulting\b/i,
        /\bfree.{0,10}advising\b/i,
        /\bfree.{0,10}counseling\b/i,
        /\bfree.{0,10}therapy\b/i,
        /\bfree.{0,10}treatment\b/i,
        /\bfree.{0,10}healing\b/i,
        /\bfree.{0,10}cure\b/i,
        /\bfree.{0,10}remedy\b/i,
        /\bfree.{0,10}solution\b/i,
        /\bfree.{0,10}fix\b/i,
        /\bfree.{0,10}repair\b/i,
        /\bfree.{0,10}restoration\b/i,
        /\bfree.{0,10}renovation\b/i,
        /\bfree.{0,10}remodeling\b/i,
        /\bfree.{0,10}upgrade\b/i,
        /\bfree.{0,10}update\b/i,
        /\bfree.{0,10}improvement\b/i,
        /\bfree.{0,10}enhancement\b/i,
        /\bfree.{0,10}optimization\b/i,
        /\bfree.{0,10}maximization\b/i,
        /\bfree.{0,10}amplification\b/i,
        /\bfree.{0,10}augmentation\b/i,
        /\bfree.{0,10}enlargement\b/i,
        /\bfree.{0,10}extension\b/i,
        /\bfree.{0,10}expansion\b/i,
        /\bfree.{0,10}increase\b/i,
        /\bfree.{0,10}growth\b/i,
        /\bfree.{0,10}development\b/i,
        /\bfree.{0,10}advancement\b/i,
        /\bfree.{0,10}progression\b/i,
        /\bfree.{0,10}evolution\b/i,
        /\bfree.{0,10}revolution\b/i,
        /\bfree.{0,10}transformation\b/i,
        /\bfree.{0,10}metamorphosis\b/i,
        /\bfree.{0,10}change\b/i,
        /\bfree.{0,10}shift\b/i,
        /\bfree.{0,10}transition\b/i,
        /\bfree.{0,10}conversion\b/i,
        /\bfree.{0,10}modification\b/i,
        /\bfree.{0,10}alteration\b/i,
        /\bfree.{0,10}adjustment\b/i,
        /\bfree.{0,10}adaptation\b/i,
        /\bfree.{0,10}customization\b/i,
        /\bfree.{0,10}personalization\b/i,
        /\bfree.{0,10}individualization\b/i,
        /\bfree.{0,10}tailoring\b/i,
        /\bfree.{0,10}fitting\b/i,
        /\bfree.{0,10}sizing\b/i,
        /\bfree.{0,10}measuring\b/i,
        /\bfree.{0,10}assessment\b/i,
        /\bfree.{0,10}evaluation\b/i,
        /\bfree.{0,10}analysis\b/i,
        /\bfree.{0,10}review\b/i,
        /\bfree.{0,10}audit\b/i,
        /\bfree.{0,10}inspection\b/i,
        /\bfree.{0,10}examination\b/i,
        /\bfree.{0,10}investigation\b/i,
        /\bfree.{0,10}exploration\b/i,
        /\bfree.{0,10}discovery\b/i,
        /\bfree.{0,10}finding\b/i,
        /\bfree.{0,10}revelation\b/i,
        /\bfree.{0,10}disclosure\b/i,
        /\bfree.{0,10}exposure\b/i,
        /\bfree.{0,10}unveiling\b/i,
        /\bfree.{0,10}uncovering\b/i,
        /\bfree.{0,10}revealing\b/i,
        /\bfree.{0,10}showing\b/i,
        /\bfree.{0,10}displaying\b/i,
        /\bfree.{0,10}exhibiting\b/i,
        /\bfree.{0,10}presenting\b/i,
        /\bfree.{0,10}demonstrating\b/i,
        /\bfree.{0,10}illustrating\b/i,
        /\bfree.{0,10}explaining\b/i,
        /\bfree.{0,10}clarifying\b/i,
        /\bfree.{0,10}elucidating\b/i,
        /\bfree.{0,10}illuminating\b/i,
        /\bfree.{0,10}enlightening\b/i,
        /\bfree.{0,10}educating\b/i,
        /\bfree.{0,10}teaching\b/i,
        /\bfree.{0,10}instructing\b/i,
        /\bfree.{0,10}training\b/i,
        /\bfree.{0,10}coaching\b/i,
        /\bfree.{0,10}mentoring\b/i,
        /\bfree.{0,10}guiding\b/i,
        /\bfree.{0,10}directing\b/i,
        /\bfree.{0,10}leading\b/i,
        /\bfree.{0,10}managing\b/i,
        /\bfree.{0,10}supervising\b/i,
        /\bfree.{0,10}overseeing\b/i,
        /\bfree.{0,10}administering\b/i,
        /\bfree.{0,10}governing\b/i,
        /\bfree.{0,10}controlling\b/i,
        /\bfree.{0,10}regulating\b/i,
        /\bfree.{0,10}monitoring\b/i,
        /\bfree.{0,10}tracking\b/i,
        /\bfree.{0,10}following\b/i,
        /\bfree.{0,10}watching\b/i,
        /\bfree.{0,10}observing\b/i,
        /\bfree.{0,10}surveying\b/i,
        /\bfree.{0,10}scanning\b/i,
        /\bfree.{0,10}searching\b/i,
        /\bfree.{0,10}seeking\b/i,
        /\bfree.{0,10}looking\b/i,
        /\bfree.{0,10}hunting\b/i,
        /\bfree.{0,10}gathering\b/i,
        /\bfree.{0,10}collecting\b/i,
        /\bfree.{0,10}accumulating\b/i,
        /\bfree.{0,10}amassing\b/i,
        /\bfree.{0,10}compiling\b/i,
        /\bfree.{0,10}assembling\b/i,
        /\bfree.{0,10}organizing\b/i,
        /\bfree.{0,10}arranging\b/i,
        /\bfree.{0,10}ordering\b/i,
        /\bfree.{0,10}sorting\b/i,
        /\bfree.{0,10}categorizing\b/i,
        /\bfree.{0,10}classifying\b/i,
        /\bfree.{0,10}grouping\b/i,
        /\bfree.{0,10}clustering\b/i,
        /\bfree.{0,10}segmenting\b/i,
        /\bfree.{0,10}dividing\b/i,
        /\bfree.{0,10}splitting\b/i,
        /\bfree.{0,10}separating\b/i,
        /\bfree.{0,10}isolating\b/i,
        /\bfree.{0,10}extracting\b/i,
        /\bfree.{0,10}removing\b/i,
        /\bfree.{0,10}eliminating\b/i,
        /\bfree.{0,10}deleting\b/i,
        /\bfree.{0,10}erasing\b/i,
        /\bfree.{0,10}clearing\b/i,
        /\bfree.{0,10}cleaning\b/i,
        /\bfree.{0,10}purifying\b/i,
        /\bfree.{0,10}detoxifying\b/i,
        /\bfree.{0,10}cleansing\b/i,
        /\bfree.{0,10}washing\b/i,
        /\bfree.{0,10}rinsing\b/i,
        /\bfree.{0,10}scrubbing\b/i,
        /\bfree.{0,10}polishing\b/i,
        /\bfree.{0,10}shining\b/i,
        /\bfree.{0,10}buffing\b/i,
        /\bfree.{0,10}waxing\b/i,
        /\bfree.{0,10}sealing\b/i,
        /\bfree.{0,10}protecting\b/i,
        /\bfree.{0,10}securing\b/i,
        /\bfree.{0,10}safeguarding\b/i,
        /\bfree.{0,10}defending\b/i,
        /\bfree.{0,10}shielding\b/i,
        /\bfree.{0,10}guarding\b/i,
        /\bfree.{0,10}watching\b/i,
        /\bfree.{0,10}monitoring\b/i,
    ];
    
    // Check if text matches any spam pattern
    for (const pattern of spamPatterns) {
        if (pattern.test(lowerText)) {
            return true;
        }
    }
    
    // Check for excessive links (more than 3)
    const linkCount = (lowerText.match(/https?:\/\//g) || []).length;
    if (linkCount > 3) {
        return true;
    }
    
    // Check for excessive use of special characters
    const specialCharRatio = (lowerText.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g) || []).length / lowerText.length;
    if (specialCharRatio > 0.3) {
        return true;
    }
    
    // Check for excessive capitalization
    const capsRatio = (text.match(/[A-Z]/g) || []).length / text.replace(/\s/g, '').length;
    if (capsRatio > 0.7) {
        return true;
    }
    
    // Check for repetitive text patterns
    const words = lowerText.split(/\s+/);
    const uniqueWords = new Set(words);
    if (words.length > 20 && uniqueWords.size / words.length < 0.4) {
        return true;
    }
    
    return false;
}

// Export functions
window.SimpleCaptcha = SimpleCaptcha;
window.detectSpam = detectSpam;