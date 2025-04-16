let
  pkgs = import <nixpkgs> {};
in pkgs.mkShell {
  buildInputs = [

    pkgs.nodejs_23
    pkgs.python3
    pkgs.pandoc

  ];

  shellHook = ''
    alias s="npm run localserve"
  '';
}
