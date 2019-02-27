# Set regular db
echo $DB_TEST_NAME
if [[ -z "${DB_TEST_NAME}" ]] && [[ "${NODE_ENV}"!='production' ]]; then
  #mongo --eval 'conn = new Mongo();db = conn.getDB("admin");'
  echo "uno";
else
  mongo --eval 'conn = new Mongo();db = conn.getDB("admin");db.auth("'${DB_ADMIN_USER}'","'${DB_ADMIN_PASSWORD}'");db_ex = conn.getDB("'${DB_TEST_NAME}'");db_ex.createUser({user: "'${DB_TEST_USER}'",pwd: "'${DB_TEST_PASSWORD}'",roles: [ { role: "dbOwner", db: "'${DB_TEST_NAME}'" }, "dbOwner" ]})'
  mongo --eval 'conn = new Mongo();db = conn.getDB("admin");db.auth("'${DB_ADMIN_USER}'","'${DB_ADMIN_PASSWORD}'");db_ex = conn.getDB("'${DB_NAME}'");db_ex.createUser({user: "'${DB_USER}'",pwd: "'${DB_PASSWORD}'",roles: [ { role: "dbOwner", db: "'${DB_NAME}'" }, "dbOwner" ]})'
  echo "hola";
fi
