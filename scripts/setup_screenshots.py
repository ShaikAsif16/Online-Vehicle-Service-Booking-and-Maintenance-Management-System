import os
import shutil

src_dir = r"C:\Users\shaik\.gemini\antigravity\brain\c5e4a360-c64d-4b79-9a47-d2a1d117689b\.user_uploaded"
dest_dir = "Project_Screenshots"

os.makedirs(dest_dir, exist_ok=True)

mapping = [
    ("media_1794426466772_ebb375d5.jpg", "Fig_7_1_Login_Portal.jpg"),
    ("media_1794426496479_ef8a2b34.jpg", "Fig_7_2_Admin_Dashboard.jpg"),
    ("media_1794426518907_7b0c06c8.jpg", "Fig_7_3_Service_Bookings_Management.jpg"),
    ("media_1794426537235_da07544f.png", "Fig_7_4_Customer_Management.png"),
    ("media_1794426605989_8d4f8611.jpg", "Fig_7_5_Job_Specification_Modal.jpg"),
    ("media_1794426617004_bfb24033.png", "Fig_7_6_Customer_Profile_Modal.png"),
    ("media_1794426627788_3d44a84f.jpg", "Fig_7_7_Vehicle_Fleet_Registry.jpg"),
    ("media_1794426642680_169936f3.jpg", "Fig_7_8_Master_Technicians_Roster.jpg"),
    ("media_1794426645219_1e548cf0.jpg", "Fig_7_9_Add_Technician_Modal.jpg"),
    ("media_1794426654535_76653b80.jpg", "Fig_7_10_Service_Catalog.jpg"),
    ("media_1794426661492_15b3c6d8.jpg", "Fig_7_11_Edit_Service_Modal.jpg"),
    ("media_1794426667538_7192d1b7.jpg", "Fig_7_12_Create_Service_Modal.jpg"),
    ("media_1794426678749_ba2b92e3.jpg", "Fig_7_13_Spare_Parts_Inventory.jpg"),
    ("media_1794426684253_a9bfe89b.jpg", "Fig_7_14_Add_Spare_Part_Modal.jpg"),
    ("media_1794426693261_72452a6e.jpg", "Fig_7_15_Invoices_Revenue_Ledger.jpg"),
]

for src_name, dest_name in mapping:
    src_path = os.path.join(src_dir, src_name)
    dest_path = os.path.join(dest_dir, dest_name)
    if os.path.exists(src_path):
        shutil.copy2(src_path, dest_path)
        print(f"Copied: {src_name} -> {dest_name}")
    else:
        print(f"Missing source: {src_name}")

print("Screenshot setup completed.")
