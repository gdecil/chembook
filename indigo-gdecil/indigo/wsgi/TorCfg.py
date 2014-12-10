import psycopg2
global con 
conn_string = "host='127.0.0.1' dbname='postgres' user='postgres' password='postgres' port=5433"
conn = psycopg2.connect(conn_string)

def query_db(query, args=(), one=False):
    cur = conn.cursor()
    cur.execute(query, args)
    r = [dict((cur.description[i][0], value) \
               for i, value in enumerate(row)) for row in cur.fetchall()]
#     cur.connection.close()
    return (r[0] if r else None) if one else r