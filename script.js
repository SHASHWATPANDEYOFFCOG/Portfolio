/* ============================================================
   Shashwat Kumar Pandey — Portfolio interactions
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {

    /* ---------- Theme: persist + respect system preference ---------- */
    const root = document.documentElement;
    const themeToggle = document.getElementById("theme-toggle");
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.setAttribute("data-theme", stored || (prefersDark ? "dark" : "light"));

    themeToggle.addEventListener("click", () => {
        const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
        root.setAttribute("data-theme", next);
        localStorage.setItem("theme", next);
    });

    /* ---------- Mobile menu ---------- */
    const menuToggle = document.getElementById("menu-toggle");
    const navLinksWrap = document.getElementById("nav-links");
    const closeMenu = () => {
        navLinksWrap.classList.remove("open");
        menuToggle.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
    };
    menuToggle.addEventListener("click", () => {
        const open = navLinksWrap.classList.toggle("open");
        menuToggle.classList.toggle("open", open);
        menuToggle.setAttribute("aria-expanded", String(open));
    });
    navLinksWrap.querySelectorAll("a").forEach(a => a.addEventListener("click", closeMenu));

    /* ---------- Navbar shadow + scroll progress + back-to-top ---------- */
    const navbar = document.getElementById("navbar");
    const progress = document.getElementById("scroll-progress");
    const backToTop = document.getElementById("back-to-top");

    const onScroll = () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.width = (docHeight > 0 ? (scrollTop / docHeight) * 100 : 0) + "%";
        navbar.classList.toggle("scrolled", scrollTop > 20);
        backToTop.classList.toggle("show", scrollTop > 500);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

    /* ---------- Typing effect (looping roles) ---------- */
    const typedEl = document.getElementById("typed");
    const roles = [
        "Full-Stack Developer (MERN)",
        "AI / ML Enthusiast",
        "DSA Problem Solver — 300+",
        "Cybersecurity Enthusiast",
        "CSE Student @ RGIPT"
    ];
    let roleIdx = 0, charIdx = 0, deleting = false;

    function typeLoop() {
        const current = roles[roleIdx];
        typedEl.textContent = current.slice(0, charIdx);

        if (!deleting && charIdx < current.length) {
            charIdx++;
            setTimeout(typeLoop, 90);
        } else if (!deleting && charIdx === current.length) {
            deleting = true;
            setTimeout(typeLoop, 1600);
        } else if (deleting && charIdx > 0) {
            charIdx--;
            setTimeout(typeLoop, 45);
        } else {
            deleting = false;
            roleIdx = (roleIdx + 1) % roles.length;
            setTimeout(typeLoop, 350);
        }
    }
    typeLoop();

    /* ---------- Scroll reveal (Intersection Observer) ---------- */
    const revealEls = document.querySelectorAll(".reveal");
    const revealObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    revealEls.forEach(el => revealObserver.observe(el));

    /* ---------- Animated skill bars (trigger on view) ---------- */
    const skillsSection = document.getElementById("skills");
    const bars = document.querySelectorAll(".progress-bar");
    const skillsObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                bars.forEach(bar => { bar.style.width = bar.getAttribute("data-width"); });
                obs.disconnect();
            }
        });
    }, { threshold: 0.3 });
    if (skillsSection) skillsObserver.observe(skillsSection);

    /* ---------- Animated stat counters ---------- */
    const stats = document.getElementById("stats");
    const counters = document.querySelectorAll(".stat-num");
    const animateCount = (el) => {
        const target = parseFloat(el.getAttribute("data-target"));
        const decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
        const suffix = el.getAttribute("data-suffix") || "";
        const duration = 1600;
        const start = performance.now();

        const tick = (now) => {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
            const value = target * eased;
            el.textContent = (decimals ? value.toFixed(decimals) : Math.floor(value)) + suffix;
            if (p < 1) requestAnimationFrame(tick);
            else el.textContent = (decimals ? target.toFixed(decimals) : target) + suffix;
        };
        requestAnimationFrame(tick);
    };
    const statsObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                counters.forEach(animateCount);
                obs.disconnect();
            }
        });
    }, { threshold: 0.4 });
    if (stats) statsObserver.observe(stats);

    /* ---------- Scrollspy: highlight active nav link ---------- */
    const navLinks = document.querySelectorAll(".nav-link");
    const navTargets = new Set([...navLinks].map(l => l.getAttribute("href")));
    const sections = [...document.querySelectorAll("section[id]")]
        .filter(sec => navTargets.has("#" + sec.id));
    const spyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute("id");
                navLinks.forEach(link =>
                    link.classList.toggle("active", link.getAttribute("href") === "#" + id)
                );
            }
        });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(sec => spyObserver.observe(sec));

    /* ---------- Random quote generator ---------- */
    const quotes = [
        "Code is like humor. When you have to explain it, it's bad.",
        "Simplicity is the soul of efficiency.",
        "The function of good software is to make the complex appear to be simple.",
        "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
        "First, solve the problem. Then, write the code.",
        "Talk is cheap. Show me the code.",
        "Programs must be written for people to read, and only incidentally for machines to execute."
    ];
    const quoteDisplay = document.getElementById("quote-display");
    const quoteBtn = document.getElementById("quote-btn");
    let lastQuote = -1;
    quoteBtn.addEventListener("click", () => {
        let idx;
        do { idx = Math.floor(Math.random() * quotes.length); } while (idx === lastQuote && quotes.length > 1);
        lastQuote = idx;
        quoteDisplay.style.opacity = "0";
        setTimeout(() => {
            quoteDisplay.textContent = '"' + quotes[idx] + '"';
            quoteDisplay.style.opacity = "1";
        }, 200);
    });
    quoteDisplay.style.transition = "opacity 0.25s ease";

    /* ---------- Contact form: inline validation (no alerts) ---------- */
    const form = document.getElementById("contact-form");
    const success = document.getElementById("form-success");

    const setError = (field, msg) => {
        const input = form.querySelector(`#${field}`);
        const small = form.querySelector(`.error[data-for="${field}"]`);
        if (small) small.textContent = msg;
        if (input) input.classList.toggle("invalid", Boolean(msg));
        return !msg;
    };

    const validators = {
        name: (v) => v.trim() === "" ? "Please enter your name." : "",
        email: (v) => {
            if (v.trim() === "") return "Please enter your email.";
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "" : "Please enter a valid email address.";
        },
        message: (v) => v.trim().length < 10 ? "Message should be at least 10 characters." : ""
    };

    // Live-clear errors as the user types
    Object.keys(validators).forEach(field => {
        const input = form.querySelector(`#${field}`);
        input.addEventListener("input", () => {
            if (input.classList.contains("invalid")) setError(field, validators[field](input.value));
        });
    });

    // Web3Forms access key — get a free one at https://web3forms.com
    const WEB3FORMS_ACCESS_KEY = "f3dacc1b-6315-453b-b251-5cee0667a347";

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        let valid = true;
        const data = {};
        Object.keys(validators).forEach(field => {
            const input = form.querySelector(`#${field}`);
            valid = setError(field, validators[field](input.value)) && valid;
            data[field] = input.value;
        });

        if (!valid) {
            success.classList.remove("show");
            return;
        }

        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        btn.disabled = true;
        btn.textContent = "Sending…";

        try {
            const res = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json", Accept: "application/json" },
                body: JSON.stringify({
                    access_key: WEB3FORMS_ACCESS_KEY,
                    subject: "New message from your portfolio",
                    from_name: "Portfolio Contact Form",
                    name: data.name,
                    email: data.email,
                    message: data.message
                })
            });
            const result = await res.json();
            if (result.success) {
                success.textContent = "✅ Thanks! Your message has been sent — I'll reply soon.";
                success.classList.add("show");
                form.reset();
                setTimeout(() => success.classList.remove("show"), 6000);
            } else {
                throw new Error(result.message || "Submission failed");
            }
        } catch (err) {
            success.textContent = "⚠️ Couldn't send right now — please email me at shashwatpandeyoffcog3039@gmail.com.";
            success.classList.add("show");
        } finally {
            btn.disabled = false;
            btn.textContent = originalText;
        }
    });

    /* ---------- Dynamic footer year ---------- */
    document.getElementById("year").textContent = new Date().getFullYear();
});
