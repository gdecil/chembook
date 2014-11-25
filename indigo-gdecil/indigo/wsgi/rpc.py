import zerorpc
from indigo import *
from indigo_renderer import *
from tempfile import *
from shutil import copyfileobj
import uuid
import base64

from serial.rfc2217 import ECHO
from __builtin__ import str

class HelloRPC(object):
    def renderInd(self, smile):
        
        typeInd =""
        indigo = Indigo()
        if typeInd == "rea":
            mol1 = indigo.loadReaction(smile)
        else:
#             print smile
            mol1 = indigo.loadMolecule(smile)
#             print mol1
        
        renderer = IndigoRenderer(indigo);
#         print renderer
        indigo.setOption("render-output-format", "png");
        indigo.setOption("render-margins", 10, 10);

        datadir = ""
            
        unique_filename= str(uuid.uuid4()) + ".png"
    
        renderer.renderToFile(mol1, datadir + unique_filename);
        
        with open(datadir + unique_filename, 'rb') as imageFile:
            str1 = base64.b64encode(imageFile.read())
#             print str1
            
        return str1
    
    def hello(self, name):
        print self
        return "Hello, %s" % name

s = zerorpc.Server(HelloRPC())
s.bind("tcp://0.0.0.0:4242")
s.run()

