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
    npm install -D concurrently
  '';
}
