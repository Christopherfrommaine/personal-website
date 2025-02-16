let
  pkgs = import <nixpkgs> {};
in pkgs.mkShell {
  buildInputs = [

    pkgs.nodejs_23
    pkgs.rustup

  ];

  shellHook = ''
    npm install -D typescript
    npm install htmx.org
    npm install -D live-server
    npm install -D concurrently  # For hosting and deploying at the same time

    rustup toolchain install stable
    rustup default stable
    RUST_BACKTRACE=1
    RUST_LOG=debug
  '';
}
