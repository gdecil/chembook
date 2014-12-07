import string
import random

def id_generator(size=6, chars=string.ascii_uppercase + string.digits):
    return ''.join(random.choice(chars) for _ in range(size))

def getParam(dict, name):
        temp = []
        dictlist = []
        for key, value in dict.iteritems():
            if key == name:
                return value
#             temp = [key,value]
#             dictlist.append(temp)        self.dao = TornadoSelect()

#         print dictlist[0][1]