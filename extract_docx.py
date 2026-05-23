import zipfile
import xml.etree.ElementTree as ET

docx_path = r"d:\Depresion detection using eeg signal\Team profile\Team Profile.docx"

try:
    with zipfile.ZipFile(docx_path) as docx:
        # Get XML content
        xml_content = docx.read('word/document.xml')
        root = ET.fromstring(xml_content)
        
        # Word XML namespaces
        ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
        
        # Extract text elements
        text_runs = []
        for paragraph in root.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}p'):
            p_text = []
            for run in paragraph.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}t'):
                if run.text:
                    p_text.append(run.text)
            if p_text:
                text_runs.append("".join(p_text))
        
        print("\n".join(text_runs))
except Exception as e:
    print("Error:", e)
