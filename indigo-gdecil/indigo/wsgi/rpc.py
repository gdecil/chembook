import zerorpc
from indigo import *
from indigo_renderer import *
from tempfile import *
from shutil import copyfileobj
import uuid
from serial.rfc2217 import ECHO

class HelloRPC(object):
    def hello(self, name):
        print self
        return "Hello, %s" % name

    def renderInd(self, smile, typeInd):
        indigo = Indigo()
        if typeInd == "rea":
            mol1 = indigo.loadReaction(smile)
        else:
            mol1 = indigo.loadMolecule(smile)
    
        renderer = IndigoRenderer(indigo);
        indigo.setOption("render-output-format", "png");
        indigo.setOption("render-margins", 10, 10);
        if _platform == "Linux-3.13.0-36-generic-i686-with-Ubuntu-14.04-trusty":
            datadir = ""        
        elif _platform == "Linux-3.13.0-39-generic-i686-with-Ubuntu-14.04-trusty":
            datadir = ""        
        else:
            datadir = os.environ['OPENSHIFT_DATA_DIR']
            
        unique_filename= str(uuid.uuid4()) + ".png"
    
        renderer.renderToFile(mol1, datadir + unique_filename);
            
        tempFileObj = NamedTemporaryFile(mode='w+b',suffix='png')
        pilImage = open(datadir + unique_filename,'rb')
        copyfileobj(pilImage,tempFileObj)
        pilImage.close()
        remove(datadir + unique_filename)
        tempFileObj.seek(0,0)
        response = send_file(tempFileObj)
        return response

s = zerorpc.Server(HelloRPC())
s.bind("tcp://0.0.0.0:4242")
s.run()

