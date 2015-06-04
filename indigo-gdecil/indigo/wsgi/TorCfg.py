import psycopg2
import cx_Oracle
import threading, Queue
global conn
global db
db = "postgres"
db = "ora"
if db == "ora":
    print "sono Oracle"
    connstr='mar/nervi@10.206.81.35:2483/nmsdd'
    print connstr
    #/etc/tnsnames.ora
    connstr='CEN_DEV_OWNER/CEN_DEV_OWNER@chembook'
    connstr='mar/nervi@nmsdd'
    conn = cx_Oracle.connect(connstr)
else:
    print "sono postgres"
    conn_string = "host='127.0.0.1' dbname='postgres' user='postgres' password='postgres' port=5432"
    conn = psycopg2.connect(conn_string)

        
class AsyncQuery(threading.Thread):
    def __init__(self, cur, sql, q):
        threading.Thread.__init__(self)
        self.cur = cur
        self.sql = sql
        self.q = q

    def run(self):
        print "SQL: " + self.sql
        self.cur.execute(self.sql)
        r1 =[]

        if db == "postgres":
            r1 = [dict((self.cur.description[i][0], value) for i, value in enumerate(row)) for row in self.cur.fetchall()]
            self.q.put(r1)
        
        else:
            for rows in self.cur: 
                r0={}
#                 print "%s " % (self.getName())
                for i, value in enumerate(rows):
                    try:                     
                        if type(value) is cx_Oracle.LOB:
                            r0[self.cur.description[i][0]]=value.read()
                        else:
                            r0[self.cur.description[i][0]]=value
                    except: 
                        print "val " + str(value) 
                r1.append(r0)
            self.q.put(r1)
        self.cur.close()

    
def query_db(query):
#     print "start query_db"
    try:
        if db=="ora":
            conn = cx_Oracle.connect(connstr)
        else:
            conn = psycopg2.connect(conn_string)
    
        q = Queue.Queue()
        cur = conn.cursor()
        t = AsyncQuery(cur,query,q)
        t.start()
        result = q.get()
        if db=="ora":
            conn.close()
        return result
    except:
        conn.rollback()
        raise   

def committ_db():
    conn.committ()
    
    
def query_dbOld(query, args=(), one=False):
    try:
        #conn = cx_Oracle.connect(connstr)
        conn = psycopg2.connect(conn_string)

        cur = conn.cursor()
#         print query
#         print args
        cur.execute(query, args)
        r1 =[]
        
        for rows in cur: 
            r0={}
            for i, value in enumerate(rows):
                try:                     
                    if type(value) is cx_Oracle.LOB:
                        r0[cur.description[i][0]]=value.read()
                    else:
                        r0[cur.description[i][0]]=value
#                    print col.read() 
                except: 
                    print value 
            r1.append(r0)
            
#        for row in cur.fetchall():
#            r0={}
#            for i, value in enumerate(row):
#                if type(value) = "<type 'cx_Oracle.LOB'>":
#                    
#                print type(value)
#                r0[cur.description[i][0]]=value
#            r1.append(r0)
#                
#        r = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
        
#         print r1
#        print r
        
    #     cur.connection.close()
        return (r1[0] if r1 else None) if one else r1    
    except:
        conn.rollback()
        raise   
