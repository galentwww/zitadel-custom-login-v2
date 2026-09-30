#!/bin/sh
# Starts an OIDC auth request on the real instance and prints a URL that hands it
# to the local login (the instance-level "Login V2 required" setting overrides
# per-app base URIs, so ZITADEL itself will always redirect to the built-in login).
#
# Usage: scripts/dev-auth-url.sh [client_id] [redirect_uri]
set -e
ISSUER=${ZITADEL_API_URL:-https://accounts.xifanacg.com}
CLIENT_ID=${1:-392691404725354498}                       # Headscale
REDIRECT_URI=${2:-https://hs.galentwww.cn/oidc/callback}
LOCAL=${LOCAL_LOGIN_URL:-http://localhost:3000/ui/v2/login}

enc() { python3 -c 'import sys,urllib.parse;print(urllib.parse.quote(sys.argv[1],safe=""))' "$1"; }

loc=$(curl -s -o /dev/null -w '%{redirect_url}' \
  "$ISSUER/oauth/v2/authorize?client_id=$CLIENT_ID&response_type=code&scope=openid%20profile%20email&redirect_uri=$(enc "$REDIRECT_URI")&state=dev-$(date +%s)")

case "$loc" in
  *authRequest=*) echo "$LOCAL/login?authRequest=${loc##*authRequest=}" ;;
  *) echo "unexpected redirect: $loc" >&2; exit 1 ;;
esac
