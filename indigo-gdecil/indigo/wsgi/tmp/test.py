import zerorpc
from indigo import *
from indigo_renderer import *
from tempfile import *
from shutil import copyfileobj
import uuid
from serial.rfc2217 import ECHO
import base64

def renderInd(self, smile):
    
    typeInd =""
    indigo = Indigo()
    if typeInd == "rea":
        mol1 = indigo.loadReaction(smile)
    else:
        print smile
        mol1 = indigo.loadMolecule(smile)
        print mol1
    
    renderer = IndigoRenderer(indigo);
    print renderer
    indigo.setOption("render-output-format", "png");
    indigo.setOption("render-margins", 10, 10);

    datadir = ""
        
    unique_filename= str(uuid.uuid4()) + ".png"

    renderer.renderToFile(mol1, datadir + unique_filename);

    with open(datadir + unique_filename, 'rb') as imageFile:
        str1 = base64.b64encode(imageFile.read())
        print str1

    print datadir + unique_filename
    print "uno"
        
    tempFileObj = NamedTemporaryFile(mode='w+b',suffix='png')
    pilImage = open(datadir + unique_filename,'rb')
    copyfileobj(pilImage,tempFileObj)
    pilImage.close()
    print "due"
#         remove(datadir + unique_filename)
    tempFileObj.seek(0,0)
    response = send_file(tempFileObj)
    print unique_filename
    return response

def hello(self, name):
    print self
    return "Hello, %s" % name

renderInd('ugo','cccccc')
