import re

with open('src/pages/Landing.jsx', 'r') as f:
    content = f.read()

sections = [
    ('background-section', 'id="background">'),
    ('service-features-section', 'id="features">'),
    ('pdf-features-section', 'id="system">'),
    ('qa-section', 'id="faq">')
]

for cls, id_str in sections:
    # Find the section start
    start_tag = f'<section className="{cls} full-screen-section" {id_str}'
    if start_tag in content:
        # We need to inject <div className="section-inner"> right after it
        # and </div> right before the matching </section>
        
        # It's easier to just use regex to match the section block
        pattern = re.compile(rf'({re.escape(start_tag)})(.*?)(^\s*</section>)', re.DOTALL | re.MULTILINE)
        
        def replacer(match):
            return match.group(1) + '\n        <div className="section-inner">' + match.group(2) + '        </div>\n' + match.group(3)
            
        content = pattern.sub(replacer, content)

with open('src/pages/Landing.jsx', 'w') as f:
    f.write(content)
