#!/bin/sh
cd "$(dirname "$0")" && { cat src/shell.html; echo '<script>'; cat src/game.js; echo '</script>'; } > index.html
