docker-indicator
----------------

Shows an icon in the menu bar with the status of docker.

**Why?**

I often forget if docker is running and this gives a quick visual.

## Status

Running (can make a connection)

![images/up.png](images/up.png)

Not running (or at least cannot connect to one)

![images/down.png](images/down.png)

*It can take a few seconds to update the status*

Started container list (shows on top)

![images/started-container.png](images/started-container.png)

Stopped container list

![images/stopped-containers.png](images/stopped-containers.png)


## Usage

This is very early in development.
Start with `npm start` or `electron .` from the repo directory.

## Connection
Put a .docker-indicator.yaml file in your home directory.

```
docker:
    protocol: https
    ip: 192.168.99.100
    port: 2376
    ca: /Users/user/.docker/machine/machines/default/ca.pem
    cert: /Users/user/.docker/machine/machines/default/cert.pem
    key: /Users/user/.docker/machine/machines/default/key.pem
```

### Icon
[Whale by Aditya Dipankar from the Noun Project](https://thenounproject.com/search/?q=whale&i=194454)

## Changelog

**0.0.3**
* New icons
* UI updates appropriately

**0.0.2**
* Try to connect to docker smartly

**0.0.1**
* UI reacts to Docker events
* Start/Stop buttons work on containers

## TODO
* Builds (icons, packages)
