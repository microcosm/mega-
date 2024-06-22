mega—
=====
_Pronounce: "mega-dash"_

Personal implementation of [gsheet-](https://github.com/microcosm/gsheet-).

To set up:
- If you don't have it, install node/npm `brew install node`
- If you don't have it, install grunt-cli `npm install -g grunt-cli`
- `git clone --recurse-submodules git@github.com:microcosm/mega-.git`

To use:
- `cd mega-`
- (edit `mega.gs`)
- `grunt` to generate `built.gs`

To keep the submodule synced:
- `cd gsheet-`
- `git checkout master`
- `git pull origin master`
