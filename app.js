// --- 1. Typing Effect Logic ---
        const textArray = ["Dream Car!", "Commercial Fleet!", "Family's Health!", "Business Future!"];
        let textIndex = 0;
        let charIndex = 0;
        const typingSpeed = 100;
        const erasingSpeed = 50;
        const newTextDelay = 2000;
        const typedTextSpan = document.querySelector(".typed-text");

        function type() {
            if (charIndex < textArray[textIndex].length) {
                typedTextSpan.textContent += textArray[textIndex].charAt(charIndex);
                charIndex++;
                setTimeout(type, typingSpeed);
            } else {
                setTimeout(erase, newTextDelay);
            }
        }
        function erase() {
            if (charIndex > 0) {
                typedTextSpan.textContent = textArray[textIndex].substring(0, charIndex - 1);
                charIndex--;
                setTimeout(erase, erasingSpeed);
            } else {
                textIndex++;
                if (textIndex >= textArray.length) textIndex = 0;
                setTimeout(type, typingSpeed + 1100);
            }
        }
        document.addEventListener("DOMContentLoaded", function() {
            if(textArray.length) setTimeout(type, newTextDelay + 250);
            filterPosters('all');
        });

        // --- 2. Filter Posters Tabs Logic ---
        function filterPosters(category, evt) {
            let items = document.querySelectorAll('.poster-item');
            let buttons = document.querySelectorAll('.tab-btn');
            
            buttons.forEach(btn => btn.classList.remove('active'));
            if (evt && evt.target) evt.target.classList.add('active');

            items.forEach(item => {
                if(category === 'all') {
                    item.classList.add('show');
                } else {
                    if(item.classList.contains(category)) {
                        item.classList.add('show');
                    } else {
                        item.classList.remove('show');
                    }
                }
            });
        }

        // --- 3. Back to Top Button Logic ---
        var backToTopBtn = document.getElementById("backToTop");
        window.addEventListener("scroll", function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add("show");
            } else {
                backToTopBtn.classList.remove("show");
            }
        });
        backToTopBtn.addEventListener("click", function(e) {
            e.preventDefault();
            window.scrollTo({top: 0, behavior: 'smooth'});
        });

   // --- 4. Submit Inquiry & HubSpot Lead Push ---
function submitEnquiry() {
    var name = document.getElementById('custName').value.trim();
    var phone = document.getElementById('custPhone') ? document.getElementById('custPhone').value.trim() : '';
    var email = document.getElementById('custEmail') ? document.getElementById('custEmail').value.trim() : '';
    var service = document.getElementById('custService').value;
    var btn = document.getElementById('submitBtn');
    var msg = document.getElementById('formMsg');

    if (!name || !phone || !email) {
        alert("Please fill Name, Mobile Number and Email Address.");
        return;
    }

    btn.innerText = "Submitting...";
    btn.disabled = true;

    // HubSpot Contact Push
    var _hsq = window._hsq = window._hsq || [];
    _hsq.push(["identify", {
        email: email,
        firstname: name,
        mobilephone: phone
    }]);
    _hsq.push(['trackCustomBehavioralEvent', {
        name: "lead_callback_form_submitted"
    }]);

    setTimeout(function() {
        btn.style.display = "none";
        msg.style.display = "block";
        msg.innerText = "✓ Thank you, " + name + "! Your inquiry has been submitted. Our team will contact you shortly.";
    }, 600);


}

        // --- 5. Live EMI Calculator Logic ---
        function calculateEMI() {
            let p = parseFloat(document.getElementById('loanAmount').value);
            let r = parseFloat(document.getElementById('interestRate').value);
            let n = parseFloat(document.getElementById('loanTenure').value);

            document.getElementById('amountLabel').innerText = "₹ " + p.toLocaleString('en-IN');
            document.getElementById('rateLabel').innerText = r + " %";
            document.getElementById('tenureLabel').innerText = n + " Months";

            let rMonthly = r / 12 / 100; 
            let emi = (p * rMonthly * Math.pow(1 + rMonthly, n)) / (Math.pow(1 + rMonthly, n) - 1);
            
            if(!isNaN(emi) && emi != Infinity) {
                document.getElementById('emiResult').innerText = "₹ " + Math.round(emi).toLocaleString('en-IN');
            } else {
                document.getElementById('emiResult').innerText = "₹ 0";
            }
        }
        calculateEMI();

        // --- 6. Instant Loan Eligibility Checker Logic ---
        function calculateEligibility() {
            let income = parseFloat(document.getElementById('monthlyIncome').value);
            document.getElementById('incomeLabel').innerText = "₹ " + income.toLocaleString('en-IN');
            
            let eligibleAmount = income * 30;
            document.getElementById('eligibleResult').innerText = "₹ " + eligibleAmount.toLocaleString('en-IN');
        }
        calculateEligibility();

        // --- 7. Scroll Reveal Animation Logic ---
        function reveal() {
            var reveals = document.querySelectorAll(".reveal");
            for (var i = 0; i < reveals.length; i++) {
                var windowHeight = window.innerHeight;
                var elementTop = reveals[i].getBoundingClientRect().top;
                var elementVisible = 80;
                
                if (elementTop < windowHeight - elementVisible) {
                    reveals[i].classList.add("active");
                }
            }
        }
        window.addEventListener("scroll", reveal);
        reveal();

        // --- 8. FAQ Accordion Logic ---
        function toggleFaq(element) {
            element.classList.toggle("active");
        }
