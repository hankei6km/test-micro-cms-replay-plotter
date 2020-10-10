#!/bin/sh

LICENSES_TXT="public/opensource_licenses.txt"

cat LICENSE > "${LICENSES_TXT}"
echo "" >> "${LICENSES_TXT}"
echo "" >> "${LICENSES_TXT}"
echo "---" >> "${LICENSES_TXT}"
echo "" >> "${LICENSES_TXT}"
cat LICENSE_next_learn_starter >> "${LICENSES_TXT}"
echo "" >> "${LICENSES_TXT}"
echo "" >> "${LICENSES_TXT}"
echo "---" >> "${LICENSES_TXT}"
echo "" >> "${LICENSES_TXT}"
NODE_ENV=production yarn --silent licenses generate-disclaimer >> "${LICENSES_TXT}"