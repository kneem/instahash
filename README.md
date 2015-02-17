# Instahash (beta)

Instahash is a fully JavaScript-based application used to fetch and display
photos on Instagram from a user-specified hashtag:

![Instahash Screenshot](screenshots/instahash.png?raw=true "Instahash main page")

## Setup
1. You'll need to [create a client application
on Instagram](http://instagram.com/developer/register/) in order to get this
working, and in the [Manage Clients](http://instagram.com/developer/clients/manage/)
page, the `WEBSITE URL` and `REDIRECT URI` need to point to the `/login` page.
For example: `http://localhost:3000/login`.

2. Run `npm install` to install all the node dependencies.

3. Then, you'll need to specify your client ID from step 1 in `app/js/app.js`
and you're all set:
```js
app.constant('clientId', 'YOUR_CLIENT_ID');
```

[Instahash.com](http://instahash.com) is under construction and will be based off
of this application. Stay tuned!

## Technologies
* [Angular.js](https://angularjs.org/)
* [Node.js](http://nodejs.org/)
* [Express.js](http://expressjs.com/)

## TODO
* Handle 401's, timeouts, and rate-limiting.
* Add `api.js` for internal APIs.
* Switch from a LEAN stack to a MEAN stack.
* Minify bower dependencies.
* Remove logs.
* Better error page.
* Better styling:
  * Use Less.js.
* Add support for [real-time subscriptions](http://instagram.com/developer/realtime/).
* Add support for [Famous](http://famo.us/).
