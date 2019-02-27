# Set regular db
echo $DB_TEST_NAME
if [[ -z "${DB_TEST_NAME}" ]] && [[ "${NODE_ENV}"!='production' ]]; then
  mongo --eval 'conn = new Mongo();db = conn.getDB("admin");'
else
  mongo --eval 'conn = new Mongo();db = conn.getDB("admin");db.auth("user","password");db_ex = conn.getDB("expenses-tracker-local-test");db_ex.createUser({user: "extracker",pwd: "password",roles: [ { role: "dbOwner", db: "expenses-tracker-local-test" }, "dbOwner" ]})'
fi
