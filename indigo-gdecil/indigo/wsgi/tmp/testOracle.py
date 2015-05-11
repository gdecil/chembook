import cx_Oracle
connstr='mar/nervi@10.206.81.22:2483/nmsdd'
connstr='mar/nervi@nmsdd'
connstr='CEN_DEV_OWNER/CEN_DEV_OWNER@chembook'

conn = cx_Oracle.connect(connstr)
curs = conn.cursor()

curs.execute('select * from cen_users')
print curs.description
for row in curs:
    print row
conn.close()
