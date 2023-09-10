{
	description = "Website dev environment";

	inputs = {
		nixpkgs.url = "github:nixos/nixpkgs";
		flake-utils.url = "github:numtide/flake-utils";
		# TODO: asciidoctor-html5s			https://nixos.org/manual/nixpkgs/stable/#sec-language-ruby
	};

	outputs = { nixpkgs, flake-utils, ... }:
		flake-utils.lib.eachDefaultSystem (system:
			let
				pkgs = import nixpkgs { inherit system; };
			in
			{
				devShells.default = pkgs.mkShell {
					packages = with pkgs; [
						hugo
						asciidoctor
					];
					shellHook = ''
						firefox localhost:1313
						hugo serve
					'';
				};
			}
		);
}
