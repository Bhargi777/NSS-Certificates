import csv

# Input and output file names
input_file = 'roll_numbers.csv'   # This CSV should have a header and roll numbers in the first column
output_file = 'emails.csv'

# Read roll numbers and create emails
with open(input_file, 'r') as infile, open(output_file, 'w', newline='') as outfile:
    reader = csv.reader(infile)
    writer = csv.writer(outfile)
    
    # Write header
    writer.writerow(['Roll Number', 'Email'])
    
    next(reader)  # Skip header
    for row in reader:
        roll_number = row[0].strip()
        email = roll_number.lower() + '@cb.students.amrita.edu'
        writer.writerow([email])

print(f"Emails written to {output_file}")
