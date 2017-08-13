Left To Do:

- Integrate Rows And Crops
   - rows should have a crop field. 
   - they should allow for an array of crops.
   - tasks like direct seeding or transplanting should automatically add a crop to a row. 
   - tasks like harvesting or clearing a row should allow a user to mark a row as complete. 
   - these tasks can be color-coded - green and red for tasks that start and clear a crop in a row. 
   - tasks that start a crop can be of any crop, but maintenance tasks like harvesting, weeding, etc, can only be for crops that exist in that row.

- greenhouse seeding tasks should keep track of whether the seedings have been planted out yet or not. seedlings that have not  been transplanted out yet should quickly show in a section of the home screen.

- tips section with different tips appearing

- Home Screen
   - Tasks To-Do Tab
      - should have a section that lists tasks whose dates are from today till next week (or month, optionally)
      - these tasks should be in a condensed, easy-to-scan format
      - you should be able to easily edit the properties to show that it was completed, by who, and the time it took, and notes.

   - Quick searches: should have buttons to automatically search for common searches, including:
      - what GH seedling tasks are not yet marked as transplanted.
         ( maybe this should be included in a window of its own, in the home area )
      - what crops need harvesting
      - what rows might need weeding or watering

- weather record
- garden notebook
- graphing

- multi add range
- help guide
- options

- get weather
- planting calculator
- harvest tracker

- cool css loading symbol
- rounding for adder

- add a 'worker currently employed' field
- edit items showing / item editing should work at each field, changing the filed to an input, instead of a form? maybe?
- adv search options up and down arrow

- photo album with captions and tags for each thing


Done: 
- the part that shows the table should overflow: scroll, to allow for big tables.
- search by date range






Notes To Me:


There are tables which stand alone:
1. Gardens: name, notes (eg. The Back Garden)
2. Plant Families: name, latin name, link, notes (eg Pea Family)
3. Task Types: name, notes (eg Weeding)
4. Workers: name, position, start date, end date (eg Bob)

then theres tables which relate to other tables:
5. Crops: name, variety, latin name, familyID(1), spacing, dtm, link, notes
6. Rows: name, gardenID(1), size, harvestTracker, notes, 
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
A: 
A: search tasks where tasktype == weeding and date == last month, sort by rows, look for rows not present (a really bad solution)

Q: which row was weeded last?
A: search tasks by weeding, sort by date. look out for rows that have never been weeded.

Q: what workers never did task x? 
A: search tasks where tasktype == x, sort by workers, look for workers not present.


HARVEST TRACKER FEATURE:
 harvest tracker will tell you which rows need harvesting.
 1. It will keep track of when rows are planted, and if that crop's DTM has passed. if it has, that row is harvestable.
 2. when a row is harvested, a 'harvest again' option will let the user pick how many days from now to mark this row as harvestable, or to mark the row as 'done' (as in, no more to harvest here) 

 Technical notes for harvest tracker:
 when a 'direct seeding' or 'transplanting' task is entered, the associated row's harvestTracker field will be updated to show that it is planted. 
 The harvestTracker will say 'growing' if the crop's DTM has not passed, else use phrases like 'harvest me', 're-growing', and 'done', to keep track of the harvest status of the row. 


==ARCHITECTURE==

I will try next for a simpler architecture. Having big classes for tables and forms was too messy, as each table and form is too different. Instead I will do things separately, and extract small pieces of functionality only.

A main.js file will hold universal functions and variables.
Then, each table will have 1 or more files for its features. each table might get it's own folder.


js - database.js
   - tables - tables.js
   			- gardens - gardens.js
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

==Database Managemnt==

-datastore will hold a temp memory version of the database.
-it will 'refresh' on startup before fetching the tables, and also whenever an item is added or deleted.
-'fetchTable' will occur on startup after refreshing, and after searches and tab clicks






