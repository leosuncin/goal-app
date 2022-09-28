# 🔬 Example of how-to use RTK Query, Next Redux Wrapper, NextAuth and MongoDB

[![GPL v3 License](https://img.shields.io/badge/License-GPLv3-green.svg)](./LICENSE)

> Use MongoDB to store the data, RTK Query to make requests, Next Redux Wrapper to dispatch action in the server side, NextAuth to authenticate using email and credentials provider

## Acknowledgements

- Based in the project of [Goalsetter MERN app](https://github.com/bradtraversy/mern-tutorial) by [Brad Traversy](https://www.youtube.com/c/TraversyMedia)

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file
<!-- markdown-link-check-disable -->
`NEXTAUTH_URL` example _<http://localhost:3000>_
<!-- markdown-link-check-enable -->
`NEXTAUTH_SECRET` a random long string, create one using in the terminal `openssl rand -base64 32`

`MONGO_URL` a connection string to the MongoDB instance, example _mongodb://localhost/admin_

You can copy the example .env and edit the values

```bash
  cp .env.example .env
```

## Run Locally

Clone the project

```bash
  git clone https://github.com/leosuncin/goal-app.git
```

Go to the project directory

```bash
  cd goal-app
```

Install dependencies

```bash
  pnpm install
```

Start the services using Docker Compose

```bash
  docker-compose up -d
```

Start the server

```bash
  pnpm dev
```

## License

Release under the terms of [GPL v3](./LICENSE)
