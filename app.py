from flask import Flask, render_template, request, redirect, url_for, flash
import os

app = Flask(__name__, static_url_path='/static', static_folder='static')
app.secret_key = 'your-secret-key'  # Required for flash messages

# Sample data
nav_items = [
    {'href': 'top', 'label': 'Home'},
    {'href': 'cyber-defense-matrix', 'label': 'About'},
    {'href': 'security-matrix', 'label': 'Services'},
    {'href': 'achievements', 'label': 'Projects'},
    {'href': 'cyber-insights', 'label': 'Insights'},
    {'href': 'get-in-touch', 'label': 'Contact'},
]

services = [
    {'icon': 'shield', 'title': 'Penetration Testing', 'description': 'Identify vulnerabilities before attackers do.',
     'features': ['Network Testing', 'Web App Testing', 'Social Engineering']},
    {'icon': 'lock', 'title': 'Threat Intelligence', 'description': 'Stay ahead of emerging threats.',
     'features': ['Real-time Monitoring', 'Threat Analysis', 'Incident Response']},
    {'icon': 'code', 'title': 'Secure Development', 'description': 'Build secure applications from the ground up.',
     'features': ['Code Review', 'Secure SDLC', 'DevSecOps']},
    {'icon': 'alert-circle', 'title': 'Incident Response', 'description': 'Rapid response to security incidents.',
     'features': ['Forensics', 'Containment', 'Recovery']},
    {'icon': 'server', 'title': 'Infrastructure Security',
     'description': 'Robust protection for your network, systems, and Active Directory.',
     'features': ['Cloud Security', 'Network Defense', 'Active Directory Audit', 'Security Architecture']},
    {'icon': 'check-square', 'title': 'Compliance & Standards',
     'description': 'Ensure your security measures align with industry regulations and best practices for maximum protection.',
     'features': ['ISO 27001', 'GDPR Compliance', 'PCI DSS', 'HIPAA Security']},
    {'icon': 'shield-check', 'title': 'Vulnerability Management',
     'description': 'Continuous monitoring and assessment of your systems to identify and remediate vulnerabilities promptly.',
     'features': ['Threat Detection', 'Risk Assessment', 'Patch Management', 'Security Posture Assessment']},
    {'icon': 'key', 'title': 'Zero-Trust Architecture',
     'description': 'Establish robust trust and enforce strict identity verification across all access points to enhance security.',
     'features': ['Micro-Segmentation', 'Identity & Access Management', 'Least Privilege Enforcement', 'Continuous Authentication']},
]

projects = [
    {'title': 'Enterprise Network Security', 'description': 'Secured a global enterprise network against advanced threats.',
     'technologies': ['Firewall', 'SIEM', 'IDS/IPS']},
    {'title': 'Web App Penetration Test', 'description': 'Identified and mitigated vulnerabilities in a financial app.',
     'technologies': ['OWASP', 'Burp Suite', 'Kali Linux']},
    {'title': 'Cloud Security Implementation', 'description': 'Enhanced security for a cloud-based infrastructure.',
     'technologies': ['AWS', 'Azure', 'IAM']},
    {'title': 'IoT Device Hardening', 'description': 'Secured a fleet of smart devices used in healthcare.',
     'technologies': ['Nmap', 'Firmware Analysis', 'TLS Encryption']},
    {'title': 'Red Team Simulation', 'description': 'Tested internal controls via adversary simulation.',
     'technologies': ['Metasploit', 'Empire', 'C2 Servers']},
]

posts = [
    {
        'title': 'The Rise of Ransomware in 2024',
        'description': 'How ransomware continues to evolve and what you can do about it.',
        'category': 'Threat Analysis',
        'author': {'name': 'John Doe', 'role': 'Security Analyst', 'avatar': '/static/images/avatar1.jpg'},
        'tags': ['Ransomware', 'Cybersecurity', 'Defense'],
        'read_time': '5 min read',
        'views': '1.2k views',
        'image': 'blog_1.png',
        'link': 'https://www.acigjournal.com/Ransomware-Why-It-s-Growing-and-How-to-Curb-Its-Growth,192959,0,2.html'
    },
    {
        'title': 'Zero Trust Architecture Explained',
        'description': 'Why Zero Trust is the future of cybersecurity.',
        'category': 'Architecture',
        'author': {'name': 'Jane Smith', 'role': 'Security Architect', 'avatar': '/static/images/avatar2.jpg'},
        'tags': ['Zero Trust', 'Security', 'Network'],
        'read_time': '7 min read',
        'views': '2.5k views',
        'image': 'blog_2.png',
        'link': 'https://nvlpubs.nist.gov/nistpubs/specialpublications/NIST.SP.800-207.pdf'
    },
    {
        'title': 'AI in Cybersecurity: The Next Frontier',
        'description': 'Exploring how AI is transforming threat detection and response strategies.',
        'category': 'Innovation',
        'author': {'name': 'Alex Carter', 'role': 'AI Security Expert', 'avatar': '/static/images/avatar3.jpg'},
        'tags': ['AI', 'Cybersecurity', 'Threat Hunting'],
        'read_time': '6 min read',
        'views': '1.8k views',
        'image': 'blog_3.png',
        'link': 'https://www.tandfonline.com/doi/full/10.1080/08839514.2024.2439609#d1e363'
    },
    {
        'title': 'Insider Threats: A Growing Challenge',
        'description': 'Mitigating risk from within your organization.',
        'category': 'Risk Management',
        'author': {'name': 'Sara Lang', 'role': 'CISO', 'avatar': '/static/images/avatar4.jpg'},
        'tags': ['Insider Threats', 'Policy', 'Training'],
        'read_time': '4 min read',
        'views': '980 views',
        'image': 'blog_4.png',
        'link': 'http://mdpi.com/2079-9292/9/9/1460'
    },
]

departments = [
    {'id': 'sales', 'label': 'Sales'},
    {'id': 'support', 'label': 'Support'},
    {'id': 'technical', 'label': 'Technical'},
]

contact_methods = [
    {'icon': 'mail', 'title': 'Email', 'value': 'contact@cyberburgs.com', 'link': 'mailto:contact@cyberburgs.com'},
    {'icon': 'phone', 'title': 'Phone', 'value': '+92 123 456 7890', 'link': 'tel:+921234567890'},
    {'icon': 'map-pin', 'title': 'Location', 'value': 'Imarat Cyber Tower, Islamabad'},
    {'icon': 'clock', 'title': 'Hours', 'value': 'Mon-Fri: 9 AM - 5 PM'},
]

social_links = [
    {'href': 'https://github.com/cyberburgs', 'label': 'GitHub', 'icon': 'github'},
    {'href': 'https://linkedin.com/company/cyberburgs', 'label': 'LinkedIn', 'icon': 'linkedin'},
    {'href': 'https://twitter.com/cyberburgs', 'label': 'Twitter', 'icon': 'twitter'},
    {'href': 'https://youtube.com/cyberburgs', 'label': 'YouTube', 'icon': 'youtube'},
    {'href': 'https://instagram.com/cyberburgs', 'label': 'Instagram', 'icon': 'instagram'},
    {'href': 'https://discord.gg/cyberburgs', 'label': 'Discord', 'icon': 'discord'},
]

@app.route('/')
def index():
    return render_template(
        'index.html',
        nav_items=nav_items,
        services=services,
        projects=projects,
        all_projects=projects,
        posts=posts,
        all_posts=posts,
        departments=departments,
        contact_methods=contact_methods,
        social_links=social_links
    )

@app.route('/contact', methods=['POST'])
def contact():
    first_name = request.form.get('firstName')
    last_name = request.form.get('lastName')
    email = request.form.get('email')
    message = request.form.get('message')

    print(f"Message from {first_name} {last_name} ({email}): {message}")
    flash("Your message has been sent successfully!", "success")
    return redirect(url_for('index'))

@app.route('/load-more-projects')
def load_more_projects():
    return render_template('partials/_projects.html', projects=projects)

@app.route('/load-more-insights')
def load_more_insights():
    return render_template('partials/_insights.html', posts=posts)

if __name__ == '__main__':
    app.run(debug=True)