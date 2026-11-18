#!/bin/sh
# Construye index.html (un solo archivo, sin dependencias) a partir de src/.
# El orden de los módulos está en src/order.txt: base y motor primero, juegos después, interfaz al final.
set -e
cd "$(dirname "$0")"
{
  echo "(()=>{"
  echo "'use strict';"
  while read -r f; do [ -n "$f" ] && cat "src/$f"; done < src/order.txt
  echo "})();"
} > .bundle.js
# comprobación de sintaxis si hay Node disponible
if command -v node >/dev/null 2>&1; then node --check .bundle.js; fi
{ cat src/shell.html; echo '<script>'; cat .bundle.js; echo '</script>'; } > index.html
rm -f .bundle.js
