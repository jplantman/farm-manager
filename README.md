Notes To Me:


There are tables which stand alone:
1. Gardens: name, notes (eg. The Back Garden)
2. Plant Families: name, latin name, link, notes (eg Pea Family)
3. Task Types: name, notes (eg Weeding)
4. Workers: name, position, start date, end date (eg Bob)

then theres tables which relate to other tables:
5. Crops: name, variety, latin name, familyID(1), spacing, dtm, link, notes
6. Rows: name, gardenID(1), size, notes
7. Tasks: taskTypeID(3), familyID(2), workerID(4), date, time, notes

The app allows for simple and complex searches.

Search functionality starts with a search bar which turns a search into a regexp and tests all fields in the table for matches
An advanced search menu can drop down, allowing for field-specific searches on multiple fields at a time.

eg simple search: 
search crops which contain a string in any field;

eg complex searches: 
Q: when was row x weeded last?
A: search tasks where row == x and tasktype == weeding, sort by date

Q: who spent the most time harvesting?
A: search tasks where tasktype == harvesting, once per worker, summing the total time (better than nothing, but not ideal)

Q: when did crop x start and stop being harvested each year?
A: search tasks where crop == x and tasktype == harvest, sort by date

Q: what rows have no crops?
A: search rows, sort by crops

Q: what rows have been weeded in the last month?
A: search tasks where tasktype == weeding and date == last month, sort by rows (rows will appear multiple times, but still ok)

Q: what rows have NOT been weeded in the last month?
A: search tasks where tasktype == weeding and date == last month, sort by rows, look for rows not present (a really bad solution)

Q: which row was weeded last?
A: search tasks by weeding, sort by date. look out for rows that have never been weeded.

Q: what workers never did task x? 
A: search tasks where tasktype == x, sort by workers, look for workers not present.




==ARCHITECTURE==

I will try next for a simpler architecture. Having big classes for tables and forms was too messy, as each table and form is too different. Instead I will do things separately, and extract small pieces of functionality only.

A main.js file will hold universal functions and variables.
Then, each table will have 1 or more files for its features. each table might get it's own folder.

js - main.js
   - database.js
   - tables - gardens - gardens.js
   					  - add-form.js
   					  - edit-form.js
   					  - search.js
   					  - table.js
   			- families -
   			- task-types -
   			- workers -
   			- crops -
   			- rows -
   			- tasks -

I will try to use as little jquery as possible. but this is less important than the other parts. I only really need it for the date picker.