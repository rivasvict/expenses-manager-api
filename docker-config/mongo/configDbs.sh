# Set regular db
echo $DB_TEST_NAME

DB_ADMIN_CONNECTION='conn = new Mongo();db = conn.getDB("admin");db.auth("'${DB_ADMIN_USER}'","'${DB_ADMIN_PASSWORD}'");';
CONFIG_DB_REGULAR_USER='db_ex = conn.getDB("'${DB_NAME}'");db_ex.createUser({user: "'${DB_USER}'",pwd: "'${DB_PASSWORD}'",roles: [ { role: "dbOwner", db: "'${DB_NAME}'" }, "dbOwner" ]})';
CONFIG_DB_TEST_USER='db_ex_test = conn.getDB("'${DB_TEST_NAME}'");db_ex_test.createUser({user: "'${DB_TEST_USER}'",pwd: "'${DB_TEST_PASSWORD}'",roles: [ { role: "dbOwner", db: "'${DB_TEST_NAME}'" }, "dbOwner" ]})';
CREATE_USER_DB="$DB_ADMIN_CONNECTION$CONFIG_DB_REGULAR_USER";
CREATE_USER_TEST_DB="$DB_ADMIN_CONNECTION$CONFIG_DB_TEST_USER";

if [[ -z "${DB_TEST_NAME}" ]] && [[ "${NODE_ENV}"!='production' ]]; then
  mongo --eval "${CREATE_USER_DB}"
else
  mongo --eval "${CREATE_USER_DB}";
  mongo --eval "${CREATE_USER_TEST_DB}"
fi
