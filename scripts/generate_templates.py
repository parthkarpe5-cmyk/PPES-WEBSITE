import os
import zipfile
import xml.etree.ElementTree as ET

# Define template paths
target_dir = r"d:\projects\test\PPES-WEBSITE\frontend\public\templates"
os.makedirs(target_dir, exist_ok=True)

csv_path = os.path.join(target_dir, "template.csv")
txt_path = os.path.join(target_dir, "template.txt")
docx_path = os.path.join(target_dir, "template.docx")

# 1. Create CSV Template
csv_content = """Type,Question Text,Points,Option A,Option B,Option C,Option D,Correct Answer
MCQ,What is the capital of France?,5,Paris,London,Berlin,Rome,Paris
MULTIPLE_SELECT,Which of the following are prime numbers?,5,2,4,5,9,2|5
DESCRIPTIVE,Explain photosynthesis in your own words.,10,,,,
CODING,"Write a JavaScript function to reverse a string (e.g. reverseString(""hello"") -> ""olleh"").",15,,,,
"""

with open(csv_path, "w", encoding="utf-8") as f:
    f.write(csv_content)

print(f"Created CSV template at {csv_path}")

# 2. Create TXT Template
txt_content = """Question 1
Type: MCQ
Points: 5
Text: What is the capital of France?
Options:
- Paris
- London
- Berlin
- Rome
Correct Answer: Paris

Question 2
Type: MULTIPLE_SELECT
Points: 5
Text: Which of the following are prime numbers?
Options:
- 2
- 4
- 5
- 9
Correct Answer: 2|5

Question 3
Type: DESCRIPTIVE
Points: 10
Text: Explain photosynthesis in your own words.

Question 4
Type: CODING
Points: 15
Text: Write a JavaScript function to reverse a string (e.g. reverseString("hello") -> "olleh").
"""

with open(txt_path, "w", encoding="utf-8") as f:
    f.write(txt_content)

print(f"Created TXT template at {txt_path}")

# 3. Create DOCX Template (Zipped XML structure)
def create_docx(dest_path, text_content):
    # XML structure for [Content_Types].xml
    content_types = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>"""

    # XML structure for _rels/.rels
    rels = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>"""

    # XML structure for word/document.xml (paragraphs for each line)
    doc_lines = text_content.split('\n')
    paragraphs = []
    for line in doc_lines:
        # Escape XML entities
        escaped_line = line.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
        paragraphs.append(f"""<w:p>
      <w:r>
        <w:t>{escaped_line}</w:t>
      </w:r>
    </w:p>""")
        
    document_xml = f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    {"".join(paragraphs)}
  </w:body>
</w:document>"""

    # Write to zip file (which is a .docx)
    with zipfile.ZipFile(dest_path, 'w', zipfile.ZIP_DEFLATED) as docx:
        docx.writestr("[Content_Types].xml", content_types)
        docx.writestr("_rels/.rels", rels)
        docx.writestr("word/document.xml", document_xml)

create_docx(docx_path, txt_content)
print(f"Created DOCX template at {docx_path}")
