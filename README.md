# Grant Server

![Codecov](https://img.shields.io/codecov/c/github/ivandotv/grant-server)
![CI](https://github.com/ivandotv/grant-server/workflows/Unit%20tests/badge.svg)

This module is packaged [Grant OAuth proxy server](https://github.com/simov/grant). That means that you can just install this package and run `grant-srv` to have a proxy OAuth server running.

## Install

```js
npm install grant-server
```

run it:

```js
grant - server
```

## Table of Contents

- [How it works](#how-it-works)
- [Command line options](#command-line-options)
- [Docker image](#docker-image)

## How it works

After installing the package just run `grant-srv` to have a server running. You will need a [grant configuration file](https://github.com/simov/grant#configuration) to set up different OAuth providers. The server will automatically watch for changes in the configuration file, and it will automatically reload.

example configuration file:

```json
{
  "defaults": {
    "origin": "http://localhost:3000",
    "prefix": "/oauth"
  },
  "google": {
    "key": "CLIENT_ID",
    "secret": "CLIENT_SECRET",
    "callback": "https://redirect-user-to-your-app.com",
    "scope": ["openid"]
  }
}
```

By using the file above we are enabling google OAuth point on `http://localhost:3000/oauth/google`, and we are asking for `openid` scope. After the tokens have been acquired, the user will be redirected to `https://redirect-user-to-your-app.com`

> Please note that the original grant server code can take internal routes for a `callback` e.g. (`/my-google-callback`) but since the `server` is self-contained you can't access internal routes, so you will always need to redirect to some outside server or service (`http://localhost:4000`, `http://your-app.com`)

You can also send a `POST` request to the OAuth point like so:

```html
<form action="/oauth/google" method="POST" accept-charset="utf-8">
  <fieldset>
    <div>
      <label>
        <input type="checkbox" name="scope" value="openid" checked /> openid
      </label>
    </div>
    <div>
      <label>
        <input type="checkbox" name="scope" value="email" /> email
      </label>
    </div>
    <div>
      <button>Submit</button>
    </div>
  </fieldset>
</form>
```

## Command line options

- `-c` or `--config` Grant configuration file. If not provided, by default server will look for `config.json` in the currently executing directory.

- `-d` or `--debug` Enable writing tokens to `stdout`. It uses [request-logs module](https://github.com/simov/request-logs). If only the flag is passed it will default to `res,json` otherwise you can customize what the output will be e.g. `-d res,req,json,body`

- `p` or `--proxy` By default internal `express` app will have `trust proxy` flag set to `true`. You can pass in `false` to disable the proxy. Or use any of the options supported by the [express app](http://expressjs.com/en/api.html#trust.proxy.options.table)

## Docker image

Docker image is available on [docker hub](https://hub.docker.com/repository/docker/ivandotv/grant-server). Image is based on github releases, so it's always up to date.

### Usage

Pull the image:

```bash
docker image pull ivandotv/grant-server
```

Run the container:

```bash
docker run -it -v /config-dir:/opt/grant-server/config-dir ivandotv/grant-server -d -c config/config.json
```

Few things to keep in mind when using the docker image.

- Server is started in `/opt/grant-server` directory inside the container.
- Make sure that exposed port is the same as in the `config.json` file.
- If you mount only the external config file: `-v config.json:/opt/grant-server/config.json` Automatic reloading of the server will not work, because the server will not **see** the changes in the file.
  Better option is to mount the **directory** where configuration file is located: `-v /config-dir:/opt/grant-server/config-dir` and then pass the `-c` flag to the container like so: `-c config/config.json`.
