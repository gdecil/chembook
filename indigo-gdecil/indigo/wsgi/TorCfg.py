import psycopg2
global con 
con = psycopg2.connect(host='localhost', database='postgres', user='postgres', password='postgres', port=5432)

def getParam(dict, name):
        temp = []
        dictlist = []
        for key, value in dict.iteritems():
            if key == name:
                return value
#             temp = [key,value]
#             dictlist.append(temp)        self.dao = TornadoSelect()

#         print dictlist[0][1]