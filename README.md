xPlacesMobile
=============

xPlaces 2.0 is the evolution of xPlaces and it is focused on mobile devices and web support. 
It is based on a much more modern software architecture, than the previous version, built on top of Node.js and uses plenty of features of HTML5 such as WebSocket and access to various mobile sensor (accelerometer, gyroscope, geolocation and so forth).   

But the major enhancement of the new version is that is backward compatible with an existing xPlaces network. 
Your can run a new mobile service that speaks flawlessly with an existing C++ based network.   
The developer is now able to test and deploy an application that runs directly on mobile devices with or without the need to install any app on it, just pointing the mobile browser to a web page. 

# Files and folders structure:

  * node_modules
  * examples
  * misc
  * JSON

***
## __node_modules__ 
contains the whole library files.
## __examples__ 
contains stuff that use this library so you can see a real world example.
##__JSON__ 
contains all configuration and data files needed by both library and examples. 
You can write your own configuration file and save it here. To see how to write a valid 
configuration file please refer to documentation or use configuration.json as template.
##__misc__
Contains stuff and files that aren't finished yet nor well documented. 
Think this as a work-in-progress folder.

# Other infos
We now developing a new website and release the code through GitHub.
For now on you can send insults and ask questions to 

*Simone Kalb*
kalb@crs4.it

*Gian Maria Simbula*
simbula@crs4.it
