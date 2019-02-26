# Set regular db
echo $DB_TEST_NAME
if [[ -z "${DB_TEST_NAME}" ]] && [[ "${NODE_ENV}"!='production' ]]; then
  echo "Configure only production DB"
else
  echo "Configure both dbs"
fi
