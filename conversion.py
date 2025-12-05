import csv

input_file = "roll_numbers.csv"
output_file = "conv_roll.csv"

with open(input_file, "r") as infile, open(output_file, "w",newline='') as outfile:
    reader = csv.reader(infile)
    writer = csv.writer(outfile)
    
    writer.writerow(['roll_numbers_in_caps'])
    
    next(reader)

    for row in reader:
        roll_number = row[0].strip()
        rOLL_number = roll_number.upper()
        writer.writerow([rOLL_number])


    

