# ClipVault

A lightweight personal cloud clipboard built for one thing: getting frequently used text snippets from any device in seconds.

No accounts. No databases. No unnecessary complexity.

Open the website, find what you need, copy it, close the tab.

## Features

* Fast snippet search
* One-click copy
* Mobile-friendly interface
* Dark mode
* Categories and pinned snippets
* Visual snippet editor
* JSON export workflow
* No backend required
* Deploy anywhere

## How It Works

All snippets are stored in:

```text
public/snippets.json
```

The application loads this file on startup and displays the snippets.

Changes made through the editor are not saved automatically.

Instead:

1. Open edit mode
2. Create, edit, or delete snippets
3. Click **Export JSON**
4. Copy the generated JSON
5. Replace the contents of `public/snippets.json`
6. Deploy

This keeps the project simple while ensuring the same snippets are available on every device.

## Use Cases

* Frequently used prompts
* Links
* Commands
* Business information
* School resources
* Contact details
* Anything you repeatedly copy and paste

## Tech Stack

* React
* TypeScript
* Vite
* Tailwind CSS

## Philosophy

Most clipboard tools are overengineered.

ClipVault is intentionally simple.

The goal is not to manage thousands of notes.

The goal is to type a URL, copy something important in a few seconds, and move on with your day.