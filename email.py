import csv


input_file = 'roll_numbers.csv'   
output_file = 'emails.csv'

with open(input_file, 'r') as infile, open(output_file, 'w', newline='') as outfile:
    reader = csv.reader(infile)
    writer = csv.writer(outfile)
    
    writer.writerow(['Email'])
    
    next(reader)  
    for row in reader:
        roll_number = row[0].strip()
        email = roll_number.lower() + '@cb.students.amrita.edu'
        writer.writerow([email])

print(f"emails have been added to {output_file}")