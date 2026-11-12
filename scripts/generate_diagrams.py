import os
import matplotlib.pyplot as plt
import matplotlib.patches as patches

output_dir = "Project_Diagrams"
os.makedirs(output_dir, exist_ok=True)

# Styling palette
DARK_BG = "#0B0F19"
PANEL_BG = "#151B2B"
CARD_BG = "#1F293D"
BORDER_COL = "#374151"
ORANGE = "#EA580C"
LIGHT_ORANGE = "#FB923C"
BLUE = "#3B82F6"
GREEN = "#10B981"
PURPLE = "#8B5CF6"
CYAN = "#06B6D4"
TEXT_WHITE = "#F9FAFB"
TEXT_MUTED = "#9CA3AF"

# -------------------------------------------------------------
# 1. THREE-TIER ARCHITECTURE
# -------------------------------------------------------------
def generate_three_tier_architecture():
    fig, ax = plt.subplots(figsize=(12, 8), dpi=300)
    fig.patch.set_facecolor("#FFFFFF")
    ax.set_facecolor("#FFFFFF")
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis("off")

    # Title
    ax.text(50, 96, "Figure 4.1: Three-Tier System Architecture", ha="center", va="center",
            fontsize=15, fontweight="bold", color="#111827", fontfamily="sans-serif")
    ax.text(50, 93, "Online Vehicle Service Booking and Maintenance Management System (AutoCare Pro)",
            ha="center", va="center", fontsize=10, color="#4B5563")

    # Tier 1: Presentation Layer
    p1 = patches.FancyBboxPatch((8, 64), 84, 25, boxstyle="round,pad=0.8", ec="#2563EB", fc="#EFF6FF", lw=2)
    ax.add_patch(p1)
    ax.text(12, 85, "TIER 1: PRESENTATION LAYER (CLIENT-SIDE SPA)", fontsize=11, fontweight="bold", color="#1E40AF")
    
    # Subcomponents inside Tier 1
    components_t1 = [
        ("Customer Portal", "React 18 SPA\n• Vehicle Garage\n• Slot Booking Wizard\n• Bay Live Telemetry\n• Invoices & Receipts", 10, 66, 25, 16),
        ("Mechanic Console", "Technician Workstation\n• Assigned Work Orders\n• Diagnostic Notes\n• Spare Parts Requisition\n• Checklist Completion", 38, 66, 25, 16),
        ("Admin Operations", "Executive Dashboard\n• Dispatch Console\n• Fleet & Tech Rosters\n• Inventory Ledger\n• Financial Analytics", 66, 66, 25, 16)
    ]
    for title, desc, x, y, w, h in components_t1:
        box = patches.FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.5", ec="#93C5FD", fc="#FFFFFF", lw=1.5)
        ax.add_patch(box)
        ax.text(x + w/2, y + h - 2.5, title, ha="center", va="center", fontsize=9.5, fontweight="bold", color="#1E3A8A")
        ax.text(x + 2, y + 6.5, desc, ha="left", va="center", fontsize=8, color="#374151")

    # Connector Arrow Tier 1 -> Tier 2
    ax.annotate("", xy=(50, 58), xytext=(50, 64),
                arrowprops=dict(arrowstyle="<->", color="#DC2626", lw=2, mutation_scale=15))
    ax.text(53, 61, "Secure REST API (HTTPS / JSON Web Tokens / Axios)", fontsize=9, color="#991B1B", fontweight="semibold")

    # Tier 2: Application / Business Logic Layer
    p2 = patches.FancyBboxPatch((8, 33), 84, 25, boxstyle="round,pad=0.8", ec="#D97706", fc="#FFFBEB", lw=2)
    ax.add_patch(p2)
    ax.text(12, 54, "TIER 2: APPLICATION & BUSINESS LOGIC LAYER (NODE.JS / EXPRESS.JS)", fontsize=11, fontweight="bold", color="#92400E")

    components_t2 = [
        ("Auth & Security", "JWT Authentication\nBcrypt Password Hash\nRole-Based Access (RBAC)\nCORS & Input Sanitizer", 10, 35, 19, 16),
        ("Booking Engine", "Slot Availability Lock\nCollision Prevention\nLifecycle State Machine\nAutomated Notifications", 31, 35, 19, 16),
        ("Workshop Operations", "Technician Workload Alloc.\nBay Dispatch Monitor\nInventory Threshold Audit\nBill of Materials (BOM)", 52, 35, 19, 16),
        ("Invoicing & Billing", "Dynamic Rate Calculator\nLabor & Parts Aggregation\nGST/Tax Computation\nAudit Ledger Reports", 73, 35, 19, 16)
    ]
    for title, desc, x, y, w, h in components_t2:
        box = patches.FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.5", ec="#FDE68A", fc="#FFFFFF", lw=1.5)
        ax.add_patch(box)
        ax.text(x + w/2, y + h - 2.5, title, ha="center", va="center", fontsize=8.5, fontweight="bold", color="#78350F")
        ax.text(x + 1.5, y + 6.5, desc, ha="left", va="center", fontsize=7.5, color="#374151")

    # Connector Arrow Tier 2 -> Tier 3
    ax.annotate("", xy=(50, 27), xytext=(50, 33),
                arrowprops=dict(arrowstyle="<->", color="#059669", lw=2, mutation_scale=15))
    ax.text(53, 30, "Mongoose ODM / TCP Port 27017 / BSON Wire Protocol", fontsize=9, color="#065F46", fontweight="semibold")

    # Tier 3: Data Tier
    p3 = patches.FancyBboxPatch((8, 4), 84, 23, boxstyle="round,pad=0.8", ec="#059669", fc="#ECFDF5", lw=2)
    ax.add_patch(p3)
    ax.text(12, 23, "TIER 3: DATA STORAGE LAYER (MONGODB / EMBEDDED MEMORY SERVER)", fontsize=11, fontweight="bold", color="#065F46")

    components_t3 = [
        ("Identity Store", "Users, Roles\nAuth Credentials\nProfile Details", 10, 6, 15, 14),
        ("Fleet & Catalog", "Vehicles, Models\nService Packages\nChecklist Tasks", 27, 6, 15, 14),
        ("Operations DB", "Bookings, Slots\nMechanics Roster\nLive Bay Status", 44, 6, 15, 14),
        ("Inventory Stock", "Spare Parts SKU\nBin Locations\nReorder Triggers", 61, 6, 15, 14),
        ("Financial Ledger", "Invoices, Tax\nPayments, Mode\nAudit Records", 78, 6, 14, 14)
    ]
    for title, desc, x, y, w, h in components_t3:
        box = patches.FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.5", ec="#A7F3D0", fc="#FFFFFF", lw=1.5)
        ax.add_patch(box)
        ax.text(x + w/2, y + h - 2.5, title, ha="center", va="center", fontsize=8, fontweight="bold", color="#064E3B")
        ax.text(x + 1.5, y + 5.5, desc, ha="left", va="center", fontsize=7.2, color="#374151")

    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, "Fig_4_1_Three_Tier_Architecture.png"), dpi=300, bbox_inches="tight")
    plt.close()
    print("Generated: Fig_4_1_Three_Tier_Architecture.png")

# -------------------------------------------------------------
# 2. DFD LEVEL 0 (CONTEXT DIAGRAM)
# -------------------------------------------------------------
def generate_dfd_level_0():
    fig, ax = plt.subplots(figsize=(11, 7.5), dpi=300)
    fig.patch.set_facecolor("#FFFFFF")
    ax.set_facecolor("#FFFFFF")
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis("off")

    ax.text(50, 96, "Figure 4.2: Data Flow Diagram (DFD) Level 0 - Context Diagram",
            ha="center", va="center", fontsize=14, fontweight="bold", color="#111827")

    # Central Process Circle
    proc = patches.Circle((50, 50), 16, ec="#1E3A8A", fc="#DBEAFE", lw=2.5)
    ax.add_patch(proc)
    ax.text(50, 54, "0.0", ha="center", va="center", fontsize=13, fontweight="bold", color="#1E40AF")
    ax.text(50, 48, "Online Vehicle Service\nBooking & Maintenance\nManagement System",
            ha="center", va="center", fontsize=9, fontweight="bold", color="#1E3A8A")

    # External Entity: Customer (Left)
    e_cust = patches.Rectangle((4, 38), 18, 24, ec="#B45309", fc="#FEF3C7", lw=2)
    ax.add_patch(e_cust)
    ax.text(13, 50, "CUSTOMER\n(Vehicle Owner)", ha="center", va="center", fontsize=10, fontweight="bold", color="#78350F")

    # External Entity: Admin (Top)
    e_admin = patches.Rectangle((40, 78), 20, 16, ec="#047857", fc="#D1FAE5", lw=2)
    ax.add_patch(e_admin)
    ax.text(50, 86, "WORKSHOP\nADMINISTRATOR", ha="center", va="center", fontsize=10, fontweight="bold", color="#065F46")

    # External Entity: Mechanic (Right)
    e_mech = patches.Rectangle((78, 38), 18, 24, ec="#6D28D9", fc="#EDE9FE", lw=2)
    ax.add_patch(e_mech)
    ax.text(87, 50, "MASTER\nTECHNICIAN\n(Mechanic)", ha="center", va="center", fontsize=10, fontweight="bold", color="#5B21B6")

    # External Entity: Inventory & Accounting (Bottom)
    e_inv = patches.Rectangle((39, 4), 22, 16, ec="#C026D3", fc="#FAE8FF", lw=2)
    ax.add_patch(e_inv)
    ax.text(50, 12, "FINANCE &\nSPARE PARTS STORE", ha="center", va="center", fontsize=10, fontweight="bold", color="#86198F")

    # Data flows with arrows
    # Customer -> System
    ax.annotate("", xy=(34, 54), xytext=(22, 54), arrowprops=dict(arrowstyle="->", color="#1F2937", lw=1.5))
    ax.text(28, 56.5, "Vehicle & Booking Req.", ha="center", fontsize=7.5, color="#1F2937", fontweight="semibold")

    # System -> Customer
    ax.annotate("", xy=(22, 46), xytext=(34, 46), arrowprops=dict(arrowstyle="->", color="#1F2937", lw=1.5))
    ax.text(28, 43, "Status, Invoice & History", ha="center", fontsize=7.5, color="#1F2937", fontweight="semibold")

    # Admin -> System
    ax.annotate("", xy=(47, 66), xytext=(47, 78), arrowprops=dict(arrowstyle="->", color="#1F2937", lw=1.5))
    ax.text(42, 72, "Approvals &\nAssignments", ha="right", fontsize=7.5, color="#1F2937", fontweight="semibold")

    # System -> Admin
    ax.annotate("", xy=(53, 78), xytext=(53, 66), arrowprops=dict(arrowstyle="->", color="#1F2937", lw=1.5))
    ax.text(57, 72, "Fleet Status &\nRevenue Reports", ha="left", fontsize=7.5, color="#1F2937", fontweight="semibold")

    # System -> Mechanic
    ax.annotate("", xy=(78, 54), xytext=(66, 54), arrowprops=dict(arrowstyle="->", color="#1F2937", lw=1.5))
    ax.text(72, 56.5, "Assigned Job Order", ha="center", fontsize=7.5, color="#1F2937", fontweight="semibold")

    # Mechanic -> System
    ax.annotate("", xy=(66, 46), xytext=(78, 46), arrowprops=dict(arrowstyle="->", color="#1F2937", lw=1.5))
    ax.text(72, 43, "Diagnostics & Parts Used", ha="center", fontsize=7.5, color="#1F2937", fontweight="semibold")

    # System -> Inventory/Finance
    ax.annotate("", xy=(47, 20), xytext=(47, 34), arrowprops=dict(arrowstyle="->", color="#1F2937", lw=1.5))
    ax.text(42, 27, "Stock Deduct &\nPayment Record", ha="right", fontsize=7.5, color="#1F2937", fontweight="semibold")

    # Inventory/Finance -> System
    ax.annotate("", xy=(53, 34), xytext=(53, 20), arrowprops=dict(arrowstyle="->", color="#1F2937", lw=1.5))
    ax.text(57, 27, "Stock Levels &\nSettlement Status", ha="left", fontsize=7.5, color="#1F2937", fontweight="semibold")

    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, "Fig_4_2_DFD_Level_0.png"), dpi=300, bbox_inches="tight")
    plt.close()
    print("Generated: Fig_4_2_DFD_Level_0.png")

# -------------------------------------------------------------
# 3. DFD LEVEL 1
# -------------------------------------------------------------
def generate_dfd_level_1():
    fig, ax = plt.subplots(figsize=(13, 9), dpi=300)
    fig.patch.set_facecolor("#FFFFFF")
    ax.set_facecolor("#FFFFFF")
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis("off")

    ax.text(50, 97, "Figure 4.3: Data Flow Diagram (DFD) Level 1 - Detailed Functional Decomposition",
            ha="center", va="center", fontsize=13, fontweight="bold", color="#111827")

    # External Entities
    entities = [
        ("CUSTOMER", 4, 76, 14, 14, "#FEF3C7", "#B45309"),
        ("WORKSHOP\nADMIN", 4, 38, 14, 14, "#D1FAE5", "#047857"),
        ("MASTER\nTECHNICIAN", 82, 38, 14, 14, "#EDE9FE", "#6D28D9")
    ]
    for name, x, y, w, h, bg, border in entities:
        b = patches.Rectangle((x, y), w, h, ec=border, fc=bg, lw=1.8)
        ax.add_patch(b)
        ax.text(x + w/2, y + h/2, name, ha="center", va="center", fontsize=8, fontweight="bold", color=border)

    # Processes
    procs = [
        ("1.0\nAuth & Access\nControl", 25, 78, "#DBEAFE", "#1E40AF"),
        ("2.0\nVehicle Garage\nManagement", 52, 78, "#DBEAFE", "#1E40AF"),
        ("3.0\nService Slot\nBooking Engine", 38, 55, "#DBEAFE", "#1E40AF"),
        ("4.0\nBay Dispatch &\nMechanic Assign", 65, 55, "#DBEAFE", "#1E40AF"),
        ("5.0\nDiagnostic &\nWork Execution", 65, 30, "#DBEAFE", "#1E40AF"),
        ("6.0\nInvoicing &\nBilling Ledger", 38, 30, "#DBEAFE", "#1E40AF"),
    ]
    for label, x, y, bg, border in procs:
        c = patches.Circle((x, y), 6.5, ec=border, fc=bg, lw=1.8)
        ax.add_patch(c)
        ax.text(x, y, label, ha="center", va="center", fontsize=7.5, fontweight="bold", color=border)

    # Data Stores
    stores = [
        ("D1: Users & Credentials Store", 25, 93, 20, 4),
        ("D2: Vehicles & Garage Store", 60, 93, 20, 4),
        ("D3: Service Packages Catalog", 18, 62, 17, 4),
        ("D4: Bookings & Bay Schedule", 45, 68, 18, 4),
        ("D5: Mechanics Workload Store", 80, 68, 16, 4),
        ("D6: Spare Parts Inventory", 78, 18, 18, 4),
        ("D7: Invoices & Receipts Store", 25, 18, 18, 4),
    ]
    for name, x, y, w, h in stores:
        # Draw open-ended store
        ax.plot([x, x+w], [y, y], color="#4B5563", lw=1.5)
        ax.plot([x, x+w], [y+h, y+h], color="#4B5563", lw=1.5)
        ax.plot([x, x], [y, y+h], color="#4B5563", lw=1.5)
        ax.text(x + w/2, y + h/2, name, ha="center", va="center", fontsize=7.2, fontweight="semibold", color="#1F2937")

    # Connectors & Annotations
    ax.annotate("", xy=(18.5, 83), xytext=(25, 83), arrowprops=dict(arrowstyle="<-", color="#2563EB", lw=1.2))
    ax.annotate("", xy=(25, 84.5), xytext=(25, 93), arrowprops=dict(arrowstyle="<->", color="#4B5563", lw=1.2))
    ax.annotate("", xy=(31.5, 81), xytext=(45.5, 81), arrowprops=dict(arrowstyle="->", color="#2563EB", lw=1.2))
    ax.annotate("", xy=(52, 84.5), xytext=(60, 93), arrowprops=dict(arrowstyle="<->", color="#4B5563", lw=1.2))
    
    # Booking process flows
    ax.annotate("", xy=(38, 71.5), xytext=(38, 61.5), arrowprops=dict(arrowstyle="<-", color="#2563EB", lw=1.2))
    ax.annotate("", xy=(44.5, 55), xytext=(58.5, 55), arrowprops=dict(arrowstyle="->", color="#2563EB", lw=1.2))
    ax.annotate("", xy=(18, 45), xytext=(38, 55), arrowprops=dict(arrowstyle="<-", color="#059669", lw=1.2))
    
    # Dispatch & Mechanic flows
    ax.annotate("", xy=(71.5, 55), xytext=(82, 45), arrowprops=dict(arrowstyle="<-", color="#7C3AED", lw=1.2))
    ax.annotate("", xy=(65, 48.5), xytext=(65, 36.5), arrowprops=dict(arrowstyle="->", color="#7C3AED", lw=1.2))
    ax.annotate("", xy=(71.5, 30), xytext=(82, 38), arrowprops=dict(arrowstyle="<->", color="#7C3AED", lw=1.2))
    ax.annotate("", xy=(65, 23.5), xytext=(78, 20), arrowprops=dict(arrowstyle="<->", color="#D97706", lw=1.2))
    
    # Invoice flows
    ax.annotate("", xy=(58.5, 30), xytext=(44.5, 30), arrowprops=dict(arrowstyle="->", color="#DC2626", lw=1.2))
    ax.annotate("", xy=(38, 23.5), xytext=(34, 18), arrowprops=dict(arrowstyle="<->", color="#4B5563", lw=1.2))
    ax.annotate("", xy=(38, 36.5), xytext=(11, 76), arrowprops=dict(arrowstyle="->", color="#DC2626", lw=1.2))

    # Notes
    ax.text(50, 8, "Key Flow: User Auth -> Vehicle Registration -> Slot Booking -> Admin Dispatch -> Mechanic Execution & Parts -> Invoicing",
            ha="center", va="center", fontsize=8.5, fontstyle="italic", color="#4B5563")

    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, "Fig_4_3_DFD_Level_1.png"), dpi=300, bbox_inches="tight")
    plt.close()
    print("Generated: Fig_4_3_DFD_Level_1.png")

# -------------------------------------------------------------
# 4. USE CASE DIAGRAM
# -------------------------------------------------------------
def generate_use_case_diagram():
    fig, ax = plt.subplots(figsize=(12, 8.5), dpi=300)
    fig.patch.set_facecolor("#FFFFFF")
    ax.set_facecolor("#FFFFFF")
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis("off")

    ax.text(50, 97, "Figure 4.4: UML Use Case Diagram", ha="center", va="center",
            fontsize=14, fontweight="bold", color="#111827")

    # Boundary Box (System Boundary)
    sys_box = patches.Rectangle((22, 5), 56, 88, ec="#1E3A8A", fc="#F8FAFC", lw=2, linestyle="--")
    ax.add_patch(sys_box)
    ax.text(50, 90.5, "Online Vehicle Service & Maintenance System Boundary", ha="center", va="center",
            fontsize=10.5, fontweight="bold", color="#1E3A8A")

    # Actors
    def draw_actor(x, y, name, color):
        # Head
        ax.add_patch(patches.Circle((x, y+3.5), 1.8, ec=color, fc="#FFFFFF", lw=1.5))
        # Torso
        ax.plot([x, x], [y+1.7, y-1.5], color=color, lw=1.8)
        # Arms
        ax.plot([x-2.5, x+2.5], [y+0.5, y+0.5], color=color, lw=1.8)
        # Legs
        ax.plot([x, x-2], [y-1.5, y-5], color=color, lw=1.8)
        ax.plot([x, x+2], [y-1.5, y-5], color=color, lw=1.8)
        ax.text(x, y-7.5, name, ha="center", va="center", fontsize=8.5, fontweight="bold", color=color)

    draw_actor(11, 70, "CUSTOMER", "#B45309")
    draw_actor(11, 28, "WORKSHOP\nADMINISTRATOR", "#047857")
    draw_actor(89, 45, "MASTER\nTECHNICIAN", "#6D28D9")

    # Use Cases (Ellipses)
    use_cases = [
        ("Register & Authenticate Account", 50, 84, ["cust", "admin", "mech"]),
        ("Manage Vehicle Garage Fleet", 37, 75, ["cust"]),
        ("Browse Services & Book Slot", 37, 66, ["cust"]),
        ("Track Live Bay Telemetry Status", 37, 57, ["cust"]),
        ("View Invoices & Pay Online", 37, 48, ["cust"]),
        ("Approve / Reject Bookings", 63, 75, ["admin"]),
        ("Assign Technician to Job", 63, 66, ["admin"]),
        ("Manage Fleet & Service Packages", 63, 57, ["admin"]),
        ("Audit Spare Parts Inventory", 63, 48, ["admin"]),
        ("Generate Financial Reports", 63, 39, ["admin"]),
        ("View Assigned Work Orders", 50, 31, ["mech"]),
        ("Record Diagnostics & Repair Notes", 50, 22, ["mech"]),
        ("Requisition Spare Parts", 50, 13, ["mech", "admin"]),
    ]

    for title, x, y, actors in use_cases:
        e = patches.Ellipse((x, y), 22, 5.5, ec="#2563EB", fc="#EFF6FF", lw=1.2)
        ax.add_patch(e)
        ax.text(x, y, title, ha="center", va="center", fontsize=7.2, fontweight="semibold", color="#1E3A8A")

        if "cust" in actors:
            ax.plot([14, x-10], [68, y], color="#9CA3AF", lw=0.9)
        if "admin" in actors:
            ax.plot([14, x-10], [28, y], color="#9CA3AF", lw=0.9)
        if "mech" in actors:
            ax.plot([86, x+10], [45, y], color="#9CA3AF", lw=0.9)

    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, "Fig_4_4_Use_Case_Diagram.png"), dpi=300, bbox_inches="tight")
    plt.close()
    print("Generated: Fig_4_4_Use_Case_Diagram.png")

# -------------------------------------------------------------
# 5. ENTITY-RELATIONSHIP (ER) DIAGRAM
# -------------------------------------------------------------
def generate_er_diagram():
    fig, ax = plt.subplots(figsize=(14, 9.5), dpi=300)
    fig.patch.set_facecolor("#FFFFFF")
    ax.set_facecolor("#FFFFFF")
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis("off")

    ax.text(50, 97, "Figure 4.5: Entity-Relationship (ER) Diagram", ha="center", va="center",
            fontsize=14, fontweight="bold", color="#111827")

    entities = [
        ("USER", 6, 68, 18, 22, [
            ("PK", "_id: ObjectId"),
            ("•", "name: String"),
            ("•", "email: String (Unique)"),
            ("•", "password: Hash"),
            ("•", "role: Enum(customer,admin)"),
            ("•", "phone: String"),
            ("•", "city: String")
        ], "#1E40AF", "#DBEAFE"),

        ("VEHICLE", 30, 68, 18, 22, [
            ("PK", "_id: ObjectId"),
            ("FK", "ownerId -> User._id"),
            ("•", "regNumber: String"),
            ("•", "brand, model: String"),
            ("•", "year: Number"),
            ("•", "fuelType: Enum"),
            ("•", "mileage: Number")
        ], "#065F46", "#D1FAE5"),

        ("SERVICE", 76, 68, 18, 22, [
            ("PK", "_id: ObjectId"),
            ("•", "name: String"),
            ("•", "category: Enum"),
            ("•", "basePrice: Number"),
            ("•", "durationMinutes: Number"),
            ("•", "checklist: Array"),
            ("•", "isActive: Boolean")
        ], "#92400E", "#FEF3C7"),

        ("BOOKING", 30, 30, 18, 26, [
            ("PK", "_id: ObjectId"),
            ("•", "bookingNumber: String"),
            ("FK", "customerId -> User"),
            ("FK", "vehicleId -> Vehicle"),
            ("FK", "serviceId -> Service"),
            ("FK", "assignedMechanicId"),
            ("•", "appointmentDate: Date"),
            ("•", "timeSlot: String"),
            ("•", "status: Enum(8 states)")
        ], "#5B21B6", "#EDE9FE"),

        ("MECHANIC", 76, 30, 18, 24, [
            ("PK", "_id: ObjectId"),
            ("FK", "userId -> User._id"),
            ("•", "specialization: Array"),
            ("•", "experienceYears: Number"),
            ("•", "status: Enum(Available)"),
            ("•", "activeJobsCount: Number"),
            ("•", "rating: Number")
        ], "#831843", "#FCE7F3"),

        ("INVOICE", 6, 2, 18, 22, [
            ("PK", "_id: ObjectId"),
            ("•", "invoiceNumber: String"),
            ("FK", "bookingId -> Booking"),
            ("FK", "customerId -> User"),
            ("•", "laborAmount: Number"),
            ("•", "partsAmount: Number"),
            ("•", "totalAmount: Number"),
            ("•", "paymentStatus: Enum")
        ], "#1E3A8A", "#EFF6FF"),

        ("SPARE_PART", 76, 2, 18, 22, [
            ("PK", "_id: ObjectId"),
            ("•", "partName: String"),
            ("•", "sku: String (Unique)"),
            ("•", "category: Enum"),
            ("•", "costPrice: Number"),
            ("•", "sellingPrice: Number"),
            ("•", "stockQuantity: Number"),
            ("•", "minThreshold: Number")
        ], "#374151", "#F3F4F6"),

        ("SERVICE_RECORD", 41, 2, 18, 22, [
            ("PK", "_id: ObjectId"),
            ("FK", "bookingId -> Booking"),
            ("•", "diagnosis: String"),
            ("•", "notes: String"),
            ("•", "partsUsed: Array[Part]"),
            ("•", "completedAt: Date"),
            ("•", "roadTested: Boolean")
        ], "#064E3B", "#ECFDF5")
    ]

    for title, x, y, w, h, attrs, border, bg in entities:
        # Header
        box = patches.FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.3", ec=border, fc="#FFFFFF", lw=1.5)
        ax.add_patch(box)
        hdr = patches.Rectangle((x, y+h-4), w, 4, ec=border, fc=bg, lw=1)
        ax.add_patch(hdr)
        ax.text(x + w/2, y + h - 2, title, ha="center", va="center", fontsize=9, fontweight="bold", color=border)

        # Attributes
        curr_y = y + h - 6
        for key, val in attrs:
            prefix_color = "#DC2626" if key == "PK" else ("#2563EB" if key == "FK" else "#6B7280")
            ax.text(x + 1.2, curr_y, f"{key}", fontsize=7, fontweight="bold", color=prefix_color)
            ax.text(x + 3.8, curr_y, val, fontsize=6.8, color="#1F2937")
            curr_y -= 2.2

    # Relationship Diamonds & Lines
    def draw_rel(x, y, text, ec="#D97706", fc="#FFFBEB"):
        d = patches.Polygon([[x, y+2], [x+4, y], [x, y-2], [x-4, y]], ec=ec, fc=fc, lw=1.2)
        ax.add_patch(d)
        ax.text(x, y, text, ha="center", va="center", fontsize=6.5, fontweight="bold", color=ec)

    # 1. USER owns VEHICLE (1 -> N)
    draw_rel(26, 79, "owns")
    ax.plot([24, 28], [79, 79], color="#4B5563", lw=1)
    ax.text(24.5, 80.5, "1", fontsize=8, fontweight="bold")
    ax.text(29.5, 80.5, "N", fontsize=8, fontweight="bold")

    # 2. USER places BOOKING (1 -> N)
    ax.plot([15, 15, 30], [68, 43, 43], color="#4B5563", lw=1)
    ax.text(16, 66, "1", fontsize=8, fontweight="bold")
    ax.text(28, 44.5, "N", fontsize=8, fontweight="bold")

    # 3. VEHICLE subject of BOOKING (1 -> N)
    ax.plot([39, 39], [68, 56], color="#4B5563", lw=1)
    ax.text(40.5, 66, "1", fontsize=8, fontweight="bold")
    ax.text(40.5, 57, "N", fontsize=8, fontweight="bold")

    # 4. SERVICE in BOOKING (1 -> N)
    ax.plot([76, 48], [79, 45], color="#4B5563", lw=1)
    ax.text(73, 76, "1", fontsize=8, fontweight="bold")
    ax.text(50, 46, "N", fontsize=8, fontweight="bold")

    # 5. MECHANIC assigned to BOOKING (1 -> N)
    ax.plot([76, 48], [42, 42], color="#4B5563", lw=1)
    ax.text(74, 43.5, "1", fontsize=8, fontweight="bold")
    ax.text(49, 43.5, "N", fontsize=8, fontweight="bold")

    # 6. BOOKING generates INVOICE (1 -> 1)
    ax.plot([30, 15, 15], [35, 35, 24], color="#4B5563", lw=1)
    ax.text(27, 36, "1", fontsize=8, fontweight="bold")
    ax.text(16.5, 25, "1", fontsize=8, fontweight="bold")

    # 7. BOOKING creates SERVICE_RECORD (1 -> 1)
    ax.plot([39, 39, 50], [30, 26, 24], color="#4B5563", lw=1)
    ax.text(40.5, 28, "1", fontsize=8, fontweight="bold")
    ax.text(48, 25, "1", fontsize=8, fontweight="bold")

    # 8. SERVICE_RECORD consumes SPARE_PART (M -> N)
    ax.plot([59, 76], [13, 13], color="#4B5563", lw=1)
    ax.text(61, 14.5, "M", fontsize=8, fontweight="bold")
    ax.text(73.5, 14.5, "N", fontsize=8, fontweight="bold")

    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, "Fig_4_5_ER_Diagram.png"), dpi=300, bbox_inches="tight")
    plt.close()
    print("Generated: Fig_4_5_ER_Diagram.png")

# -------------------------------------------------------------
# 6. ACTIVITY DIAGRAM (BOOKING LIFECYCLE)
# -------------------------------------------------------------
def generate_activity_diagram():
    fig, ax = plt.subplots(figsize=(13, 9), dpi=300)
    fig.patch.set_facecolor("#FFFFFF")
    ax.set_facecolor("#FFFFFF")
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis("off")

    ax.text(50, 97, "Figure 4.6: Booking Lifecycle & Service Execution Activity Flow",
            ha="center", va="center", fontsize=13, fontweight="bold", color="#111827")

    # Swimlanes
    lanes = [
        ("CUSTOMER", 4, 25, "#FEF3C7", "#D97706"),
        ("SYSTEM SERVER", 27, 24, "#DBEAFE", "#2563EB"),
        ("WORKSHOP ADMIN", 51, 23, "#D1FAE5", "#059669"),
        ("LEAD TECHNICIAN", 74, 22, "#EDE9FE", "#7C3AED"),
    ]
    for name, x, w, bg, ec in lanes:
        lane_box = patches.Rectangle((x, 5), w, 88, ec=ec, fc="#FFFFFF", lw=1.2)
        ax.add_patch(lane_box)
        hdr = patches.Rectangle((x, 88), w, 5, ec=ec, fc=bg, lw=1)
        ax.add_patch(hdr)
        ax.text(x + w/2, 90.5, name, ha="center", va="center", fontsize=9, fontweight="bold", color=ec)

    # Initial Node (Black circle)
    ax.add_patch(patches.Circle((16, 84), 1.8, ec="#111827", fc="#111827"))
    
    # Activity Nodes
    def draw_action(x, y, w, h, text, bg="#EFF6FF", ec="#3B82F6"):
        box = patches.FancyBboxPatch((x-w/2, y-h/2), w, h, boxstyle="round,pad=0.4", ec=ec, fc=bg, lw=1.2)
        ax.add_patch(box)
        ax.text(x, y, text, ha="center", va="center", fontsize=7.2, fontweight="semibold", color="#1E3A8A")

    draw_action(16, 75, 18, 5.5, "Select Vehicle & Slot\nSubmit Booking Req.")
    ax.annotate("", xy=(16, 78), xytext=(16, 82), arrowprops=dict(arrowstyle="->", color="#1F2937", lw=1.2))

    draw_action(39, 75, 18, 5.5, "Validate Availability\n& Record Booking ('Pending')")
    ax.annotate("", xy=(30, 75), xytext=(25, 75), arrowprops=dict(arrowstyle="->", color="#1F2937", lw=1.2))

    draw_action(62.5, 75, 18, 5.5, "Review Booking Queue\n& Verify Slot")
    ax.annotate("", xy=(53.5, 75), xytext=(48, 75), arrowprops=dict(arrowstyle="->", color="#1F2937", lw=1.2))

    # Decision Diamond (Admin Decision)
    dec1 = patches.Polygon([[62.5, 68], [66, 65], [62.5, 62], [59, 65]], ec="#D97706", fc="#FFFBEB", lw=1.2)
    ax.add_patch(dec1)
    ax.annotate("", xy=(62.5, 68), xytext=(62.5, 72.2), arrowprops=dict(arrowstyle="->", color="#1F2937", lw=1.2))
    ax.text(62.5, 65, "Approve?", ha="center", va="center", fontsize=6.8, fontweight="bold", color="#92400E")

    # Rejected Branch
    ax.plot([59, 39, 39], [65, 65, 60], color="#DC2626", lw=1.2)
    ax.text(50, 66.5, "[No: Reject]", fontsize=7, color="#DC2626", fontweight="bold")
    draw_action(39, 57, 18, 5, "Set Status: 'Rejected'\nNotify Customer", bg="#FEE2E2", ec="#EF4444")

    # Approved Branch
    ax.annotate("", xy=(62.5, 56), xytext=(62.5, 62), arrowprops=dict(arrowstyle="->", color="#059669", lw=1.2))
    ax.text(63.5, 59, "[Yes]", fontsize=7, color="#059669", fontweight="bold")
    draw_action(62.5, 53, 18, 5.5, "Assign Lead Technician\nStatus: 'Mechanic Assigned'", bg="#D1FAE5", ec="#10B981")

    # Hand-off to Technician
    ax.annotate("", xy=(85, 53), xytext=(71.5, 53), arrowprops=dict(arrowstyle="->", color="#7C3AED", lw=1.2))
    draw_action(85, 45, 18, 5.5, "Acknowledge Job\nSet Status: 'In Progress'", bg="#EDE9FE", ec="#8B5CF6")
    ax.annotate("", xy=(85, 48), xytext=(85, 50.2), arrowprops=dict(arrowstyle="->", color="#7C3AED", lw=1.2))

    draw_action(85, 35, 18, 5.5, "Execute Diagnosis &\nChecklist Inspection", bg="#EDE9FE", ec="#8B5CF6")
    ax.annotate("", xy=(85, 38), xytext=(85, 42.2), arrowprops=dict(arrowstyle="->", color="#7C3AED", lw=1.2))

    # Parts Decision Diamond
    dec2 = patches.Polygon([[85, 29], [88, 26.5], [85, 24], [82, 26.5]], ec="#D97706", fc="#FFFBEB", lw=1.2)
    ax.add_patch(dec2)
    ax.annotate("", xy=(85, 29), xytext=(85, 32.2), arrowprops=dict(arrowstyle="->", color="#1F2937", lw=1.2))
    ax.text(85, 26.5, "Parts?", ha="center", va="center", fontsize=6.5, fontweight="bold", color="#92400E")

    # Waiting for Parts Branch
    ax.plot([88, 93, 93, 85], [26.5, 26.5, 20, 20], color="#D97706", lw=1.2)
    ax.text(93.5, 23.5, "[Yes]", fontsize=6.8, color="#D97706", fontweight="bold")
    draw_action(85, 17, 18, 5, "Deduct Part from Stock\nStatus: 'Waiting for Parts'", bg="#FEF3C7", ec="#F59E0B")

    # Work Completed
    ax.plot([82, 70, 70, 85], [26.5, 26.5, 11, 11], color="#059669", lw=1.2)
    ax.text(72, 28, "[No / Replaced]", fontsize=6.8, color="#059669", fontweight="bold")
    draw_action(85, 8.5, 18, 5, "Mark Service 'Completed'\nLog Diagnostic Notes", bg="#D1FAE5", ec="#10B981")

    # Server Generates Invoice
    ax.annotate("", xy=(48, 8.5), xytext=(76, 8.5), arrowprops=dict(arrowstyle="->", color="#1F2937", lw=1.2))
    draw_action(39, 8.5, 18, 5.5, "Generate Invoice Record\n& Aggregate Billing (BOM)")

    # Customer settlement
    ax.annotate("", xy=(25, 8.5), xytext=(30, 8.5), arrowprops=dict(arrowstyle="->", color="#1F2937", lw=1.2))
    draw_action(16, 8.5, 18, 5, "Receive Invoice &\nSettle Payment")

    # Final Node (Black bullseye)
    ax.add_patch(patches.Circle((16, 17), 2, ec="#111827", fc="#FFFFFF", lw=1.5))
    ax.add_patch(patches.Circle((16, 17), 1.2, ec="#111827", fc="#111827"))
    ax.annotate("", xy=(16, 15), xytext=(16, 11), arrowprops=dict(arrowstyle="->", color="#1F2937", lw=1.2))

    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, "Fig_4_6_Activity_Diagram.png"), dpi=300, bbox_inches="tight")
    plt.close()
    print("Generated: Fig_4_6_Activity_Diagram.png")

# -------------------------------------------------------------
# 7. SERVICE WORKFLOW (STATE MACHINE)
# -------------------------------------------------------------
def generate_service_workflow():
    fig, ax = plt.subplots(figsize=(13, 7.5), dpi=300)
    fig.patch.set_facecolor("#FFFFFF")
    ax.set_facecolor("#FFFFFF")
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis("off")

    ax.text(50, 96, "Figure 4.7: Service Management State Transition Workflow",
            ha="center", va="center", fontsize=14, fontweight="bold", color="#111827")

    # States
    states = [
        ("Pending", 10, 60, "#FEF3C7", "#D97706", "Booking submitted by customer\nawaiting admin review"),
        ("Confirmed", 32, 60, "#DBEAFE", "#2563EB", "Admin approved slot;\nscheduled in workshop bay"),
        ("Mechanic Assigned", 55, 60, "#EDE9FE", "#7C3AED", "Lead technician designated;\njob card generated"),
        ("In Progress", 78, 60, "#E0E7FF", "#4338CA", "Vehicle in bay; diagnostic scan\n& repairs underway"),
        ("Waiting for Parts", 78, 22, "#FFEDD5", "#EA580C", "Work paused; spare components\nrequisitioned from inventory"),
        ("Completed", 55, 22, "#D1FAE5", "#059669", "Repairs concluded, road test\npassed, invoice generated"),
        ("Cancelled", 20, 22, "#F3F4F6", "#6B7280", "Cancelled by customer\nprior to bay commitment"),
        ("Rejected", 40, 22, "#FEE2E2", "#DC2626", "Declined by workshop admin\ndue to capacity/overload")
    ]

    for name, x, y, bg, ec, desc in states:
        box = patches.FancyBboxPatch((x-8, y-6), 16, 12, boxstyle="round,pad=0.5", ec=ec, fc=bg, lw=2)
        ax.add_patch(box)
        ax.text(x, y+2, name, ha="center", va="center", fontsize=8.5, fontweight="bold", color=ec)
        ax.text(x, y-2.8, desc, ha="center", va="center", fontsize=6.5, color="#374151")

    # Transitions
    # 1. Pending -> Confirmed
    ax.annotate("", xy=(24, 60), xytext=(18, 60), arrowprops=dict(arrowstyle="->", color="#1F2937", lw=1.5))
    ax.text(21, 62.5, "Approve", ha="center", fontsize=7, fontweight="bold", color="#1E40AF")

    # 2. Confirmed -> Mechanic Assigned
    ax.annotate("", xy=(47, 60), xytext=(40, 60), arrowprops=dict(arrowstyle="->", color="#1F2937", lw=1.5))
    ax.text(43.5, 62.5, "Assign Tech", ha="center", fontsize=7, fontweight="bold", color="#6D28D9")

    # 3. Mechanic Assigned -> In Progress
    ax.annotate("", xy=(70, 60), xytext=(63, 60), arrowprops=dict(arrowstyle="->", color="#1F2937", lw=1.5))
    ax.text(66.5, 62.5, "Start Job", ha="center", fontsize=7, fontweight="bold", color="#4338CA")

    # 4. In Progress -> Waiting for Parts
    ax.annotate("", xy=(78, 28), xytext=(78, 54), arrowprops=dict(arrowstyle="->", color="#EA580C", lw=1.5))
    ax.text(82, 41, "Parts Required", ha="left", fontsize=7, fontweight="bold", color="#EA580C")

    # 5. Waiting for Parts -> In Progress (Resumed)
    ax.annotate("", xy=(84, 54), xytext=(84, 28), arrowprops=dict(arrowstyle="->", color="#059669", lw=1.5))
    ax.text(85, 41, "Parts Received", ha="left", fontsize=7, fontweight="bold", color="#059669")

    # 6. In Progress -> Completed
    ax.annotate("", xy=(63, 22), xytext=(70, 56), arrowprops=dict(arrowstyle="->", color="#059669", lw=1.5))
    ax.text(67, 39, "Work Done", ha="center", fontsize=7, fontweight="bold", color="#059669")

    # 7. Waiting for Parts -> Completed
    ax.annotate("", xy=(63, 22), xytext=(70, 22), arrowprops=dict(arrowstyle="->", color="#059669", lw=1.5))
    ax.text(66.5, 24.5, "Resolved", ha="center", fontsize=7, fontweight="bold", color="#059669")

    # 8. Pending -> Cancelled
    ax.annotate("", xy=(16, 28), xytext=(12, 54), arrowprops=dict(arrowstyle="->", color="#6B7280", lw=1.3))
    ax.text(12, 41, "User Cancel", ha="center", fontsize=7, fontweight="bold", color="#6B7280")

    # 9. Pending -> Rejected
    ax.annotate("", xy=(36, 28), xytext=(16, 54), arrowprops=dict(arrowstyle="->", color="#DC2626", lw=1.3))
    ax.text(27, 41, "Admin Reject", ha="center", fontsize=7, fontweight="bold", color="#DC2626")

    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, "Fig_4_7_Service_Workflow.png"), dpi=300, bbox_inches="tight")
    plt.close()
    print("Generated: Fig_4_7_Service_Workflow.png")

if __name__ == "__main__":
    generate_three_tier_architecture()
    generate_dfd_level_0()
    generate_dfd_level_1()
    generate_use_case_diagram()
    generate_er_diagram()
    generate_activity_diagram()
    generate_service_workflow()
    print("All 7 system architecture & design diagrams generated successfully.")
