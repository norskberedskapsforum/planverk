# planverk

Planverk is an open-source toolkit for creating practical preparedness, communications and operational planning documents.

Join us at our forum: [Norsk Beredskapsforum](https://norskberedskapsforum.no/)
Visit project thread: [Norsk Beredskapsforum project thread](https://norskberedskapsforum.no/topic/463-prosjekt-planverk-nettbasert-verktøy-for-å-lage-dokumenter-til-beredskapsplaner/)

## Table of Contents

1. [Current tools in the project](https://github.com/norskberedskapsforum/planverk#current-tools-in-the-project-is)
2. [Project Goals](https://github.com/norskberedskapsforum/planverk#project-goals)
3. [Tech stack](https://github.com/norskberedskapsforum/planverk#tech-stack)
4. [Local development](https://github.com/norskberedskapsforum/planverk#local-development)
5. [Host it yourself](https://github.com/norskberedskapsforum/planverk#host-it-yourself)


## Current tools in the project is:

- **Communications Plan** (`/tools/comms-plan`)

Designed for:

- volunteer organizations
- preparedness groups
- events
- search and rescue teams
- family preparedness
- small teams needing structured communication plans

Planverk can be self-hosted with Docker or run locally with Node.js.

---

## Project Goals

Planverk aims to provide:

- Simple and useful planning tools
- Printable PDF exports
- Self-hosted friendly deployment
- Open source collaboration
- Privacy-friendly workflows

---

## Tech Stack

- Node.js
- Express
- Vanilla HTML / CSS / JavaScript
- PDFKit

---

## Local Development

You can easily clone the repo to your local machine and contribute with code, fixes etc.

### Requirements

- Node.js 20+
- npm

### Install

```
bash
npm install
```

---

## Host it yourself

### Run with Docker

1. Pull the image:
```
docker pull ghcr.io/norskberedskapsforum/planverk:latest
```

2. Run the container:
```
docker run -d \
  --name planverk \
  -p 3000:3000 \
  -e NODE_ENV=production \
  ghcr.io/norskberedskapsforum/planverk:latest
```

3. Open your browser:
```
http://<your-ip-address>:3000
```


### Run with Docker Compose (recommended)

1. Create `docker-compose.yaml`:
```
services:
  planverk:
    image: ghcr.io/norskberedskapsforum/planverk:latest
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      PORT: 3000
```
2. Start:
```
docker compose up -d
```
