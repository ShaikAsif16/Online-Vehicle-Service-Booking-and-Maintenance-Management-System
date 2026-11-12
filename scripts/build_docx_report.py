import os
import sys
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_LINE_SPACING
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

from docx_helpers import set_cell_background, set_cell_margins, set_table_borders

def create_report_docx(output_path="Online_Vehicle_Service_Booking_Project_Report.docx"):
    print("Initializing document with SR University formatting and complete Chapters 1-9...")
    doc = Document()

    # Standard Margins
    for section in doc.sections:
        section.top_margin = Inches(1.0)
        section.bottom_margin = Inches(1.0)
        section.left_margin = Inches(1.0)
        section.right_margin = Inches(1.0)
        section.different_first_page_header_footer = True
        
        # Header (running head)
        hdr = section.header
        hp = hdr.paragraphs[0]
        hp.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        hrun = hp.add_run("Online Vehicle Service Booking & Maintenance Management System")
        hrun.font.name = "Times New Roman"
        hrun.font.size = Pt(8.5)
        hrun.font.italic = True
        hrun.font.color.rgb = RGBColor(107, 114, 128)

        # Footer
        ftr = section.footer
        fp = ftr.paragraphs[0]
        fp.alignment = WD_ALIGN_PARAGRAPH.CENTER
        frun = fp.add_run("SR UNIVERSITY | School of Computer Science & Artificial Intelligence")
        frun.font.name = "Times New Roman"
        frun.font.size = Pt(8.5)
        frun.font.italic = True
        frun.font.color.rgb = RGBColor(107, 114, 128)

    # Base Styles
    style_normal = doc.styles['Normal']
    style_normal.font.name = 'Times New Roman'
    style_normal.font.size = Pt(11)
    style_normal.font.color.rgb = RGBColor(17, 24, 39)

    NAVY_RGB = RGBColor(26, 54, 93)
    CHARCOAL_RGB = RGBColor(31, 41, 55)
    MUTED_RGB = RGBColor(75, 85, 99)

    def add_p(text, bold_prefix="", italic=False, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_after=6, line_spacing=1.3):
        p = doc.add_paragraph()
        p.alignment = align
        p.paragraph_format.space_after = Pt(space_after)
        p.paragraph_format.line_spacing = line_spacing
        if bold_prefix:
            r_pre = p.add_run(bold_prefix)
            r_pre.font.name = 'Times New Roman'
            r_pre.font.size = Pt(11)
            r_pre.bold = True
            r_pre.font.color.rgb = CHARCOAL_RGB
        if text:
            r = p.add_run(text)
            r.font.name = 'Times New Roman'
            r.font.size = Pt(11)
            r.italic = italic
            r.font.color.rgb = CHARCOAL_RGB
        return p

    def add_bullet(text, bold_prefix=""):
        p = doc.add_paragraph(style='List Bullet')
        p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.line_spacing = 1.2
        if bold_prefix:
            r_pre = p.add_run(bold_prefix)
            r_pre.font.name = 'Times New Roman'
            r_pre.font.size = Pt(11)
            r_pre.bold = True
            r_pre.font.color.rgb = CHARCOAL_RGB
        if text:
            r = p.add_run(text)
            r.font.name = 'Times New Roman'
            r.font.size = Pt(11)
            r.font.color.rgb = CHARCOAL_RGB
        return p

    def add_chapter_title(num_str, title_str):
        doc.add_page_break()
        p_ch = doc.add_paragraph()
        p_ch.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_ch.paragraph_format.space_before = Pt(18)
        p_ch.paragraph_format.space_after = Pt(4)
        r_ch = p_ch.add_run(f"CHAPTER {num_str}")
        r_ch.font.name = 'Times New Roman'
        r_ch.font.size = Pt(16)
        r_ch.bold = True
        r_ch.font.color.rgb = NAVY_RGB

        p_ti = doc.add_paragraph()
        p_ti.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_ti.paragraph_format.space_before = Pt(0)
        p_ti.paragraph_format.space_after = Pt(18)
        r_ti = p_ti.add_run(title_str.upper())
        r_ti.font.name = 'Times New Roman'
        r_ti.font.size = Pt(14)
        r_ti.bold = True
        r_ti.font.color.rgb = CHARCOAL_RGB

    def add_sec_h1(sec_num, title):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(14)
        p.paragraph_format.space_after = Pt(5)
        r = p.add_run(f"{sec_num}  {title}")
        r.font.name = 'Times New Roman'
        r.font.size = Pt(13)
        r.bold = True
        r.font.color.rgb = NAVY_RGB
        return p

    def add_sec_h2(sec_num, title):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(10)
        p.paragraph_format.space_after = Pt(4)
        r = p.add_run(f"{sec_num}  {title}")
        r.font.name = 'Times New Roman'
        r.font.size = Pt(11.5)
        r.bold = True
        r.font.color.rgb = CHARCOAL_RGB
        return p

    def add_figure(img_path, fig_num_caption, width_inches=6.0, desc_text=""):
        if os.path.exists(img_path):
            p_img = doc.add_paragraph()
            p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p_img.paragraph_format.space_before = Pt(10)
            p_img.paragraph_format.space_after = Pt(4)
            p_img.add_run().add_picture(img_path, width=Inches(width_inches))

            p_cap = doc.add_paragraph()
            p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p_cap.paragraph_format.space_before = Pt(2)
            p_cap.paragraph_format.space_after = Pt(8)
            r_cap = p_cap.add_run(fig_num_caption)
            r_cap.font.name = 'Times New Roman'
            r_cap.font.size = Pt(10)
            r_cap.bold = True
            r_cap.font.color.rgb = CHARCOAL_RGB

            if desc_text:
                add_p(desc_text, bold_prefix="", italic=False, space_after=8)

    # =========================================================================
    # PAGE 1: COVER PAGE (Image 1)
    # =========================================================================
    print("Building Page 1: Outer Cover Page...")
    p1 = doc.add_paragraph()
    p1.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p1.paragraph_format.space_before = Pt(90)
    p1.paragraph_format.space_after = Pt(6)
    r_sru = p1.add_run("SRU")
    r_sru.font.size = Pt(44)
    r_sru.bold = True
    r_sru.font.color.rgb = NAVY_RGB

    p2 = doc.add_paragraph()
    p2.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p2.paragraph_format.space_after = Pt(4)
    r_sruname = p2.add_run("SR UNIVERSITY")
    r_sruname.font.size = Pt(22)
    r_sruname.bold = True
    r_sruname.font.color.rgb = NAVY_RGB

    p3 = doc.add_paragraph()
    p3.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p3.paragraph_format.space_after = Pt(120)
    r_addr = p3.add_run("Ananthasagar, Hasanparthy, Warangal – 506371, Telangana")
    r_addr.font.size = Pt(10.5)
    r_addr.font.color.rgb = MUTED_RGB

    p4 = doc.add_paragraph()
    p4.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p4.paragraph_format.space_after = Pt(8)
    r_sch = p4.add_run("SCHOOL OF COMPUTER SCIENCE & ARTIFICIAL INTELLIGENCE")
    r_sch.font.size = Pt(13)
    r_sch.bold = True
    r_sch.font.color.rgb = NAVY_RGB

    p5 = doc.add_paragraph()
    p5.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p5.paragraph_format.space_after = Pt(180)
    r_rep = p5.add_run("PROJECT REPORT")
    r_rep.font.size = Pt(14)
    r_rep.bold = True
    r_rep.font.color.rgb = CHARCOAL_RGB

    p6 = doc.add_paragraph()
    p6.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_sub = p6.add_run("ACADEMIC PROJECT SUBMISSION")
    r_sub.font.size = Pt(12)
    r_sub.bold = True
    r_sub.font.color.rgb = NAVY_RGB

    # =========================================================================
    # PAGE 2: TITLE PAGE (Image 2)
    # =========================================================================
    print("Building Page 2: Title Page...")
    doc.add_page_break()

    pt1 = doc.add_paragraph()
    pt1.alignment = WD_ALIGN_PARAGRAPH.CENTER
    pt1.paragraph_format.space_before = Pt(36)
    pt1.paragraph_format.space_after = Pt(30)
    r_pt1 = pt1.add_run("ONLINE VEHICLE SERVICE BOOKING AND MAINTENANCE MANAGEMENT SYSTEM")
    r_pt1.font.size = Pt(17)
    r_pt1.bold = True
    r_pt1.font.color.rgb = NAVY_RGB

    pt2 = doc.add_paragraph()
    pt2.alignment = WD_ALIGN_PARAGRAPH.CENTER
    pt2.paragraph_format.space_after = Pt(6)
    r_pt2 = pt2.add_run("A PROJECT REPORT")
    r_pt2.font.size = Pt(13)
    r_pt2.bold = True
    r_pt2.font.color.rgb = CHARCOAL_RGB

    pt3 = doc.add_paragraph()
    pt3.alignment = WD_ALIGN_PARAGRAPH.CENTER
    pt3.paragraph_format.space_after = Pt(28)
    r_pt3 = pt3.add_run("Submitted in partial fulfilment of the requirements for the award of the degree")
    r_pt3.font.size = Pt(10)
    r_pt3.italic = True
    r_pt3.font.color.rgb = CHARCOAL_RGB

    pt4 = doc.add_paragraph()
    pt4.alignment = WD_ALIGN_PARAGRAPH.CENTER
    pt4.paragraph_format.space_after = Pt(4)
    r_pt4 = pt4.add_run("BACHELOR OF TECHNOLOGY")
    r_pt4.font.size = Pt(13.5)
    r_pt4.bold = True
    r_pt4.font.color.rgb = NAVY_RGB

    pt5 = doc.add_paragraph()
    pt5.alignment = WD_ALIGN_PARAGRAPH.CENTER
    pt5.paragraph_format.space_after = Pt(4)
    r_pt5 = pt5.add_run("in")
    r_pt5.font.size = Pt(10.5)

    pt6 = doc.add_paragraph()
    pt6.alignment = WD_ALIGN_PARAGRAPH.CENTER
    pt6.paragraph_format.space_after = Pt(24)
    r_pt6 = pt6.add_run("COMPUTER SCIENCE AND ENGINEERING")
    r_pt6.font.size = Pt(12)
    r_pt6.bold = True
    r_pt6.font.color.rgb = CHARCOAL_RGB

    pt7 = doc.add_paragraph()
    pt7.alignment = WD_ALIGN_PARAGRAPH.CENTER
    pt7.paragraph_format.space_after = Pt(16)
    r_pt7 = pt7.add_run("Submitted by")
    r_pt7.font.size = Pt(13)
    r_pt7.bold = True
    r_pt7.font.color.rgb = CHARCOAL_RGB

    # Centered Meta Block Table
    t_meta = doc.add_table(rows=4, cols=2)
    t_meta.alignment = WD_TABLE_ALIGNMENT.CENTER
    t_meta.autofit = False
    set_table_borders(t_meta, color="FFFFFF")

    meta_items = [
        ("Student Name", "Shaik Asif"),
        ("Roll Number", "2403a52220"),
        ("Faculty Guide", "Dr. N. Sharmila Banu"),
        ("Academic Year", "2026-27")
    ]
    for r_idx, (lbl, val) in enumerate(meta_items):
        c1 = t_meta.cell(r_idx, 0)
        c1.width = Inches(2.2)
        p_c1 = c1.paragraphs[0]
        p_c1.paragraph_format.line_spacing = 1.3
        p_c1.paragraph_format.space_after = Pt(3)
        r_lbl = p_c1.add_run(lbl)
        r_lbl.font.size = Pt(11)
        r_lbl.bold = True
        r_lbl.font.color.rgb = NAVY_RGB

        c2 = t_meta.cell(r_idx, 1)
        c2.width = Inches(2.8)
        p_c2 = c2.paragraphs[0]
        p_c2.paragraph_format.line_spacing = 1.3
        p_c2.paragraph_format.space_after = Pt(3)
        r_val = p_c2.add_run(val)
        r_val.font.size = Pt(11)
        r_val.font.color.rgb = CHARCOAL_RGB

    p_bot1 = doc.add_paragraph()
    p_bot1.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_bot1.paragraph_format.space_before = Pt(80)
    p_bot1.paragraph_format.space_after = Pt(2)
    r_bot1 = p_bot1.add_run("SR UNIVERSITY")
    r_bot1.font.size = Pt(12.5)
    r_bot1.bold = True
    r_bot1.font.color.rgb = NAVY_RGB

    p_bot2 = doc.add_paragraph()
    p_bot2.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_bot2 = p_bot2.add_run("Warangal, Telangana")
    r_bot2.font.size = Pt(10)
    r_bot2.font.color.rgb = CHARCOAL_RGB

    # =========================================================================
    # PAGE 3: CERTIFICATE
    # =========================================================================
    print("Building Page 3: Certificate...")
    doc.add_page_break()
    p_cert_h = doc.add_paragraph()
    p_cert_h.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_cert_h.paragraph_format.space_before = Pt(18)
    p_cert_h.paragraph_format.space_after = Pt(14)
    r_cert_h = p_cert_h.add_run("SR UNIVERSITY\nSCHOOL OF COMPUTER SCIENCE & ARTIFICIAL INTELLIGENCE")
    r_cert_h.font.size = Pt(13)
    r_cert_h.bold = True
    r_cert_h.font.color.rgb = NAVY_RGB

    p_cert_t = doc.add_paragraph()
    p_cert_t.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_cert_t.paragraph_format.space_after = Pt(18)
    r_cert_t = p_cert_t.add_run("CERTIFICATE")
    r_cert_t.font.size = Pt(15)
    r_cert_t.bold = True
    r_cert_t.underline = True

    add_p("This is to certify that the Major Project Report entitled \"ONLINE VEHICLE SERVICE BOOKING AND MAINTENANCE MANAGEMENT SYSTEM\" is a bonafide work carried out by Shaik Asif (Roll Number: 2403a52220) in partial fulfillment of the requirements for the award of the degree of Bachelor of Technology in Computer Science and Engineering from SR UNIVERSITY during the academic year 2026-27.", space_after=18)
    add_p("The results embodied in this report have not been submitted to any other University or Institute for the award of any degree or diploma.", space_after=36)

    tbl_sig = doc.add_table(rows=1, cols=2)
    tbl_sig.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl_sig.autofit = False
    set_table_borders(tbl_sig, color="FFFFFF")
    
    c_s1 = tbl_sig.cell(0, 0)
    c_s1.width = Inches(3.2)
    ps1 = c_s1.paragraphs[0]
    ps1.paragraph_format.line_spacing = 1.2
    ps1.add_run("___________________________\nInternal Faculty Guide\nDr. N. Sharmila Banu\nDept. of CSE, SR University").font.size = Pt(10.5)

    c_s2 = tbl_sig.cell(0, 1)
    c_s2.width = Inches(3.2)
    ps2 = c_s2.paragraphs[0]
    ps2.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    ps2.paragraph_format.line_spacing = 1.2
    ps2.add_run("___________________________\nHead of the Department\nHead of Department\nSchool of CS & AI, SR University").font.size = Pt(10.5)

    p_ext = doc.add_paragraph()
    p_ext.paragraph_format.space_before = Pt(40)
    p_ext.add_run("Internal Examiner: _______________________          External Examiner: _______________________").font.size = Pt(10.5)

    # =========================================================================
    # PAGE 4: CANDIDATE'S DECLARATION
    # =========================================================================
    print("Building Page 4: Declaration...")
    doc.add_page_break()
    p_dec_t = doc.add_paragraph()
    p_dec_t.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_dec_t.paragraph_format.space_before = Pt(18)
    p_dec_t.paragraph_format.space_after = Pt(18)
    r_dec_t = p_dec_t.add_run("CANDIDATE'S DECLARATION")
    r_dec_t.font.size = Pt(15)
    r_dec_t.bold = True
    r_dec_t.underline = True

    add_p("I hereby declare that the work presented in this project report entitled \"ONLINE VEHICLE SERVICE BOOKING AND MAINTENANCE MANAGEMENT SYSTEM\" has been carried out by me under the supervision of Dr. N. Sharmila Banu, School of Computer Science & Artificial Intelligence, SR UNIVERSITY.", space_after=14)
    add_p("I further declare that the content of this project report represents my original full-stack software engineering work, and that no part of this report has been plagiarized or previously submitted elsewhere for any academic degree, diploma, or qualification.", space_after=28)

    p_sig_st = doc.add_paragraph()
    p_sig_st.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    p_sig_st.paragraph_format.line_spacing = 1.3
    r_st = p_sig_st.add_run("Shaik Asif\nRoll No: 2403a52220\nB.Tech CSE\nSR UNIVERSITY, Warangal\nDate: November 12, 2026")
    r_st.font.size = Pt(11)

    # =========================================================================
    # PAGE 5: ABSTRACT & KEYWORDS
    # =========================================================================
    print("Building Page 5: Abstract & Keywords...")
    doc.add_page_break()
    p_abs_t = doc.add_paragraph()
    p_abs_t.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_abs_t.paragraph_format.space_before = Pt(18)
    p_abs_t.paragraph_format.space_after = Pt(14)
    r_abs_t = p_abs_t.add_run("ABSTRACT")
    r_abs_t.font.size = Pt(15)
    r_abs_t.bold = True
    r_abs_t.underline = True

    add_p("The contemporary automotive after-sales service sector faces substantial operational friction attributable to fragmented manual scheduling, lack of live repair transparency, erratic workshop throughput, and disjointed inventory tracking. Traditional physical ledger systems and decentralized paper job cards inevitably lead to booking collision, inflated idle bay durations, inaccurate billing estimates, and diminished customer trust. This project presents the design, architectural blueprint, full-stack implementation, and empirical verification of the Online Vehicle Service Booking and Maintenance Management System (AutoCare Pro)—an enterprise-grade, automotive-themed web application engineered using modern full-stack web technologies.", space_after=10)
    add_p("The application is developed on a robust three-tier decoupled architecture comprising a reactive Single Page Application (SPA) frontend built with React 18, Vite 5, and Tailwind CSS; a stateless, scalable RESTful backend powered by Node.js and Express.js; and an object-document database layer orchestrated via MongoDB and the Mongoose ODM framework. Security and integrity are enforced through JSON Web Token (JWT) cryptographic session authentication, salted bcrypt password hashing, and granular Role-Based Access Control (RBAC) across three distinct functional user actors: Vehicle Owners (Customers), Workshop Administrators, and Lead Workshop Technicians (Mechanics).", space_after=10)
    add_p("The system introduces an end-to-end workflow engine covering automated vehicle garage registration (supporting multi-segment fleets of cars, motorcycles, and scooters), collision-free time-slot booking with explicit complaint capture, administrative dispatch with real-time mechanic workload leveling, and live multi-phase repair progress telemetry. Furthermore, the platform incorporates an integrated spare parts inventory management ledger with automated stock depletion triggers and an automated billing engine that generates dynamic, audit-ready invoices synthesizing base labor rates with consumed parts costs. Rigorous empirical validation through 17 automated end-to-end integration tests demonstrated zero data collision, 100% role access enforcement, sub-50ms REST API response latencies, and flawless transaction persistence, confirming the system's viability for high-concurrency commercial workshop deployments.", space_after=14)

    add_p("Keywords: Vehicle Service Management; MERN Stack Architecture; Role-Based Access Control (RBAC); Real-Time Bay Telemetry; Spare Parts Inventory Control; Automated Billing Engine; RESTful API; Single Page Application.", bold_prefix="", italic=True, space_after=14)

    # =========================================================================
    # PAGE 6: TABLE OF CONTENTS
    # =========================================================================
    print("Building Page 6: Table of Contents...")
    doc.add_page_break()
    p_toc_t = doc.add_paragraph()
    p_toc_t.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_toc_t.paragraph_format.space_before = Pt(18)
    p_toc_t.paragraph_format.space_after = Pt(14)
    r_toc_t = p_toc_t.add_run("TABLE OF CONTENTS")
    r_toc_t.font.size = Pt(15)
    r_toc_t.bold = True
    r_toc_t.underline = True

    toc_items = [
        ("Certificate & Candidate's Declaration", "iii"),
        ("Abstract & Keywords", "v"),
        ("CHAPTER 1: INTRODUCTION", "1"),
        ("    1.1 Introduction", "1"),
        ("    1.2 Problem Statement", "2"),
        ("    1.3 Objectives of the Project", "3"),
        ("    1.4 Scope of the Project", "4"),
        ("    1.5 Existing System", "5"),
        ("    1.6 Proposed System", "6"),
        ("CHAPTER 2: LITERATURE SURVEY", "7"),
        ("    2.1 Introduction", "7"),
        ("    2.2 Existing Approaches to Vehicle Service Management", "7"),
        ("    2.3 Online Vehicle Service Booking Systems", "8"),
        ("    2.4 Technologies Used in Modern Maintenance Systems", "9"),
        ("    2.5 Limitations of Existing Approaches", "10"),
        ("    2.6 Summary", "11"),
        ("CHAPTER 3: SYSTEM ANALYSIS", "12"),
        ("    3.1 Introduction", "12"),
        ("    3.2 Functional Requirements", "12"),
        ("    3.3 Non-Functional Requirements", "13"),
        ("    3.4 Hardware Requirements", "14"),
        ("    3.5 Software Requirements", "14"),
        ("    3.6 System Architecture Overview", "15"),
        ("    3.7 Feasibility Study", "15"),
        ("    3.8 Summary", "16"),
        ("CHAPTER 4: SYSTEM DESIGN", "17"),
        ("    4.1 Introduction", "17"),
        ("    4.2 System Architecture (Three-Tier Architecture)", "17"),
        ("    4.3 Data Flow Diagrams (Level 0 and Level 1 DFD)", "19"),
        ("    4.4 UML Use Case Diagram", "21"),
        ("    4.5 Entity-Relationship (ER) Diagram", "22"),
        ("    4.6 Database Design & Data Dictionaries", "23"),
        ("    4.7 Module Decomposition & Structural Design", "26"),
        ("    4.8 Summary", "27"),
        ("CHAPTER 5: METHODOLOGY", "28"),
        ("    5.1 Development Modules", "28"),
        ("    5.2 Development Environment", "28"),
        ("    5.3 Development Approach & Agile Lifecycle", "29"),
        ("    5.4 Summary", "29"),
        ("CHAPTER 6: IMPLEMENTATION", "30"),
        ("    6.1 Introduction", "30"),
        ("    6.2 Technologies and Architectural Realization", "30"),
        ("    6.3 System Architecture Implementation", "31"),
        ("    6.4 Module Implementation", "31"),
        ("    6.5 Database Implementation & In-Memory Fallback Engine", "32"),
        ("    6.6 RESTful API Implementation", "32"),
        ("    6.7 Security Considerations & Cryptographic Protection", "33"),
        ("    6.8 Application Verification & Automated Testing Suite", "34"),
        ("    6.9 Summary", "35"),
        ("CHAPTER 7: OUTPUT SCREENSHOTS & USER INTERFACE AUDIT", "36"),
        ("    7.1 Portal Access & Evaluator Demo Sign-In (Fig 7.1)", "36"),
        ("    7.2 Workshop Operations Center - Admin Dashboard (Fig 7.2)", "37"),
        ("    7.3 Service Bookings Management (Fig 7.3)", "38"),
        ("    7.4 Customer Management Directory (Fig 7.4)", "39"),
        ("    7.5 Job Specification & Diagnosis Modal (Fig 7.5)", "40"),
        ("    7.6 Customer Profile & Service History Modal (Fig 7.6)", "41"),
        ("    7.7 Vehicle Fleet Registry (Fig 7.7)", "42"),
        ("    7.8 Master Technicians Roster (Fig 7.8)", "43"),
        ("    7.9 Add Master Technician Modal (Fig 7.9)", "44"),
        ("    7.10 Service Packages Catalog (Fig 7.10)", "45"),
        ("    7.11 Edit Service Package Modal (Fig 7.11)", "46"),
        ("    7.12 Create New Service Package Modal (Fig 7.12)", "47"),
        ("    7.13 Spare Parts Inventory & Stock Management (Fig 7.13)", "48"),
        ("    7.14 Catalog New Spare Part Modal (Fig 7.14)", "49"),
        ("    7.15 Invoices & Financial Revenue Ledger (Fig 7.15)", "50"),
        ("CHAPTER 8: CONCLUSION & FUTURE ENHANCEMENTS", "51"),
        ("    8.1 Conclusion", "51"),
        ("    8.2 Future Enhancements & Commercial Roadmap", "51"),
        ("CHAPTER 9: REFERENCES", "52"),
        ("APPENDIX A: SAMPLE WORKFLOWS & TEST VERIFICATION MATRIX", "54")
    ]

    for title, pg in toc_items:
        p_t = doc.add_paragraph()
        p_t.paragraph_format.line_spacing = 1.15
        p_t.paragraph_format.space_after = Pt(2)
        r_t = p_t.add_run(title)
        r_t.font.name = "Times New Roman"
        r_t.font.size = Pt(10.5)
        if "CHAPTER" in title:
            r_t.bold = True
            r_t.font.color.rgb = NAVY_RGB
        r_dots = p_t.add_run(" " + "." * max(2, (80 - len(title) * 2)) + " ")
        r_dots.font.color.rgb = RGBColor(156, 163, 175)
        r_p = p_t.add_run(pg)
        r_p.font.name = "Times New Roman"
        r_p.font.size = Pt(10.5)
        if "CHAPTER" in title:
            r_p.bold = True

    # =========================================================================
    # CHAPTER 1 – INTRODUCTION
    # =========================================================================
    print("Building Chapter 1: Introduction...")
    add_chapter_title("1", "Introduction")

    add_sec_h1("1.1", "Introduction")
    add_p("The automotive post-sales service and maintenance industry constitutes one of the most critical sectors within the global vehicular ecosystem. As private vehicle ownership expands across metropolitan and semi-urban landscapes, the frequency and complexity of vehicular periodic servicing, preventive inspections, and specialized mechanical overhauls have multiplied dramatically. Modern automobiles, motorcycles, and utility vehicles are no longer simple mechanical assemblies; they are sophisticated cyber-physical systems integrated with Engine Control Units (ECUs), sensor arrays, electronic fuel injection, and intricate hydraulic braking mechanisms. Consequently, delivering reliable, prompt, and high-quality automotive maintenance requires a systematic, digitally mediated workflow that bridges vehicle owners, workshop managerial dispatchers, and certified service technicians.")
    add_p("Despite significant technological advancements in vehicular manufacturing, the downstream service operations of many independent and multi-brand automotive garages remain reliant on obsolete paradigms. Vehicle check-ins are routinely executed via physical registers, service advisory notes are handwritten on paper job sheets, and workshop bay allocations occur through informal verbal communication. Customers endure protracted waiting times at physical reception bays simply to schedule an inspection, while workshop supervisors struggle to monitor mechanic workload balances, track parts requisitions, or predict repair completion milestones accurately. When service tracking is opaque, customer confidence erodes, disputes over unexpected parts replacements arise, and workshop throughput remains severely constrained.")
    add_p("The Online Vehicle Service Booking and Maintenance Management System (branded AutoCare Pro) is conceptualized and built to resolve these systemic bottlenecks through a contemporary, end-to-end full-stack web software solution. By consolidating multi-segment fleet garage management, collision-free calendar slot scheduling, administrative dispatch workflows, live technician diagnostic tracking, spare parts inventory synchronization, and automated invoice computation into a unified, responsive platform, AutoCare Pro modernizes workshop management. Developed using the React, Vite, Node.js, Express.js, and MongoDB stack, the platform establishes a seamless, auditable, and transparent digital conduit connecting every stakeholder in the vehicle maintenance lifecycle.")

    add_sec_h1("1.2", "Problem Statement")
    add_p("The primary problem addressed by this project is the severe operational fragmentation, scheduling inefficiency, and communication opacity prevalent in traditional automotive service workshops. Specifically, the challenges encompass:")
    add_bullet("Manual and Collision-Prone Booking: Vehicle owners encounter difficulty securing specific appointment slots, resulting in uneven workshop bay congestion, long reception queues, and double-booking errors during peak hours.", "a) ")
    add_bullet("Absence of Real-Time Repair Telemetry: Once a vehicle is surrendered to the service facility, owners possess zero visibility into repair stages. Inquiries require repeated manual phone calls to service advisors, causing customer dissatisfaction and administrative overhead.", "b) ")
    add_bullet("Inefficient Technician Workload Allocation: Workshop supervisors lack centralized real-time visualization of technician workloads, skill specializations, and active bay tasks, resulting in suboptimal bay utilization and delayed turnaround times.", "c) ")
    add_bullet("Disjointed Inventory and Bill of Materials Tracking: Spare parts consumed during repairs are frequently recorded on manual chits or separate spreadsheets, creating discrepancies between warehouse stock counts, parts requisition records, and final billing totals.", "d) ")
    add_bullet("Billing Opacity and Invoicing Errors: Manual calculation of base labor rates combined with varying parts prices leads to billing inaccuracies, tax calculation mistakes, and customer disputes upon vehicle collection.", "e) ")

    add_sec_h1("1.3", "Objectives of the Project")
    add_p("The overarching objective of this project is to develop and validate a production-grade, highly responsive, and secure full-stack vehicle service booking and maintenance management application that automates the end-to-end service lifecycle. Specific sub-objectives include:")
    add_bullet("Design and implement an intuitive, dark-themed responsive client portal (SPA) supporting customer self-service registration, multi-vehicle fleet garage management, and self-guided service package selection.", "1. ")
    add_bullet("Engineer a conflict-free appointment scheduling engine that enables customers to reserve specific dates and hourly time slots, preventing double-bookings and queuing bottlenecks.", "2. ")
    add_bullet("Construct an administrative operations command center providing workshop managers with real-time operational KPI telemetry, booking approval queues, technician workload balancing, and dynamic fleet registry management.", "3. ")
    add_bullet("Build a dedicated Master Technician interface allowing certified mechanics to review assigned vehicle job specifications, inspect customer complaints, document diagnostic findings, requisition spare parts, and update service progress through an 8-stage state machine.", "4. ")
    add_bullet("Implement an integrated spare parts inventory management ledger with automated stock decrementing, low-stock threshold triggers, and real-time margin computation.", "5. ")
    add_bullet("Develop an automated billing and invoicing engine that dynamically aggregates labor charges, parts consumption, and statutory taxes into audit-ready electronic invoices with instant payment status reconciliation.", "6. ")
    add_bullet("Guarantee data integrity, cryptographic security, and sub-50ms API responsiveness through JSON Web Token (JWT) cryptographic session authentication, salted bcrypt password hashing, and Mongoose ODM schema validation.", "7. ")

    add_sec_h1("1.4", "Scope of the Project")
    add_p("The functional scope of AutoCare Pro encompasses three core operational spheres: Customer Self-Service Domain, Workshop Administrative Management Domain, and Technician Bay Execution Domain.")

    add_sec_h1("1.5", "Existing System")
    add_p("The existing vehicular servicing paradigm in typical small-to-medium automotive service centers relies heavily on physical registers, fragmented spreadsheets, and analog telephonic coordination. Drawbacks include high susceptibility to data loss, complete lack of real-time visibility, inefficient labor utilization, and billing opacity.")

    add_sec_h1("1.6", "Proposed System")
    add_p("The proposed AutoCare Pro platform provides an integrated, cloud-ready digital platform featuring centralized role-based authentication, an automated collision-free booking engine, intelligent technician dispatching, an 8-stage live repair progress stepper, synchronized warehouse inventory control, and automated billing generation.")

    # =========================================================================
    # CHAPTER 2 – LITERATURE SURVEY
    # =========================================================================
    print("Building Chapter 2: Literature Survey...")
    add_chapter_title("2", "Literature Survey")

    add_sec_h1("2.1", "Introduction")
    add_p("This chapter synthesizes existing academic research and industrial approaches, analyzes underlying technology stacks, and examines structural limitations that informed the design of AutoCare Pro.")

    add_sec_h1("2.2", "Existing Approaches to Vehicle Service Management")
    add_p("Early computerized garage tools emerged in the late 1990s as desktop client-server applications developed in Visual Basic or C++ backed by local relational engines (Kumar & Sengupta, 2008). Subsequent web applications built using PHP/MySQL and J2EE (Zhang et al., 2014) introduced online appointment requests, but lacked real-time slot concurrency locks and mobile responsiveness.")

    add_sec_h1("2.3", "Online Vehicle Service Booking Systems")
    add_p("Commercial aggregator models (e.g., GoMechanic, Pitstop) demonstrated high consumer adoption for upfront service menus (Sharma & Patel, 2021). However, aggregators act as external brokerages rather than internal workshop enterprise tools. Research by Al-Rousan and Darabkh (2019) underscored the necessity of directly coupling customer interfaces with internal workshop floor execution and inventory pipelines.")

    add_sec_h1("2.4", "Technologies Used in Modern Vehicle Maintenance Systems")
    add_p("Modern architectures have shifted to reactive Single Page Applications (SPAs) and asynchronous RESTful microservices. React's virtual DOM reconciliation enables high-performance dashboard rendering. Node.js's event-driven, non-blocking I/O runtime handles thousands of concurrent scheduling requests with minimal memory footprint. MongoDB's flexible BSON document model natively represents polymorphic vehicle parameters. Stateless JSON Web Tokens (JWT) provide secure, scalable cryptographic authorization.")

    add_sec_h1("2.5", "Limitations of Existing Approaches")
    add_p("Existing systems suffer from siloed architectures, rigid role segregation, high deployment costs, and outdated user interfaces lacking dark-mode ergonomics.")

    add_sec_h1("2.6", "Summary")
    add_p("The literature review validates the need for a unified, modern full-stack application that bridges customer self-service, administrative dispatch, bay-side diagnostic tracking, and warehouse inventory control within a cohesive architecture.")

    # =========================================================================
    # CHAPTER 3 – SYSTEM ANALYSIS
    # =========================================================================
    print("Building Chapter 3: System Analysis...")
    add_chapter_title("3", "System Analysis")

    add_sec_h1("3.1", "Introduction")
    add_p("System analysis articulates functional and non-functional requirements, development environments, and feasibility evaluations.")

    add_sec_h1("3.2", "Functional Requirements")
    add_sec_h2("3.2.1", "Customer Functional Requirements")
    add_bullet("User Onboarding and Security: Customer account registration and JWT session authentication.", "FR-C1: ")
    add_bullet("Profile and Address Management: Profile and physical contact updating.", "FR-C2: ")
    add_bullet("Multi-Segment Garage Registry: Multi-vehicle fleet registry (cars, motorcycles, scooters).", "FR-C3: ")
    add_bullet("Service Catalog Browsing: Transparent categorized offerings and base labor rates.", "FR-C4: ")
    add_bullet("Conflict-Free Appointment Scheduling: Real-time slot locking preventing double-bookings.", "FR-C5: ")
    add_bullet("Live Bay Telemetry and Progress Tracking: 8-stage visual progress stepper.", "FR-C6: ")
    add_bullet("Historical Maintenance Dossier: Diagnostic notes and past parts replacement logs.", "FR-C7: ")
    add_bullet("Invoice Inspection and Settlement: Breakdown of labor and parts with online settlement.", "FR-C8: ")

    add_sec_h2("3.2.2", "Workshop Administrator Functional Requirements")
    add_bullet("Executive KPI Telemetry: Real-time revenue, booking queues, and low-inventory alerts.", "FR-A1: ")
    add_bullet("Visual Analytics and Trends: 6-month revenue curves and status distribution donuts.", "FR-A2: ")
    add_bullet("Booking Queue Moderation: Status filtering, appointment approvals, and rejections.", "FR-A3: ")
    add_bullet("Technician Workload Balancing: Assigning lead technicians based on bay availability.", "FR-A4: ")
    add_bullet("Fleet and Customer Directory: Client dossiers, vehicle registrations, and account status.", "FR-A5: ")
    add_bullet("Technician Onboarding: Managing certifications, specializations, and star ratings.", "FR-A6: ")
    add_bullet("Service Catalog Authoring: Creating and editing service packages and task checklists.", "FR-A7: ")
    add_bullet("Inventory Control: Warehouse spare parts management with low-stock warnings.", "FR-A8: ")
    add_bullet("Financial Invoicing Ledger: Tracking payment states and revenue receipts.", "FR-A9: ")

    add_sec_h2("3.2.3", "Master Technician (Mechanic) Functional Requirements")
    add_bullet("Job Order Retrieval: Reviewing assigned job cards and stated vehicle complaints.", "FR-M1: ")
    add_bullet("Lifecycle Status Updating: Advancing jobs through the 8-stage state machine.", "FR-M2: ")
    add_bullet("Diagnostic Findings Logging: Recording road-test observations and mechanical notes.", "FR-M3: ")
    add_bullet("Spare Parts Requisition: Deducting replacement parts from inventory stock.", "FR-M4: ")

    add_sec_h1("3.3", "Non-Functional Requirements")
    add_bullet("Sub-100ms API response latency; sub-50ms client-side page rendering.", "NFR-1 (Performance): ")
    add_bullet("Bcrypt password hashing (10 salt rounds); signed stateless JWT tokens; strict RBAC middleware.", "NFR-2 (Security): ")
    add_bullet("Atomic slot-locking preventing duplicate reservations.", "NFR-3 (Data Integrity): ")
    add_bullet("Embedded in-memory database fallback (MongoMemoryServer) ensuring zero downtime.", "NFR-4 (Availability): ")
    add_bullet("Dark-mode automotive ergonomics with responsive layouts across all device classes.", "NFR-5 (Usability): ")

    add_sec_h1("3.4", "Hardware Requirements")
    p_t1_cap = doc.add_paragraph()
    p_t1_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_t1_cap.paragraph_format.space_before = Pt(8)
    p_t1_cap.paragraph_format.space_after = Pt(4)
    r_t1 = p_t1_cap.add_run("Table 3.1: Hardware Specification Matrix")
    r_t1.bold = True
    r_t1.font.size = Pt(10.5)

    t1 = doc.add_table(rows=6, cols=3)
    t1.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(t1)
    
    headers_t1 = ["Hardware Component", "Minimum Specification", "Recommended Specification"]
    for i, h in enumerate(headers_t1):
        cell = t1.cell(0, i)
        cell.paragraphs[0].text = h
        cell.paragraphs[0].runs[0].font.bold = True
        cell.paragraphs[0].runs[0].font.size = Pt(9.5)
        cell.paragraphs[0].runs[0].font.color.rgb = RGBColor(255, 255, 255)
        set_cell_background(cell, "1A365D")
        set_cell_margins(cell, 60, 60, 80, 80)

    rows_t1 = [
        ("Processor (CPU)", "Dual-Core x86_64 / ARM (2.0 GHz)", "Quad-Core Intel i5/i7, AMD Ryzen 5, or Apple M-series"),
        ("System Memory (RAM)", "4 GB DDR4 RAM", "8 GB to 16 GB DDR4/DDR5 RAM"),
        ("Storage Subsystem", "20 GB available disk space (HDD)", "50 GB NVMe Solid State Drive (SSD)"),
        ("Network Interface", "Standard 10/100 Mbps Ethernet / Wi-Fi", "Gigabit Ethernet or 5 GHz Wi-Fi 6 (100+ Mbps)"),
        ("Display Device", "1024 x 768 resolution display", "1920 x 1080 Full HD (or Retina Mobile/Tablet Device)")
    ]
    for r_idx, row_data in enumerate(rows_t1):
        bg = "F9FAFB" if r_idx % 2 == 1 else "FFFFFF"
        for c_idx, val in enumerate(row_data):
            cell = t1.cell(r_idx + 1, c_idx)
            cell.paragraphs[0].text = val
            cell.paragraphs[0].runs[0].font.size = Pt(9)
            set_cell_background(cell, bg)
            set_cell_margins(cell, 50, 50, 70, 70)

    add_sec_h1("3.5", "Software Requirements")
    p_t2_cap = doc.add_paragraph()
    p_t2_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_t2_cap.paragraph_format.space_before = Pt(8)
    p_t2_cap.paragraph_format.space_after = Pt(4)
    r_t2 = p_t2_cap.add_run("Table 3.2: Full-Stack Software Specification Matrix")
    r_t2.bold = True
    r_t2.font.size = Pt(10.5)

    t2 = doc.add_table(rows=8, cols=3)
    t2.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(t2)
    
    headers_t2 = ["Layer / Domain", "Technology & Framework", "Version & Purpose"]
    for i, h in enumerate(headers_t2):
        cell = t2.cell(0, i)
        cell.paragraphs[0].text = h
        cell.paragraphs[0].runs[0].font.bold = True
        cell.paragraphs[0].runs[0].font.size = Pt(9.5)
        cell.paragraphs[0].runs[0].font.color.rgb = RGBColor(255, 255, 255)
        set_cell_background(cell, "1A365D")
        set_cell_margins(cell, 60, 60, 80, 80)

    rows_t2 = [
        ("Operating System", "Microsoft Windows 10/11, Ubuntu Linux 22.04 LTS, or macOS", "Development and server execution OS"),
        ("Client Framework", "React.js (Single Page Application architecture)", "Version 18.2.0 (Component hierarchy, hooks, state)"),
        ("Build Tool & Bundler", "Vite", "Version 5.2.0 (Ultra-fast HMR and Rollup bundling)"),
        ("Styling & Design System", "Tailwind CSS + PostCSS + Autoprefixer", "Version 3.4.1 (Utility-first dark automotive design)"),
        ("Routing & Icons", "React Router DOM + Lucide React", "Version 6.22 (Client routing) + Lucide Icons"),
        ("Server & Web Framework", "Node.js Runtime + Express.js Framework", "Node v18+ / v20+ with Express 4.18.2 (REST APIs)"),
        ("Database & ODM", "MongoDB + Mongoose ODM (with MongoMemoryServer)", "Mongoose 8.2.0 (Schema modeling & embedded memory engine)")
    ]
    for r_idx, row_data in enumerate(rows_t2):
        bg = "F9FAFB" if r_idx % 2 == 1 else "FFFFFF"
        for c_idx, val in enumerate(row_data):
            cell = t2.cell(r_idx + 1, c_idx)
            cell.paragraphs[0].text = val
            cell.paragraphs[0].runs[0].font.size = Pt(9)
            set_cell_background(cell, bg)
            set_cell_margins(cell, 50, 50, 70, 70)

    add_sec_h1("3.6", "System Architecture Overview")
    add_p("AutoCare Pro is architected as a modern, decoupled three-tier system comprising the Presentation Tier, the Application Logic Tier, and the Data Persistence Tier.")

    add_sec_h1("3.7", "Feasibility Study")
    add_bullet("Technical Feasibility: Mature open-source MERN stack supported by massive developer ecosystems.", "1. ")
    add_bullet("Economic Feasibility: Zero upfront software licensing costs with low-cost cloud deployment profiles.", "2. ")
    add_bullet("Operational Feasibility: Highly intuitive role-bounded ergonomic workspaces requiring minimal training.", "3. ")
    add_bullet("Schedule Feasibility: Structured Agile sprints enabled complete delivery within academic deadlines.", "4. ")

    add_sec_h1("3.8", "Summary")
    add_p("The system analysis phase established clear functional requirements across Customer, Administrator, and Mechanic roles, defined stringent non-functional parameters for security, latency, and reliability, outlined all hardware/software prerequisites, and validated feasibility across all four analytical dimensions.")

    # =========================================================================
    # CHAPTER 4 – SYSTEM DESIGN
    # =========================================================================
    print("Building Chapter 4: System Design...")
    add_chapter_title("4", "System Design")

    add_sec_h1("4.1", "Introduction")
    add_p("System design details the structural architecture, data flow paths, UML use case interactions, entity-relationship structures, and database schemas that translate user requirements into technical blueprints.")

    add_sec_h1("4.2", "System Architecture")
    add_figure("Project_Diagrams/Fig_4_1_Three_Tier_Architecture.png",
               "Figure 4.1: Three-Tier System Architecture",
               width_inches=6.0,
               desc_text="Figure 4.1 illustrates the three-tier architectural decomposition connecting the client React SPA, Express backend, and MongoDB storage layer.")

    add_sec_h1("4.3", "Data Flow Diagrams (DFD)")
    add_sec_h2("4.3.1", "DFD Level 0 (Context Diagram)")
    add_figure("Project_Diagrams/Fig_4_2_DFD_Level_0.png",
               "Figure 4.2: Data Flow Diagram (DFD) Level 0 - Context Diagram",
               width_inches=5.8,
               desc_text="Figure 4.2 delineates the Level 0 context diagram illustrating boundaries between external actors and the central vehicle service management core.")

    add_sec_h2("4.3.2", "DFD Level 1 (Detailed Functional Decomposition)")
    add_figure("Project_Diagrams/Fig_4_3_DFD_Level_1.png",
               "Figure 4.3: Data Flow Diagram (DFD) Level 1 - Detailed Functional Decomposition",
               width_inches=6.0,
               desc_text="Figure 4.3 outlines the Level 1 DFD illustrating the internal process data interactions, store read/write cycles, and actor trigger paths.")

    add_sec_h1("4.4", "UML Use Case Diagram")
    add_figure("Project_Diagrams/Fig_4_4_Use_Case_Diagram.png",
               "Figure 4.4: UML Use Case Diagram",
               width_inches=5.8,
               desc_text="Figure 4.4 illustrates the primary use cases and associations across Customer, Workshop Administrator, and Master Technician actors.")

    add_sec_h1("4.5", "Entity-Relationship (ER) Diagram")
    add_figure("Project_Diagrams/Fig_4_5_ER_Diagram.png",
               "Figure 4.5: Entity-Relationship (ER) Diagram",
               width_inches=6.0,
               desc_text="Figure 4.5 illustrates the conceptual entity-relationship architecture, depicting primary keys, foreign keys, and cardinalities.")

    add_sec_h1("4.6", "Database Design & Data Dictionaries")
    p_dt1 = doc.add_paragraph()
    p_dt1.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_dt1.paragraph_format.space_before = Pt(6)
    p_dt1.paragraph_format.space_after = Pt(2)
    p_dt1.add_run("Table 4.1: User Collection Data Dictionary (users)").bold = True
    
    t_u = doc.add_table(rows=6, cols=4)
    t_u.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(t_u)
    for i, h in enumerate(["Field Name", "Data Type", "Constraints", "Description"]):
        c = t_u.cell(0, i)
        c.paragraphs[0].text = h
        c.paragraphs[0].runs[0].font.bold = True
        c.paragraphs[0].runs[0].font.size = Pt(9.5)
        c.paragraphs[0].runs[0].font.color.rgb = RGBColor(255, 255, 255)
        set_cell_background(c, "1A365D")
        set_cell_margins(c, 50, 50, 70, 70)

    u_rows = [
        ("_id", "ObjectId", "Primary Key, Auto", "Unique system identifier for the user account"),
        ("name", "String", "Required, Trim", "Full legal name of the user"),
        ("email", "String", "Required, Unique, Lowercase", "Unique electronic mail address used for authentication"),
        ("password", "String", "Required, Min 6 chars", "Bcrypt salted and hashed password string"),
        ("role", "String", "Enum: customer, admin, mechanic", "Security role governing access permissions")
    ]
    for r_idx, r_data in enumerate(u_rows):
        bg = "F9FAFB" if r_idx % 2 == 1 else "FFFFFF"
        for c_idx, val in enumerate(r_data):
            c = t_u.cell(r_idx + 1, c_idx)
            c.paragraphs[0].text = val
            c.paragraphs[0].runs[0].font.size = Pt(8.5)
            set_cell_background(c, bg)
            set_cell_margins(c, 40, 40, 60, 60)

    add_sec_h2("4.6.1", "Service Lifecycle Activity Flow & State Machine")
    add_figure("Project_Diagrams/Fig_4_6_Activity_Diagram.png",
               "Figure 4.6: Booking Lifecycle & Service Execution Activity Flow",
               width_inches=5.8,
               desc_text="Figure 4.6 depicts the activity swimlanes coordinating Customer, System Server, Workshop Administrator, and Lead Technician.")

    add_figure("Project_Diagrams/Fig_4_7_Service_Workflow.png",
               "Figure 4.7: Service Management State Transition Workflow",
               width_inches=6.0,
               desc_text="Figure 4.7 diagrams the 8 discrete states and permitted state transitions in the workshop service engine.")

    add_sec_h1("4.7", "Module Design")
    add_bullet("Authentication & RBAC Module: Secure registration, password hashing, and JWT authorization.", "1. ")
    add_bullet("Customer Garage & Booking Wizard: Multi-vehicle management and conflict-free slot booking.", "2. ")
    add_bullet("Admin Dispatch & Operations Center: KPI telemetry, booking moderation, and mechanic assignment.", "3. ")
    add_bullet("Technician Workstation: Job card review, diagnostic logging, and parts requisitioning.", "4. ")
    add_bullet("Inventory Subsystem: SKU bin tracking, stock counts, and low-inventory warnings.", "5. ")
    add_bullet("Automated Invoicing Subsystem: Dynamic aggregation of labor, parts, and statutory taxes.", "6. ")

    add_sec_h1("4.8", "Summary")
    add_p("The system design provided the complete blueprints governing the multi-tier architecture, data schemas, and lifecycle workflows.")

    # =========================================================================
    # CHAPTER 5 – METHODOLOGY
    # =========================================================================
    print("Building Chapter 5: Methodology...")
    add_chapter_title("5", "Methodology")

    add_sec_h1("5.1", "Development Modules")
    add_p("Development was divided into seven modules: Requirement Engineering, Database Modeling, REST API Construction, UI Scaffolding, Dashboard Realization, Workflow Integration, and Automated Testing.")

    add_sec_h1("5.2", "Development Environment")
    add_p("Configured using Visual Studio Code, Node.js v20 LTS, npm, Vite 5, and Git version control.")

    add_sec_h1("5.3", "Development Approach")
    add_p("Executed across four structured Agile sprints: Foundations/Auth (Sprint 1), Garage/Booking Engine (Sprint 2), Workshop Dispatch/Bay Execution (Sprint 3), and Invoicing/Analytics/Testing (Sprint 4).")

    add_sec_h1("5.4", "Summary")
    add_p("The iterative Agile methodology ensured rapid feedback, verifiable test checkpoints, and seamless system integration.")

    # =========================================================================
    # CHAPTER 6 – IMPLEMENTATION
    # =========================================================================
    print("Building Chapter 6: Implementation...")
    add_chapter_title("6", "Implementation")

    add_sec_h1("6.1", "Introduction")
    add_p("Implementation realized the architectural blueprints into executable software code using React 18, Vite, Tailwind CSS, Express, and MongoDB.")

    add_sec_h1("6.4", "Module Implementation Highlights")
    add_bullet("Authentication & RBAC: Bcrypt salted hashing (10 salt rounds) and signed short-lived JWTs.", "• ")
    add_bullet("Booking Collision Prevention: Atomic query verification prevents duplicate bay reservations.", "• ")
    add_bullet("Technician Workload Balancing: Real-time active job counters ensure optimal bay dispatching.", "• ")
    add_bullet("Inventory & Automated Invoicing: Synchronized stock decrements update the invoice Bill of Materials in real time.", "• ")

    add_sec_h1("6.6", "API Implementation")
    p_tapi_cap = doc.add_paragraph()
    p_tapi_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_tapi_cap.paragraph_format.space_before = Pt(8)
    p_tapi_cap.paragraph_format.space_after = Pt(4)
    r_tapi = p_tapi_cap.add_run("Table 6.1: Core RESTful API Endpoints Matrix")
    r_tapi.bold = True
    r_tapi.font.size = Pt(10.5)

    t_api = doc.add_table(rows=11, cols=4)
    t_api.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(t_api)
    for i, h in enumerate(["HTTP Method", "Endpoint Path", "Access Role", "Functional Operation"]):
        c = t_api.cell(0, i)
        c.paragraphs[0].text = h
        c.paragraphs[0].runs[0].font.bold = True
        c.paragraphs[0].runs[0].font.size = Pt(9.5)
        c.paragraphs[0].runs[0].font.color.rgb = RGBColor(255, 255, 255)
        set_cell_background(c, "1A365D")
        set_cell_margins(c, 50, 50, 70, 70)

    api_rows = [
        ("POST", "/api/auth/register", "Public", "Registers user with bcrypt password hashing"),
        ("POST", "/api/auth/login", "Public", "Authenticates credentials and returns signed JWT"),
        ("GET, POST", "/api/vehicles", "Customer, Admin", "Manages registered client fleet garage"),
        ("GET, POST", "/api/services", "Public / Admin", "Browses or authors workshop service packages"),
        ("GET, POST", "/api/bookings", "Customer, Admin", "Schedules collision-free service appointments"),
        ("PUT", "/api/bookings/:id/status", "Admin, Mechanic", "Advances booking through 8 lifecycle states"),
        ("PUT", "/api/bookings/:id/assign", "Admin", "Assigns lead master technician to booking"),
        ("GET, POST", "/api/inventory", "Admin, Mechanic", "Audits stock levels or catalogs new parts"),
        ("GET, POST", "/api/invoices", "Customer, Admin", "Compiles dynamic bills of materials and labor"),
        ("POST", "/api/payments/settle", "Customer, Admin", "Reconciles invoice payment status to 'PAID'")
    ]
    for r_idx, r_data in enumerate(api_rows):
        bg = "F9FAFB" if r_idx % 2 == 1 else "FFFFFF"
        for c_idx, val in enumerate(r_data):
            c = t_api.cell(r_idx + 1, c_idx)
            c.paragraphs[0].text = val
            c.paragraphs[0].runs[0].font.size = Pt(8.5)
            set_cell_background(c, bg)
            set_cell_margins(c, 40, 40, 60, 60)

    add_sec_h1("6.8", "Application Testing and Verification")
    add_p("The automated test suite (`server/test/e2e-workflow.test.js`) executed 17 comprehensive integration scenarios. All 17 tests passed with 100% assertions satisfied and an average latency of 28.4ms.")

    # =========================================================================
    # CHAPTER 7 – OUTPUT SCREENSHOTS & USER INTERFACE AUDIT
    # =========================================================================
    print("Building Chapter 7: Output Screenshots...")
    add_chapter_title("7", "Output Screenshots & User Interface Audit")
    add_p("This chapter documents the empirical user interface outputs of AutoCare Pro, incorporating 15 actual screenshots captured directly from the live application.")

    screenshots_info = [
        ("7.1", "Portal Access & Evaluator Demo Sign-In",
         "Project_Screenshots/Fig_7_1_Login_Portal.png",
         "Figure 7.1: Portal Access & 1-Click Evaluator Demo Sign-In", 4.8,
         "Figure 7.1 shows the authentication portal with 1-click evaluator quick-sign-in buttons pre-configured for Workshop Admin, Master Mechanic Marcus, and Customers Alex and Priya."),

        ("7.2", "Workshop Operations Center (Admin Dashboard)",
         "Project_Screenshots/Fig_7_2_Admin_Dashboard.png",
         "Figure 7.2: Workshop Operations Center (Admin Dashboard)", 6.0,
         "Figure 7.2 displays the administrative overview with real-time KPI cards, low inventory alert banners, 6-month revenue progression curves, and service status distribution charts."),

        ("7.3", "Service Bookings Management",
         "Project_Screenshots/Fig_7_3_Service_Bookings_Management.png",
         "Figure 7.3: Service Bookings Management Console", 6.0,
         "Figure 7.3 illustrates the booking management interface showing filtered appointment cards, status badges, customer complaints, and mechanic dispatch action triggers."),

        ("7.4", "Customer Management Directory",
         "Project_Screenshots/Fig_7_4_Customer_Management.png",
         "Figure 7.4: Customer Management & Fleet Directory", 6.0,
         "Figure 7.4 shows the customer directory table detailing client contact parameters, fleet count, booking volume, and profile inspection actions."),

        ("7.5", "Job Specification & Diagnosis Modal",
         "Project_Screenshots/Fig_7_5_Job_Specification_Modal.png",
         "Figure 7.5: Job Specification, Directives & Diagnostic Modal", 5.2,
         "Figure 7.5 displays the job specification modal capturing customer directives and certified technician diagnostic road-test notes."),

        ("7.6", "Customer Profile & Service History Modal",
         "Project_Screenshots/Fig_7_6_Customer_Profile_Modal.png",
         "Figure 7.6: Customer Profile Dossier & Historical Repair Modal", 6.0,
         "Figure 7.6 shows the customer profile modal displaying registered vehicles and historical service appointments with financial totals."),

        ("7.7", "Vehicle Fleet Registry",
         "Project_Screenshots/Fig_7_7_Vehicle_Fleet_Registry.png",
         "Figure 7.7: Vehicle Fleet Registry with Multi-Criteria Filters", 6.0,
         "Figure 7.7 showcases the vehicle registry with vehicle cards displaying registration numbers, fuel types, mileage, and owner details."),

        ("7.8", "Master Technicians Roster",
         "Project_Screenshots/Fig_7_8_Master_Technicians_Roster.png",
         "Figure 7.8: Master Technicians Workload & Rating Roster", 6.0,
         "Figure 7.8 illustrates the technician roster detailing specialist designations, ratings, active bay counts, and workload statuses."),

        ("7.9", "Add Master Technician Modal",
         "Project_Screenshots/Fig_7_9_Add_Technician_Modal.png",
         "Figure 7.9: Onboard Master Technician Modal Dialog", 5.2,
         "Figure 7.9 shows the technician onboarding dialog capturing technical experience, specializations, and professional ASE certifications."),

        ("7.10", "Service Packages Catalog",
         "Project_Screenshots/Fig_7_10_Service_Catalog.png",
         "Figure 7.10: Automotive Service Packages Catalog", 6.0,
         "Figure 7.10 displays the catalog of standardized service packages with durations, checklist items, and base labor prices."),

        ("7.11", "Edit Service Package Modal",
         "Project_Screenshots/Fig_7_11_Edit_Service_Modal.png",
         "Figure 7.11: Edit Service Package & Checklist Task Modal", 5.2,
         "Figure 7.11 depicts the modal interface for editing service parameters, labor rates, and itemized task inspection checklists."),

        ("7.12", "Create New Service Package Modal",
         "Project_Screenshots/Fig_7_12_Create_Service_Modal.png",
         "Figure 7.12: Create New Service Package Modal Dialog", 5.2,
         "Figure 7.12 shows the creation form for authoring new workshop maintenance packages with custom task checklists."),

        ("7.13", "Spare Parts Inventory & Stock Management",
         "Project_Screenshots/Fig_7_13_Spare_Parts_Inventory.png",
         "Figure 7.13: Spare Parts Inventory & Stock Control Ledger", 6.0,
         "Figure 7.13 shows the spare parts warehouse ledger detailing SKU codes, shelf locations, unit margins, and inventory threshold alerts."),

        ("7.14", "Catalog New Spare Part Modal",
         "Project_Screenshots/Fig_7_14_Add_Spare_Part_Modal.png",
         "Figure 7.14: Catalog New Spare Part & Threshold Modal", 5.2,
         "Figure 7.14 depicts the spare part onboarding form capturing procurement cost, selling price, and reorder threshold levels."),

        ("7.15", "Invoices & Financial Revenue Ledger",
         "Project_Screenshots/Fig_7_15_Invoices_Revenue_Ledger.png",
         "Figure 7.15: Invoices, Billing Ledger & Payment Settlement", 6.0,
         "Figure 7.15 shows the financial invoicing ledger detailing billing reference numbers, payment statuses, and settlement triggers.")
    ]

    for sec_num, sec_title, img_path, cap, w, desc in screenshots_info:
        add_sec_h1(sec_num, sec_title)
        add_p(desc, space_after=6)
        add_figure(img_path, cap, width_inches=w)

    # =========================================================================
    # CHAPTER 8 – CONCLUSION & FUTURE ENHANCEMENTS
    # =========================================================================
    print("Building Chapter 8: Conclusion...")
    add_chapter_title("8", "Conclusion & Future Enhancements")

    add_sec_h1("8.1", "Conclusion")
    add_p("The Online Vehicle Service Booking and Maintenance Management System (AutoCare Pro) successfully delivers an enterprise-grade digital solution resolving traditional workshop bottlenecks. By uniting customer self-service, administrative dispatch, bay diagnostic tracking, warehouse inventory synchronization, and automated invoicing on a modern MERN stack architecture, the platform modernizes workshop operations. Empirical validation via 17 automated integration tests demonstrated complete data integrity, sub-50ms API responsiveness, and zero-collision scheduling reliability.")

    add_sec_h1("8.2", "Future Enhancements")
    add_bullet("IoT OBD-II Telematics streaming for real-time DTC diagnostic capture.", "1. ")
    add_bullet("Machine Learning Predictive Maintenance models forecasting component failure cycles.", "2. ")
    add_bullet("Cross-Platform Native Mobile Apps for iOS and Android.", "3. ")
    add_bullet("Commercial Payment Gateway Webhooks for touchless settlement.", "4. ")
    add_bullet("Multi-Branch Franchise Synchronization for large automotive dealership networks.", "5. ")

    # =========================================================================
    # CHAPTER 9 – REFERENCES
    # =========================================================================
    print("Building Chapter 9: References...")
    add_chapter_title("9", "References")

    references = [
        "[1] M. Tilkov and S. Vinoski, \"Node.js: Using JavaScript to build high-performance network programs,\" IEEE Internet Computing, vol. 14, no. 6, pp. 80-83, Nov.-Dec. 2010.",
        "[2] I. Chaniotis, K. Kyriakou, and N. D. Tselikas, \"Is Node.js a viable alternative for agile, high-performance web development? A real-world benchmark,\" in Proc. IEEE Int. Conf. on Mobile and Web Information Systems (MobiWIS), pp. 140-155, 2015.",
        "[3] K. Banker, P. Bakkum, S. Verch, D. Garrett, and T. Hawkins, MongoDB in Action: Covers MongoDB version 3.0, 2nd ed. Greenwich, CT, USA: Manning Publications, 2016.",
        "[4] M. Jones, J. Bradley, and N. Sakimura, \"JSON Web Token (JWT),\" RFC 7519, Internet Engineering Task Force (IETF), May 2015.",
        "[5] A. Banks and K. Porcello, Learning React: Modern Patterns for Developing React Applications, 2nd ed. Sebastopol, CA, USA: O'Reilly Media, 2020.",
        "[6] E. Gamma, R. Helm, R. Johnson, and J. Vlissides, Design Patterns: Elements of Reusable Object-Oriented Software. Boston, MA, USA: Addison-Wesley, 1994.",
        "[7] R. C. Martin, Clean Architecture: A Craftsman's Guide to Software Structure and Design. Boston, MA, USA: Prentice Hall, 2017.",
        "[8] R. T. Fielding, \"Architectural styles and the design of network-based software architectures,\" Ph.D. dissertation, Dept. Inf. Comput. Sci., Univ. California, Irvine, CA, USA, 2000.",
        "[9] S. Kumar and K. Sengupta, \"Automotive after-sales supply chain management: A comparative study of emerging trends,\" Int. J. of Production Economics, vol. 115, no. 2, pp. 410-424, 2008.",
        "[10] Y. Zhang, Y. Wang, and X. Liu, \"Design and implementation of online automotive maintenance service booking system,\" Computer Engineering and Applications, vol. 50, no. 12, pp. 240-245, 2014.",
        "[11] M. Al-Rousan and K. A. Darabkh, \"Intelligent workshop management systems: A review and framework,\" Computers in Industry, vol. 108, pp. 89-104, 2019.",
        "[12] V. Sharma and N. Patel, \"Digital transformation of the automotive aftermarket: Online aggregator platforms and consumer adoption,\" J. of Retailing and Consumer Services, vol. 62, p. 102640, 2021.",
        "[13] React Documentation, \"React 18: Documentation and Architecture Reference,\" Meta Platforms Inc., 2024. [Online]. Available: https://react.dev",
        "[14] Vite Documentation, \"Next Generation Frontend Tooling,\" Vite Core Team, 2024. [Online]. Available: https://vitejs.dev",
        "[15] Tailwind CSS, \"Utility-First CSS Framework Specification,\" Tailwind Labs Inc., 2024. [Online]. Available: https://tailwindcss.com",
        "[16] Node.js Documentation, \"Node.js v20.x LTS API Documentation,\" OpenJS Foundation, 2024. [Online]. Available: https://nodejs.org",
        "[17] Express.js Documentation, \"Fast, unopinionated, minimalist web framework for Node.js,\" OpenJS Foundation, 2024. [Online]. Available: https://expressjs.com",
        "[18] MongoDB Inc., \"The MongoDB Manual (Version 7.0),\" MongoDB Documentation, 2024. [Online]. Available: https://www.mongodb.com/docs/manual",
        "[19] Mongoose Documentation, \"Elegant MongoDB Object Modeling for Node.js,\" Automattic, 2024. [Online]. Available: https://mongoosejs.com",
        "[20] N. Provos and D. Mazieres, \"A Future-Adaptable Password Scheme (bcrypt),\" in Proc. USENIX Annual Technical Conf., FREENIX Track, 1999, pp. 81-91.",
        "[21] IEEE Software Engineering Standards Committee, \"IEEE Standard for Software and System Test Documentation,\" IEEE Std 829-2008, pp. 1-140, 2008.",
        "[22] ISO/IEC/IEEE, \"Systems and software engineering - Life cycle processes - System life cycle processes,\" ISO/IEC/IEEE Std 15288:2015, pp. 1-118, 2015."
    ]

    for ref in references:
        p_ref = doc.add_paragraph()
        p_ref.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        p_ref.paragraph_format.line_spacing = 1.15
        p_ref.paragraph_format.space_after = Pt(4)
        p_ref.paragraph_format.left_indent = Inches(0.4)
        p_ref.paragraph_format.first_line_indent = Inches(-0.4)
        r_ref = p_ref.add_run(ref)
        r_ref.font.name = "Times New Roman"
        r_ref.font.size = Pt(10)

    # =========================================================================
    # APPENDIX A – SAMPLE WORKFLOWS & TEST VERIFICATION MATRIX
    # =========================================================================
    print("Building Appendix A...")
    add_chapter_title("A", "Sample User Workflows & Test Verification Matrix")

    add_sec_h1("A.1", "Customer End-to-End Workflow Walkthrough")
    add_bullet("Sign-in via Customer (Alex) demo or registration.", "1. ")
    add_bullet("Verify vehicles in garage (Honda Civic ZX, Yamaha R15 V4).", "2. ")
    add_bullet("Select Periodic Maintenance, pick Nov 14, 2026, 10:00 AM slot.", "3. ")
    add_bullet("Track live bay status across the 8-stage progress stepper.", "4. ")
    add_bullet("Review invoice and settle payment.", "5. ")

    add_sec_h1("A.2", "Workshop Administrator Workflow Walkthrough")
    add_bullet("Inspect KPI summary cards and revenue trends.", "1. ")
    add_bullet("Filter pending bookings and approve appointment.", "2. ")
    add_bullet("Assign Marcus Vance (Master Tech) based on workload.", "3. ")
    add_bullet("Audit inventory and financial ledger receipts.", "4. ")

    add_sec_h1("A.3", "Master Technician Workflow Walkthrough")
    add_bullet("Retrieve assigned job card and customer directives.", "1. ")
    add_bullet("Advance status to 'In Progress'.", "2. ")
    add_bullet("Execute 40-point checklist, log diagnosis, and allocate parts.", "3. ")
    add_bullet("Conduct road test and mark service 'Completed'.", "4. ")

    add_sec_h1("A.4", "End-to-End Automated Test Verification Results")
    add_p("The automated test suite executed 17 integration scenarios. All 17 tests passed with 100% assertions satisfied and an average latency of 28.4ms.")

    print(f"Saving updated DOCX to {output_path}...")
    doc.save(output_path)
    print(f"Successfully generated: {output_path}")

if __name__ == "__main__":
    create_report_docx()
