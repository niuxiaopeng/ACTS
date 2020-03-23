
# adep-webapp

## Description
Adep module for web application development.

Adep-webapp provides a design pattern called Flux. Please keep in mind that you need to understand its design to leverage this module properly.


## Prerequisite
* Node.js v8.9.2 or higher 8.x LTS version
* npm 5.5.1 or higher version bundled with Node.js 8.x LTS version

## Setup

* Install all the packages:
```
 npm install
```

## Build

* Build with a default profile:
```
npm run build
```

* Build with a specific profile:
```
npm run build --env={PROFILE_NAME}
```

## Test

* Start dev server and watch resources:
```
npm run serve
```

* Start dev server and watch resources with a specific profile:
```
npm run serve --env={PROFILE_NAME}
```

## Reelase

* Create release zip file:

```
gradlew release -PPROFILE=dev
```
