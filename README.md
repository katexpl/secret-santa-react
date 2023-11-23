# Secret Santa Game

Welcome to the Secret Santa Game! This web application helps you organize a Secret Santa gift exchange, making the process of assigning Secret Santas fun and easy.

## Table of Contents
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
  - [Game Setup](#game-setup)
  - [Selecting Secret Santas](#selecting-secret-santas)
- [Contributing](#contributing)

## Features

- Randomly assigns Secret Santas to participants.
- Ensures that no participant is their own Secret Santa.
- Allows for past pairings to avoid repeating the same Secret Santa.
- Persists data using a Supabase database.
- Disables further participant selections once a participant has chosen their Secret Santa.

## Getting Started

### Prerequisites

Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/secret-santa-game.git
```

2. Navigate to the project directory:

```bash
cd secret-santa-game
```

3. Install dependencies:

```bash
npm install
```

## Usage

### Game setup

1. Run the application:

```bash
npm start
```

2. Open the application in your web browser.

3. Add participants to the Secret Santa game by entering their names. [TO BE ADDED]

### Selecting Secret Santas

1. Each participant can select their name from the dropdown menu.

2. Once a participant has selected their name, the assigned Secret Santa will be displayed.

3. The participant's selection is saved, and they won't be able to choose again.

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

