# dex223-auto-listing

### Setup project

```bash
git clone https://github.com/EthereumCommonwealth/dex223-auto-listing-subgraph
```

```bash
cd dex223-auto-listing && touch .env
```

Add values to `.env` file

```bash
NETWORK=<network name>
SUBGRAPH_KEY=<add subgraph secret key from TheGraph studio>
```

Add file with in `./config/<network name>.js` watch for example in directory

```bash
yarn template
yarn compile
export $(xargs < .env) && graph deploy --studio dex223-auto-listing-$NETWORK
```

```bash
graph test -d
```
