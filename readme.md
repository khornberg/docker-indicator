docker-indicator
----------------

Shows an icon in the menu bar with the status of docker.

**Why?**

I often forget if docker is running and this gives a quick visual.

## Status

running (can make a connection)

![images/up.png](images/up.png)

not running (or at least cannot connect to one)

![images/down.png](images/down.png)

Stopped container list
![images/stopped-containers.png](images/stopped-containers.png)

Started container list (shows on top)
![images/started-container.png](images/started-container.png)


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

## Changelog

0.0.2
* Try to connect to docker smartly

0.0.1
* UI reacts to Docker events
* Start/Stop buttons work on containers

## TODO

* ui errors, better state management, etc.
* build (icons, size, packaging, etc.)
* configuration via ui?
