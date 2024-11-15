A simple web crawler that Playwright with Node.js.

assist.org is a useful tool for community college students looking for courses that are required for transfering to UC. The problem is, the required courses are often not available in the community college a student is currently attending. It's a tedious and painful job to search for other colleges that support THE course s/he wants. I made this crawler to help my partner, and figured someone might be having the same problem.

I left the code highly specific to my needs. Notice from the url of assist that year=75(2024) and institution=79(UC Berkeley) can be customized for your own needs. From there, you want to edit what to type into the search form (the prefix of your major). And finally, which section of text you want to parse. That's highly dependent on the agreement, so I'm leaving up to the user to figure out. It shouldn't be a difficult problem.

Once the report is created in a txt file, just use a chatbot of your choice to generate a table for you. I asked gemini with a prompt like this: "This is the list of colleges that may support equivalent course of <the course>. I'd like you to make a table out of this text. The column of the table will be college_name, class code, class name. Below is the full txt...."

Hopefully someone finds it useful. Also to the admins of assist.org, if you're reading, please make the website searchable so we don't have to do this.
