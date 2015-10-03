# Node.js Installation

To install node.js go to http://nodejs.org

Install in ubuntu
```sh
sudo apt-get install python-software-properties python g++ make
sudo add-apt-repository ppa:chris-lea/node.js
sudo apt-get update
sudo apt-get install nodejs
```



# Sails Installation

To install the latest stable release with the command-line tool:
```sh
sudo npm -g install sails
```

# Postgres Installation

Open the terminal and type

```sh
sudo apt-get install  postgresql postgresql-client postgresql-contrib libpq-dev
````

Set the PSQL Postgres Password.

```sh
sudo su postgres -c psql
ALTER USER postgres WITH PASSWORD 'yourpassword';
\q
````

You must change the password to OS user called postgres.

```sh
sudo passwd -d postgres
sudo su postgres -c passwd
````

And after type your same password that in the before step.

Now you need create the user and database to WRG.

```sh
sudo su postgres -c psql
create user wrg with password 'welcome';
create database wrg owner wrg;
\q
````

This create a psql user called 'wrg' and the database 'wrg' and his owner is the psql user 'wrg'.


# Download the project

Download the project from github:
```sh
git clone git@github.com:RumenTech/sails-backbone-project.git
```
Or download specific branch rather then whole project
```sh
git clone -b Phase-3 git@github.com:RumenTech/sails-backbone-project.git
```
# Install library in the machine

For Ubuntu
```sh
sudo apt-get install libmagickwand-dev imagemagick
```
For OSX
```sh
brew install imagemagick
```
# Installing auxiliar modules

Installing modules
```sh
# Installing modules
npm install
```

Lift Sails
```sh
# cd into the project folJder
cd testProject

# Fire up the server  
sails lift
```

The default port for Sails is 1337.  At this point if you visit <a href="http://localhost:1337/">http://localhost:1337/</a> You will see the default home page.  

Now, let's get Sails to do cool stuff.
