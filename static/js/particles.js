particlesJS('particles-js', {
    particles: {
        number: { value: 40, density: { enable: true, value_area: 800 }},
        color: { value: "#ffffff" },
        shape: { type: "circle" },
        opacity: {
            value: 1,
            random: false,
            anim: { enable: false }
        },
        size: {
            value: 4,
            random: false,
            anim: { enable: false }
        },
        line_linked: {
            enable: true,
            distance: 150,
            color: "#ffffff",
            opacity: 0.6,
            width: 3
        },
        move: {
            enable: true,
            speed: 2,
            direction: "none",
            random: true,
            straight: false,
            out_mode: "out",
            bounce: false
        }
    },
    interactivity: {
        detect_on: "canvas",
        events: {
            onhover: { enable: true, mode: "repulse" },
            onclick: { enable: true, mode: "push" }
        },
        modes: {
            repulse: { distance: 100, duration: 0.4 },
            push: { particles_nb: 4 }
        }
    },
    retina_detect: true
});