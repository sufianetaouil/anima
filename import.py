import pandas as pd
import uuid
import random
import string
from datetime import datetime

# Load the Excel files
employers_file = "employers.xlsx"
employees_file = "employees.xlsx"

# Read data from Excel
df_employers = pd.read_excel(employers_file).fillna("")
df_employees = pd.read_excel(employees_file).fillna("")

# Function to safely format string values for SQL
def safe_str(value):
    """Escape single quotes and format NULL values properly."""
    if pd.isna(value) or value == "" or value is None:
        return "NULL"
    if isinstance(value, (int, float)):
        if pd.isna(value):
            return "NULL"
        return str(value)
    return "'" + str(value).replace("'", "''") + "'"

# Function to convert boolean values
def safe_bool(value):
    """Convert 'Yes' or 'No' to PostgreSQL boolean values."""
    if pd.isna(value) or value == "" or value is None:
        return "NULL"
    if isinstance(value, str) and value.lower() in ["yes", "true", "1"]:
        return "TRUE"
    return "FALSE"

# Function to handle numeric values
def safe_numeric(value):
    """Handle numeric values properly."""
    if pd.isna(value) or value == "" or value is None:
        return "NULL"
    try:
        float_val = float(value)
        if pd.isna(float_val):
            return "NULL"
        return str(float_val)
    except (ValueError, TypeError):
        return "NULL"
    
def safe_date(value):
    """Handle date values properly."""
    if pd.isna(value) or value == "" or value is None:
        return "NULL"
    try:
        formatted_date = datetime.strptime(value, '%m/%d/%y').strftime('%Y-%m-%d')
        return f"'{formatted_date}'"  # Add quotes around the date
    except ValueError:
        return "NULL"


# Prepare SQL statements lists
sql_employers = []
sql_jobs = []
sql_employees = []

# Employer Table Mapping
employer_id_map = {}  # Store employer ID mappings

for _, row in df_employers.iterrows():
    # if Business Name is empty, skip
    if pd.isna(row["Business Name"]) or row["Business Name"] == "":
        continue

    # if Job Date is an invalid date, replace with NULL
    if pd.isna(row["Job Date"]) or row["Job Date"] == "":
        row["Job Date"] = "NULL"
    try:
        datetime.strptime(row["Job Date"], '%m/%d/%y')
    except ValueError:
        row["Job Date"] = "NULL"

    employer_id = str(uuid.uuid4())  # Generate a UUID for employer ID
    employer_id_map[row["Employer's Telephone"]] = employer_id  # Store mapping for jobs

    employer_sql = f"""
    INSERT INTO "Employer" ("id", "businessName", "phone", "faxNumber", "cellPhone", "contactName", "address", "city", "state", "zip", "position", "gender", "createdAt", "updatedAt") 
    VALUES (
        '{employer_id}', {safe_str(row["Business Name"])}, {safe_str(row["Employer's Telephone"])}, {safe_str(row["Fax Number"])}, 
        {safe_str(row["Cell Phone"])}, {safe_str(row["Employer's Name"])}, {safe_str(row["Address"])}, {safe_str(row["City"])}, 
        {safe_str(row["State"])}, {safe_str(row["Zip Code"])}, {safe_str(row["Position"])}, {safe_str(row["Gender"])}, 
        NOW(), NOW()
    );
    """
    sql_employers.append(employer_sql)

    # Job Table Mapping (assuming each employer has one job)
    job_id = str(uuid.uuid4())  # Generate a UUID for job ID
    job_sql = f"""
    INSERT INTO "Job" ("id", "employerId", "daysNumber", "daysPerWeek", "hoursNumber", "pricePerHour", "tips", "paymentMethod", "jobType", 
        "language", "jobStatus", "jobTime", "jobDate", "status", "createdAt", "updatedAt") 
    VALUES (
        '{job_id}', '{employer_id}', {safe_numeric(row["Days"])}, {safe_numeric(row["Per Week"])}, {safe_numeric(row["Hours"])}, 
        {safe_numeric(row["Per Hour"])}, {safe_bool(row["Tips"])}, {safe_str(row["Payment"])}, {safe_str(row["Job time"])}, 
        {safe_str(row["Language"])}, {safe_str(row["Job Status"])}, {safe_str(row["Job Shift"])}, {safe_date(row["Job Date"])}, 
        {safe_str(row["Job Availability"])}, NOW(), NOW()
    );
    """
    sql_jobs.append(job_sql)

memberId_map = []
# Employee Table Mapping
for _, row in df_employees.iterrows():
    # if Name is empty, skip
    if pd.isna(row["Name"]) or row["Name"] == "":
        continue

    employee_id = str(uuid.uuid4())  # Generate a UUID for employee ID
    # if Member Number is empty, add a random 4 digits and a character
    if pd.isna(row["Member Number"]) or row["Member Number"] == "":
        row["Member Number"] = str(random.randint(1000, 9999)) + str(random.choice(string.ascii_letters))

    # if Member Number is not in memberId_map, add it
    if row["Member Number"] not in memberId_map:
        memberId_map.append(row["Member Number"])
    else:
        row["Member Number"] = row["Member Number"] + str(random.randint(1000, 9999)) 
        memberId_map.append(row["Member Number"])
    employee_sql = f"""
    INSERT INTO "Employee" ("id", "memberId", "name", "dateOfBirth", "status", "joinDate", "gender", "address", "city", "state", "zip", "phone", 
        "position", "jobType", "jobTime", "timeDescription", "hispanic", "nationality", "english", "additionalLanguages", "ssn", 
        "howLongInUSA", "createdAt", "updatedAt") 
    VALUES (
        '{employee_id}', {safe_str(row["Member Number"])}, {safe_str(row["Name"])}, {safe_str(row["Date"])}, 
        {safe_str(row["Active"])}, NOW(), {safe_str(row["Sex"])}, {safe_str(row["Address"])}, {safe_str(row["City"])}, 
        {safe_str(row["State"])}, {safe_str(row["Zip Code"])}, {safe_str(row["Telephone"])}, {safe_str(row["Position"])}, 
        {safe_str(row["Jop Type"])}, {safe_str(row["Jop Time"])}, {safe_str(row["What Time"])}, 
        {safe_bool(row["Hispanic"])}, {safe_str(row["Nation"])}, {safe_bool(row["English"])}, 
        {safe_str(row["Other Lang"])}, {safe_str(row["SS."])}, {safe_str(row["How Long In USA"])}, NOW(), NOW()
    );
    """
    sql_employees.append(employee_sql)

# Write the SQL output to a file
with open("import_data.sql", "w", encoding="utf-8") as f:
    f.write("\n".join(sql_employers + sql_jobs + sql_employees))

print("SQL script generated: import_data.sql")