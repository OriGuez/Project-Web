# React-Web App + Servers
This is the Final submission by Matan Sabag and Ori Guez.
React Web App + Servers

# Wiki
## The wiki is in "wiki" folder in [Wiki Directory](./wiki/)


# Exercise 1
Exercise 1 main branch is called "main" and is here:
https://github.com/OriGuez/Project-Web/tree/main

# Exercise 2
Exercise 2 main branch is called "main-Exercise2" and is here:
https://github.com/OriGuez/Project-Web/tree/main-Exercise2

the project has 2 folders:
- project-web : the react app (frontend).
- project-server : the server (backend).

the search fields are video title and description.
the username is case-sensitive.
supported file types are:
- jpg,jpeg,png,webp,gif,svg for images.
- mp4,mkv,mov,wmv,webm for videos.

the latest build of the react app is in "public" directory in the server.
project was tested on windows and mac on chrome.

## Filling details in .env file
please fill the .env file (which is inside the config folder in project-server). its made of 3 fields:
* PORT=
* MONGO_URI=""
* ACCESS_TOKEN_SECRET=""
* TCP_HOST=""
* TCP_PORT=""


#### ACCESS_TOKEN_SECRET is the secret key of jwt token.
#### PORT is the port the server will run on.

#### the mongo_URI should include the database name of ViewTube for consistency.
for example "mongodb://localhost:xxxxx/ViewTube".
  if you have username and password for the mongoDB server you should insert them too.


## Initialize data on The Server
We've created a script that initializes the database with 30 videos, 10 users and some comments.
- to run the script first put in the config/.env file the mongo URI including the database name (as mentioned above).
- Then, start the terminal on "project-server/initData" folder and hit
```
node initData.js
```
- The media (actual videos and images) is already in the "uploads" folder.
#### now the DB is full.

## Running The Server
first, make sure that you've filled the .env file.
Then, please install the dependencies using
```
npm install
```
on both project-server and project-web folders. (although project-web isnt neccesary to run the server because its build is sitting in "public" folder in project-server).
In order to run the server you need to go to the terminal on project-server directory and hit
```
node server.js
```
now go to the address and see the website.


### Routes and file uploads
- the server supports the routes mentioned in exercise 2-3 instructions.

- files are sitting on the server so in order to register a user you need to send a POST request to /api/users with "image" field as the image file and "username","password","displayName" fields too.

- in order to add a video you need to send a POST request to /api/users/:id/videos/:pid with "image" field as the thumbnail file ,"video" field as the video file, and "title" and "description" fields too (and the token in header).
- for video and user edits its similar.