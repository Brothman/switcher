# TO DO

## Build Buttons

Reusable buttons that switch input feed to their unique ID (which maps to physical button on switcher)

### FIND OPEN SOURCE LIBRARY TO SPEAK TO SWITCHER

Google search.

### IMPLEMENT SWITCHER API IN NODE

Setup express server with Proxy.

### Fetch Switcher Information on Client through Node Microservice

1. Use effect to get information on client
2. Sends an axios request to node backend
3. Node backend speaks to Switcher API
4. Node backend returns button information to client
5. On button clicks, speak to Node backend, which tells Switcher API to change feed focus.

### Test that Switcher functionality works at a distance 

We can control the switcher electronically now, instead of manually.

## Implement Keyboard Listeners
Now we no longer even need to press the buttons. Who needs a mouse?

### Add CSS
Make it look pretty.

### Ask for Feedback
Ask Greg his opinion. If there is remaining time, implement any changes or suggestions that Greg recommends.


### BE CAREFUL:
Make sure once APP loads that we are still receiving pings from switcher. If feed is manually updated, I want the website to know about it.

### Learnings
1. We need to always send a reponse in Node.