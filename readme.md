docker-indicator
----------------

Shows an icon in the menu bar with the status of docker.


**Why?**

I often forget if docker is running and this gives a quick visual.

## Status

running (can make a connection)

![images/up.png](images/up.png)

not running (or at least cannot connect to)

![images/down.png](images/down.png)

## Usage

This is very early in development.
Start with `npm start` or `electron .` from the repo directory.

## TODO

* use docker machine settings if available
* react to docker events instead of polling
* make buttons work
* ui errors, better state management, etc.
* fix build command
* build (icons, size, packaging, etc.)
* configuration via ui?
