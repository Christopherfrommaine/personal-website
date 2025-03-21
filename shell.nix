let
  pkgs = import <nixpkgs> {};
in pkgs.mkShell {
  buildInputs = [

    pkgs.nodejs_23
    pkgs.python3

  ];

  shellHook = ''
    npm install -D typescript
    npm install -D live-server
  '';
}
