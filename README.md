# Appstrap

Appstrap is an uber-configurable mock server for bootstrapping single page apps.  It is powered by node.js and express.

Driven by a simple but powerful configuration, your server can be as simple or as robust as you desire with very little effort.  From a single endpoint that responds with a simple json payload all the way up to an in-depth set of functions that provide a realistic stand-in for your production server - you can do it with appstrap.

Appstrap's primary mission is providing an easy way to enable a workflow that allows you to see data backed interface changes in your browser, but that's only the beginning.  Once your server configuration is set up, it can also spin up headless server(s) for local integration testing.  QA can be a bit unstable at times?  No problem when you can run locally!  The robust command line api provides access to the same set of features you would see via the web control panel so you have a seemless experience no matter how you use it.

### But.. why?
Appstrap was the solution I designed to solve a few personal problems in my day job.  With a very large enterprise codebase and a sizeable and complex stack to deal with, it often felt like I spent more time setting up data to test my interface than I spent actually developing it.  In addition, there were unit tests, integration tests, writing detailed pull requests on how another engineer would have to spend their time again mocking more data to test the code, etc.  It all just seemed tedious, frustrating, and not worth it.

I set out to design a solution for my own use that could reduce or even eliminate the need to set this data up more than once.  That data could then be used in all scenarios from development, testing, and product verification.

### How is this any different from webpack-dev-server or something like that?

Appstrap was designed first and foremost to be a convenient way to **test** an application.  The fact that it spins up an express server is about where the similarities end.

Some of the features you can expect from your appstrap instance are:

#### Error mocking
So you've mocked an endpoint or two.  When all goes well, its great.  What happens if a route fails?  Your interface probably needs to handle that scenario also.  Simply open the appstrap control panel at `appstrap.localhost:{yourport}`, select your endpoint, and enable the "Return Error" toggle.  When enabled, the toggle will turn red.  All calls to the endpoint while this setting is on will return a 500 http error instead.  Simply toggle the setting back off to return back to receiving your original endpoint response as expected.

Note: In the future, this error code will be configurable via the control panel also.

// TODO add gif of this process once demo project is built

#### Latency mocking
Often once your application makes it to production and is no longer on your local machine, latency between requests becomes one of those things you just can't ignore.  Appstrap provides an easy way to test latency in your local environment via toggle as well. Simply open the appstrap control panel at `appstrap.localhost:{yourport}`, select your endpoint, and enable the "Simulate latency" toggle.  When enabled, the toggle will turn yellow and a text input will appear beside it.  Enter the amount of delay (in miliseconds) that you would like to add to the endpoint and it will take effect immediately.  All calls to the endpoint will wait the specified amount of miliseconds before returning the response.  Simply toggle the setting back off to return back to receiving your original endpoint response immediately as expected.

// TODO add gif of this process once demo project is built

#### Presets (aka fixtures)

#### Headless support


#### In-Memory state
When your appstrap server is first started, an in-memory state object is created for you. In any of your specified endpoint method handlers, the state will be added to the `req` object as `req.state`.

State can be preloaded at instance startup by providing a value to the `initialState` property in your appstrap config file.  Whether you are setting your state from the payload of a json file, or the result of a generation function, it just needs to be an object.

If you do not preload your state, it is defaulted to an empty object `{}`



// Unique to the instance of the server

#### Parallel runners
As you write feature tests that utilize your appstrap server, running your integration tests in parallel allows for much faster iteration on your test suite.  As you create new instances of appstrap (via `new Appstrap()`), if the port specified in your config is already in use by another instance, appstrap will automatically bind the new instance to an available open port on the machine. As long as you have ports to bind to, you can continue to spawn new servers!  Use within reason of course.

All calls to this.server.{method} will access the appropriate instance.  This allows you to isolate state between features and even on a test by test level without interfering with other unrelated tests that are in flight.

--

### Future plans

#### Feature demo mode
Based on a step definition in your tests (mocha, jest, etc..) you'll be able to utilize the power of other appstrap features to stage your app to a relevant state to queue your feature and step through it piece by piece in the browser.  This is especially useful for someone doing a code review (for easy visual confirmation) or presenting to product for acceptance!


