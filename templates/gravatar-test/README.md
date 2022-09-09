# Example Subgraph

An example to help you get started with The Graph. For more information see the docs on https://thegraph.com/docs/.

## Testing

Run `yarn` to download the matchstick helper package
Run `brew install postgresql` or `sudo apt install postgresql` for mac / linux respctively
Extra step for mac - need to create a symlink for the new postgresql (may need to create the dir first for the cmd below to work)
`ln -sf /usr/local/opt/postgresql@14/lib/postgresql@14/libpq.5.dylib /usr/local/opt/postgresql/lib/libpq.5.dylib`
Run `yarn test` to run the unit tests
