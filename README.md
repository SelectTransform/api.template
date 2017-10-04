# JSON template for web servers

With increased usage of APIs, web servers are used more and more to return JSON objects instead of HTML. This is especially true for microservices, which mostly communicate via JSON payload.

As we start using JSON for increasingly complex use cases than just simple key/value pairs, we need a powerful template engine. There are already tons of template engines for filling out dynamic HTML templates such as [Handlebars](http://handlebarsjs.com), but surprisingly there is no serious option for a powerful JSON template engine.

`ST` solves this problem. With its super-comprehensive feature set, you can achieve all of what you can achieve with an HTML template engine, but for JSON.

## Usage

This example demonstrates the power of `ST` as a JSON template engine for web servers such as `express.js`.

To run, install dependencies and run the app:

```
$ npm install
$ node app
```

This will start the express server.

Then open your browser and try the following urls:

- [http://localhost:3000/users](http://localhost:3000/users)
- [http://localhost:3000/posts](http://localhost:3000/posts)
- [http://localhost:3000](http://localhost:3000)

## How it works

The first two endpoints (`/users` and `/posts`) load JSON straight from a faux DB (located at `/db/users.json` and `/db/posts.json` respectively, but you can imagine using a MongoDB, CouchDB, or any relational DB as well) 

But go to the root endpoint and you'll see the power of the template engine. It creates an entirely new JSON object from the previous two by passing them to a JSON template located at `template.json` under the root folder.

Take a look at the `app.js` code for the `/` route handler, which looks like this:

```
app.get('/', function (req, res) {
  var json = JSON.select({ users: users, posts: posts })
                  .inject(['moment'])
                  .transformWith(template)
                  .root()
  res.json(json)
})
```

Here's what's going on:

1. Select the data object:

    ```
    {
      users: [{
        "id": 1, "name": "ethan", "url": "https://textethan.com"
      }, {
        "id": 2, "name": "jason", "url": "https://jasonette.com"
      }, {
        "id": 3, "name": "phil", "url": "https://www.philzcoffee.com/"
      }],
      posts: [{
        "user_id": 1, "title": "hello world", "content": "just setting up my blog", "created_at": 1505777155159
      }, {
        "user_id": 1, "title": "post2", "content": "second post", "created_at": 1505756257359
      }, {
        "user_id": 2, "title": "cool", "content": "cool blog bro", "created_at": 1504777258259
      }, {
        "user_id": 3, "title": "im here", "content": "im here too, welcome me", "created_at": 1503777259159
      }]
    }
    ```

2. inject `moment.js` into the data context. After injection, the selected data object will look something like this:

    ```
    {
      users: [{
        "id": 1, "name": "ethan", "url": "https://textethan.com"
      }, {
        "id": 2, "name": "jason", "url": "https://jasonette.com"
      }, {
        "id": 3, "name": "phil", "url": "https://www.philzcoffee.com/"
      }],
      posts: [{
        "user_id": 1, "title": "hello world", "content": "just setting up my blog", "created_at": 1505777155159
      }, {
        "user_id": 1, "title": "post2", "content": "second post", "created_at": 1505756257359
      }, {
        "user_id": 2, "title": "cool", "content": "cool blog bro", "created_at": 1504777258259
      }, {
        "user_id": 3, "title": "im here", "content": "im here too, welcome me", "created_at": 1503777259159
      }],
      moment: [[moment.js function]]
    }
    ```

3. transform with the JSON template (`template.json`)

    ```
    {
      "posts": {
        "{{#each posts}}": {
          "author": {
            "user_id": "{{user_id}}",
            "username": "{{$root.users[user_id-1].name}}",
            "website": "{{$root.users[user_id-1].url}}"
          },
          "title": "{{title}}",
          "content": "{{content}}",
          "timestamp": "{{$root.moment(created_at).startOf('hour').fromNow()}}"
        }
      }
    }
    ```

Note that we make use of the built-in `$root` context, which lets you reach outside of the loop to get the root context.

The result will be:

```
{
  "posts": [
    {
      "author": {
        "user_id": 1,
        "username": "ethan",
        "website": "https://textethan.com"
      },
      "title": "hello world",
      "content": "just setting up my blog",
      "timestamp": "a day ago"
    },
    {
      "author": {
        "user_id": 1,
        "username": "ethan",
        "website": "https://textethan.com"
      },
      "title": "post2",
      "content": "second post",
      "timestamp": "a day ago"
    },
    {
      "author": {
        "user_id": 2,
        "username": "jason",
        "website": "https://jasonette.com"
      },
      "title": "cool",
      "content": "cool blog bro",
      "timestamp": "12 days ago"
    },
    {
      "author": {
        "user_id": 3,
        "username": "phil",
        "website": "https://www.philzcoffee.com/"
      },
      "title": "im here",
      "content": "im here too, welcome me",
      "timestamp": "24 days ago"
    }
  ]
}
```
