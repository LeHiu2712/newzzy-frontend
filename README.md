# COVI AWAY WEBSITE
A website that is an online newspaper and forum where users can access categories of filtered, organized information, while being able to share their knowledge and experience relating to the pandemic to other people. 

* Group Github repo: 
* Here is a working live demo: https://covi-away.herokuapp.com

Contents
========

 * [Why?](#why)
 * [Technologies](#technologies)
 * [Usage?](#usage)
 * [Mobile Support?](#mobile-support)
 * [Instructions?](#instructions)
 * [Testing?](#testing)


### Why?
---
I wanted a webpage that allows you to:

+ Updating all information about the pandemic in both Vietnam along with the world on-going news
+ A webpage that displays statistics of Covidn-19 cases
+ Solve all your curiosity related to the pandemic 
+ Access easily to a forum platform interacting with people and social media
+ Freely uploading your thought as a post to a forum 

And is incredibly fault tolerant and user-protective.

`covi-away` is the only webpage that checks all of those boxes.

### Technologies
---
* GitHub
* Figma
* Visual Studio Code
* Bootstrap
* NodeJS
* ReactJS
* MongoDB
* Heroku
* AWS S3
* SendinBlue

###  Mobile Support 
---
The Covi-Away webiste is compatible with devices of all sizes and all OS's, and consistent improvements are being made.

### Instructions  
---
# Steps to run the webpage on your local machine:
* Backend: cd backend -> npm install -> nodemon index.js/ npm run dev/ node index.js 
* Frontend: cd frontend -> npm install -> npm start

# The loading speed of the database sometimes encounters slowliness so what the user can do are:
* Wait for some seconds for the function to redirect and if the waiting time extends then mannually reload the page, same goes for when uploading photo file.
* For the displaying information of the webpage, if the user encounters same situation mentioned above, just gently reload the page will solve the problem.
* In case the database cannot connect, and you want to change connection, the backup data is store in the backUpData folder for you to import to Mongodb

### Testing
---
## Account for testing:
# 3 roles (reporter, admin, user): 
* Username: giangle306
* Password: abc1234!

# 2 roles (reporter, user): 
* Username: davidle345
* Password: abc1234!

# 2 roles (admin, user): 
* Username: harryliu2345
* Password: abc1234!

# 1 role (user): 
* Username: gigihadid234
* Password: abc1234!






