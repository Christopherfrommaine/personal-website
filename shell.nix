let
  pkgs = import <nixpkgs> {};
in pkgs.mkShell {
  buildInputs = [

    pkgs.nodejs_23
    pkgs.python3
    pkgs.pandoc

  ];

  shellHook = ''
    npm install -D typescript
    npm install -D live-server

    alias serve="npm run localserve"
    alias s="npm run localserve"
  '';
}
