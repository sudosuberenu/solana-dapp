
# Solana dApp

This dapp has 2 main responsabilities:

1) Lists all outbound (sent by the connected wallet) and inbound (sent to the connected wallet) SOL transactions in the last 24 hours (unix_timestamp, from_address, to_address, SOL amount)

2) Displays the connected wallet's SOL average balance in 1 hour buckets for the last 24 hours

## Images
![](https://raw.githubusercontent.com/sudosuberenu/solana-dapp/main/public/1.png)

![](https://raw.githubusercontent.com/sudosuberenu/solana-dapp/main/public/2.png)


## Installation

```bash
npm install
```

## Build and Run

Next, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


### Structure

The project structure is the next one:
 
```
├── public : publically hosted files
├── src : primary code folders and files 
│   ├── components : house anything considered a resuable UI component
│   ├── contexts` : any context considered reusable and useuful to many components that can be passed down through a component tree
│   ├── models` : any data structure that may be reused throughout the project
│   ├── pages` : the pages that host meta data and the intended `View` for the page
│   ├── stores` : stores used in state management
│   ├── styles` : contain any global and reusable styles
│   ├── views` : contains the actual views of the project that include the main content and components within

style, package, configuration, and other project files

```


## Deployed on Vercel

[https://solana-dapp.vercel.app/](https://solana-dapp.vercel.app/)


## Pending staff
    1. Add UT and E2E testing
    2. Apply skeleton loader
    3. Improve responsiness