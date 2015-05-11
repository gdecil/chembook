import threading, Queue
import datetime
import psycopg2

global db 
db = "postgres"
conn_string = "host='127.0.0.1' dbname='postgres' user='postgres' password='postgres' port=5432"
conn = psycopg2.connect(conn_string)

class ThreadClass(threading.Thread):
    def __init__(self, cur, num,q):
        threading.Thread.__init__(self)
        self.cur = cur
        self.num = num
        self.q = q

    def run(self):
        one=False
        sql = "select 2* " + str(self.num) + " as tot"
        print sql
        self.cur.execute(sql)
        now = datetime.datetime.now()
        print "%s says Hello World at time: %s" % (self.getName(), now)
        r1 =[]
        if db == "postgres":
            r1 = [dict((self.cur.description[i][0], value) for i, value in enumerate(row)) for row in self.cur.fetchall()]
            self.q.put(r1)
        
        else:
            for rows in self.cur: 
                r0={}
                for i, value in enumerate(rows):
                    try:                     
                        if type(value) is cx_Oracle.LOB:
                            r0[self.cur.description[i][0]]=value.read()
                        else:
                            r0[self.cur.description[i][0]]=value
                    except: 
                        print "val " + str(value) 
                r1.append(r0)
            return r1

#th = []
#for i in range(3):
#    cur = conn.cursor()
#    ret=th.append(ThreadClass(cur,i+1))
#    th[i].start()
#    print ret
##main thread waits until all child threads are done
#for t in th:
#    t.join()

for i in range(3):
    q = Queue.Queue()
    cur = conn.cursor()
    t = ThreadClass(cur,i+1,q)
    t.start()
    result = q.get()
    print result