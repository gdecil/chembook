import platform
import psycopg2
import os


_platform = platform.platform()

if _platform == "Linux-3.13.0-36-generic-i686-with-Ubuntu-14.04-trusty":
#            conn_string = "host='localhost' dbname='indigo' user='admin8fqsmyu' password='postgres'"
    conn_string = "host='127.0.0.1' dbname='postgres' user='postgres' password='postgres'"
    conn = psycopg2.connect(conn_string)
elif _platform == "Linux-3.13.0-37-generic-i686-with-Ubuntu-14.04-trusty":
    conn_string = "host='127.0.0.1' dbname='postgres' user='postgres' password='postgres'"
    conn = psycopg2.connect(conn_string)
else:
    conn = psycopg2.connect(database=os.environ['OPENSHIFT_APP_NAME'],
        user=os.environ['OPENSHIFT_POSTGRESQL_DB_USERNAME'],
        password=os.environ['OPENSHIFT_POSTGRESQL_DB_PASSWORD'],
        host=os.environ['OPENSHIFT_POSTGRESQL_DB_HOST'],
        port=os.environ['OPENSHIFT_POSTGRESQL_DB_PORT'] )

def query_db(query, args=(), one=False):
    cur = conn.cursor()
    cur.execute(query, args)
    r = [dict((cur.description[i][0], value) \
               for i, value in enumerate(row)) for row in cur.fetchall()]
#     cur.connection.close()
    return (r[0] if r else None) if one else r