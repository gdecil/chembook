#!/usr/bin/env python
 
import tornado.web
import tornado.gen
from tornado import gen
import time
from functools import partial
import os
from concurrent.futures import ThreadPoolExecutor
from flask import json, request

# from tornado_cors import CorsMixin
from TorSel import TornadoSelect
from TorIns import TornadoInsert
from TorSel import ChemLinkD

import TorCfg
import utility
# from utility  import *

import momoko
import psycopg2 
 
def long_blocking_function(index, sleep_time):
    print "Entering run counter:%s" % (index,)
    time.sleep(sleep_time)
    print "Exiting run counter:%s" % (index,)
    return ('Keyyyyy' + index)
 
def test(name):
    return ('test' + name)

def getList():
    dsn = 'dbname=postgres user=postgres password=postgres ' \
          'host=127.0.0.1 port=5433'
    db = momoko.Pool(dsn=dsn, size=5)
    
    sql = """
        SELECT id, username, email, password
        FROM users_user
    """
    cursor = momoko.Op(db.execute, sql)
    print 'pippo'
    long_blocking_function('10', 5)
    
    desc = cursor.description
    result = [dict(zip([col[0] for col in desc], row))
                     for row in cursor.fetchall()]

    cursor.close()    
    return result


class TestHandler(tornado.web.RequestHandler): 
    def initialize(self, executor):
        self.executor = executor 
    @tornado.gen.coroutine
    def get(self): 
        future_result = yield self.executor.submit(test,
                                              name='current_counter') 
        self.write(future_result)
    @tornado.gen.coroutine
    def post(self):
        dsn = 'dbname=postgres user=postgres password=postgres ' \
              'host=127.0.0.1 port=5433'
        self.db = momoko.Pool(dsn=dsn, size=5)
        
        dao = UserDAO(self.db)
        cursor = yield self.executor.submit(dao.create)         
        
        print cursor
        if not cursor.closed:
            self.write('closing cursor')
            cursor.close()
        self.finish()
        self.dao = TornadoSelect()

class TestArg(tornado.web.RequestHandler):    
    def post(self):
        dict = tornado.escape.json_decode(self.request.body)
        print dict
        print self.request.body
        par=self.get_arguments("smile")
        temp = []
        dictlist = []
        for key, value in dict.iteritems():
            temp = [key,value]
            dictlist.append(temp)
        print temp[0]
        print temp[1]
        print dictlist[0][1]
        print par
                    
class DbHandler(tornado.web.RequestHandler): 
    def initialize(self, executor):
        self.executor = executor 
    @gen.coroutine
    def get(self): 
        dsn = 'dbname=postgres user=postgres password=postgres ' \
              'host=127.0.0.1 port=5433'
        self.db = momoko.Pool(dsn=dsn, size=5)
        
#         dao = UserDAO(self.db)

        sql = """
            SELECT id, username, email, password
            FROM users_user
        """
        cursor = yield momoko.Op(self.db.execute, sql)
#         cursor = yield self.executor.submit( momoko.Op,
#                                              self.db.execute,
#                                              Task = sql
#                                             )                 
        desc = cursor.description
        result = [dict(zip([col[0] for col in desc], row))
                         for row in cursor.fetchall()]

        cursor.close()
        
#         cursor = yield self.executor.submit(dao.get_list)                 
        print result
        
        
        self.finish()
    @tornado.gen.coroutine
    def post(self):
        dsn = 'dbname=postgres user=postgres password=postgres ' \
              'host=127.0.0.1 port=5433'
        self.db = momoko.Pool(dsn=dsn, size=5)
        
        dao = UserDAO(self.db)
        cursor = yield self.executor.submit(dao.create)         
        
        print cursor
        if not cursor.closed:
            self.write('closing cursor')
            cursor.close()
        self.finish()

class DbHandler1(tornado.web.RequestHandler): 
    def initialize(self, executor):
        self.executor = executor 
        self.dao = TornadoSelect()

    @gen.coroutine
    def get(self): 
        future_result = yield self.executor.submit( self.dao.getListpg )                 
        print future_result
        self.finish()
        
class Chemlink(tornado.web.RequestHandler): 
    SUPPORTED_METHODS = ("GET", "HEAD", "POST", "DELETE", "PATCH", "PUT", "OPTIONS")
    def set_default_headers(self):
        self.set_header("Access-Control-Allow-Origin", "*")
        self.set_header("Access-Control-Allow-Credentials", "true")
        self.set_header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS")
        self.set_header("Access-Control-Allow-Headers",
            "Content-Type, Depth, User-Agent, X-File-Size, X-Requested-With, X-Requested-By, If-Modified-Since, X-File-Name, Cache-Control")
    
    def initialize(self, executor):
        self.executor = executor 
        self.dao = ChemLinkD()

    @gen.coroutine
    def get(self): 
        quest=self.get_arguments("quest")
        print quest
        if quest[0] == "getAllData" :
            a1=self.get_arguments("batch")
            print a1
            future_result = yield self.executor.submit( self.dao.get_batch_all, 
                                                    batch = a1[0]
                                                    )                 
            self.write(future_result) 
        elif quest[0] == "getStrid" :
            a1=self.get_arguments("batch")
            print a1
            future_result = yield self.executor.submit( self.dao.get_stridFromBatch, 
                                                    batch = a1[0]
                                                    )                 
            self.write(future_result) 

        self.finish()

        
class Render(tornado.web.RequestHandler): 
    SUPPORTED_METHODS = ("GET", "HEAD", "POST", "DELETE", "PATCH", "PUT", "OPTIONS")
    def set_default_headers(self):
        self.set_header("Access-Control-Allow-Origin", "*")
        self.set_header("Access-Control-Allow-Credentials", "true")
        self.set_header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS")
        self.set_header("Access-Control-Allow-Headers",
            "Content-Type, Depth, User-Agent, X-File-Size, X-Requested-With, X-Requested-By, If-Modified-Since, X-File-Name, Cache-Control")
    
    def initialize(self, executor):
        self.executor = executor 
        self.dao = TornadoSelect()
        self.daoC = ChemLinkD()
        
    @gen.coroutine
    def get(self): 
        print 'sono qua render'
        smile=self.get_arguments("smile")
        idReaction=self.get_arguments("idReaction")
        strid=self.get_arguments("strid")
#         ugo=self.get_arguments("ugo")
#         ugo=self.get_query_arguments("ugo")
#         print smile[0]
#         print ugo
        if smile : 
            
            future_result = yield self.executor.submit( self.dao.renderInd, 
                                                        smile = smile[0], 
                                                        typeInd ="mol"
                                                        )                 
        elif idReaction :
            future_result = yield self.executor.submit( self.dao.get_reactionImage, 
                                                        idReaction = idReaction[0] 
                                                        )
        elif strid :
            print strid
            future_result = yield self.executor.submit( self.daoC.get_moleculeImage, 
                                                        strId = strid[0] 
                                                        )
        else:
            return
#            self.write("ciao pippo")
#            self.set_header("Content-type", "text/xml") 
#            self.finish()
#            return
            
#         print future_result
        self.write(future_result.decode('base64'))
        self.set_header("Content-type", "image/png") 
        self.finish()

class Convert(tornado.web.RequestHandler): 
    SUPPORTED_METHODS = ("GET", "HEAD", "POST", "DELETE", "PATCH", "PUT", "OPTIONS")
    def set_default_headers(self):
        self.set_header("Access-Control-Allow-Origin", "*")
        self.set_header("Access-Control-Allow-Credentials", "true")
        self.set_header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS")
        self.set_header("Access-Control-Allow-Headers",
            "Content-Type, Depth, User-Agent, X-File-Size, X-Requested-With, X-Requested-By, If-Modified-Since, X-File-Name, Cache-Control")
    
    def initialize(self, executor):
        self.executor = executor 
        self.dao = TornadoSelect()

    @gen.coroutine
    def get(self, param1): 
        if len(self.request.body) > 0:
            a0 = self.request.body
            a00= a0.replace('\n','\\n')
            a1= tornado.escape.json_decode(a00)
            if param1 =='molToSmile':
                future_result = yield self.executor.submit( self.dao.convertMolToSmile, 
                                                        mol0 = a1,
                                                        typeInd ="mol"
                                                        )                 
            elif param1 =='molToInchi':
                future_result = yield self.executor.submit( self.dao.convertMolToInchi, 
                                                        mol0 = a1,
                                                        typeInd ="mol"
                                                        )                 
            self.write(future_result) 

        self.finish()
    def options(self, *args, **kwargs):
        self.finish()
    post = get    

class Mirror(tornado.web.RequestHandler): 
    SUPPORTED_METHODS = ("GET", "HEAD", "POST", "DELETE", "PATCH", "PUT", "OPTIONS")
    def set_default_headers(self):
        self.set_header("Access-Control-Allow-Origin", "*")
        self.set_header("Access-Control-Allow-Credentials", "true")
        self.set_header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS")
        self.set_header("Access-Control-Allow-Headers",
            "Content-Type, Depth, User-Agent, X-File-Size, X-Requested-With, X-Requested-By, If-Modified-Since, X-File-Name, Cache-Control")
    
    def initialize(self, executor):
        self.executor = executor 
        self.dao = TornadoSelect()

    @gen.coroutine
    def get(self): 
        print 'sono qua mirror'
        quest=self.get_arguments("quest")
        print quest
        if quest[0] == "getToxnet" :
            a1=self.get_arguments("cas")
            print a1
            future_result = yield self.executor.submit( self.dao.get_toxnet, 
                                                    cas = a1[0]
                                                    )         
                    
        self.write(future_result) 

        self.finish()
    def options(self, *args, **kwargs):
        self.finish()
    post = get    
    
class Reaction(tornado.web.RequestHandler): 
#     SUPPORTED_METHODS = tornado.web.RequestHandler.SUPPORTED_METHODS + ('OPTIONS',)
#     SUPPORTED_METHODS = ("CONNECT", "GET", "HEAD", "POST", "DELETE", "PATCH", "PUT", "OPTIONS")
    SUPPORTED_METHODS = ("GET", "HEAD", "POST", "DELETE", "PATCH", "PUT", "OPTIONS")
#     CORS_ORIGIN = '*'
    def set_default_headers(self):
        self.set_header("Access-Control-Allow-Origin", "*")
        self.set_header("Access-Control-Allow-Credentials", "true")
        self.set_header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS")
        self.set_header("Access-Control-Allow-Headers",
            "Content-Type, Depth, User-Agent, X-File-Size, X-Requested-With, X-Requested-By, If-Modified-Since, X-File-Name, Cache-Control")
                
    def initialize(self, executor):
        self.executor = executor 
        self.dao = TornadoSelect()
        self.daoI = TornadoInsert()

    @gen.coroutine
    def get(self, param1): 
#         smile=self.get_arguments("smile")
#         print smile[0]
#         print self.request.body
#         print len(self.request.body)
#         print tornado.escape.json_decode(self.request.body)
        print self.request.body
        print type(self.request.body);
        print self.request.body[0];
        
        if len(self.request.body) > 0:
            if param1 =='UpdateDetail' or param1 =='UpdateStoic':
                a1= tornado.escape.json_decode(self.request.body)
            elif param1 == 'FromReactionToMolecules' or param1 == 'UpdateSchema':
                a0 = self.request.body
                a00= a0.replace('\n','\\n')
                a1= tornado.escape.json_decode(a00)
            elif param1 == 'UpdateProcedura':
                a0 = self.request.body
                a00= a0.replace('\n','\\n')
                a1= tornado.escape.json_decode(a00)
            elif param1 == 'GetProductsIndigo' or param1 == 'GetReagentsIndigo' or param1 == 'MatchBingoReaction':
                a0 = self.request.body
                a00= a0.replace('\n','\\n')
                a1= tornado.escape.json_decode(a00)
            elif param1 == 'SearchUsers':
                dict = json.loads(self.request.body)
                a1= tornado.escape.json_decode(self.request.body)
            else:
                if self.request.body[0] == '"':
                    a1= tornado.escape.json_decode(self.request.body)                
                    dict = json.loads(a1)
                else:
                    a1 = json.loads(self.request.body)
                    dict= tornado.escape.json_decode(self.request.body)
                    
        if param1 == 'GetUsersFullname':
            future_result = yield self.executor.submit( self.dao.get_fullname )    
            self.write(future_result) 
        elif param1 == 'GetUsersFullnameAng':
            future_result = yield self.executor.submit( self.dao.get_fullnameAng )    
            self.write(future_result) 
        elif param1 == 'GetExperimentTreeView':
            par1 = utility.getParam(dict, 'notebook')
            par2 = utility.getParam(dict, 'page')
            par3 = utility.getParam(dict, 'enumVal')
            future_result = yield self.executor.submit( self.dao.get_experimentTreeview,
                                                         notebook = par1, 
                                                         page =par2, 
                                                         enumVal = par3)    
            self.write(future_result) 
        elif param1 == "SearchUsers":  
            par1 = utility.getParam(dict, 'name')
            par2 = utility.getParam(dict, 'id')
            if par2 is None and len(par1) > 0:
                future_result = yield self.executor.submit( self.dao.get_userByName,
                                                        name = par1 )    
                self.write(future_result) 
            elif par1 is None and len(par2) > 0:
                future_result = yield self.executor.submit( self.dao.get_userById,
                                      id = par2 )    
                self.write(future_result) 
                
        elif param1 == 'CheckReactionsEnumerated':
            par1 = utility.getParam(dict, 'notebook')
            par2 = utility.getParam(dict, 'page')
            future_result = yield self.executor.submit( self.dao.get_checkReaEnum,
                                                         notebook = par1, 
                                                         page =par2)    
            self.write(str(future_result)) 
        elif param1 == 'GetExperiment':
            par1 = utility.getParam(dict, 'notebook')
            par2 = utility.getParam(dict, 'page')
            par3 = utility.getParam(dict, 'enumVal')
            future_result = yield self.executor.submit( self.dao.get_experiment,
                                                         notebook = par1, 
                                                         page =par2, 
                                                         enumVal = par3)    
            self.write(future_result) 
        elif param1 == "GetPagesNotebook":  
            par1 = utility.getParam(dict, 'notebook')
            future_result = yield self.executor.submit( self.dao.get_pagesnotebooks,
                                                        notebook = par1 )    
            self.write(future_result) 
        elif param1 == 'getProjects':
            future_result = yield self.executor.submit( self.dao.get_projects )    
            self.write(future_result) 
        elif param1 == "GetUserNotebooks":  
            par1 = utility.getParam(dict, 'userFullname')
            par2 = utility.getParam(dict, 'id')
            if par2 is None and len(par1) > 0:
                future_result = yield self.executor.submit( self.dao.get_usernotebooks,
                                                        userFullname = par1 )    
                self.write(future_result) 
            elif par1 is None and len(par2) > 0:
                future_result = yield self.executor.submit( self.dao.get_usernotebooksbyId,
                                      id = par2 )    
                self.write(future_result) 
        elif param1 == 'GetProducts':
            par1 = utility.getParam(dict, 'notebook')
            par2 = utility.getParam(dict, 'page')
            par3 = utility.getParam(dict, 'enumVal')
            future_result = yield self.executor.submit( self.dao.get_products,
                                                         notebook = par1, 
                                                         page =par2, 
                                                         enumVal = par3)    
            self.write(future_result)             
        elif param1 == 'FromReactionToMolecules':
            future_result = yield self.executor.submit( self.dao.FromReactionToMolecules, 
                                                        rxn = a1['rxn']
                                                        )                 
            self.write(future_result) 
        elif param1 == 'GetReagentsIndigo':
            future_result = yield self.executor.submit( self.dao.GetReagentsIndigo, 
                                                        rxn = a1['rxn']
                                                        )
            self.set_header("Content-type", "application/json")
            self.write(future_result) 
        elif param1 == 'GetProductsIndigo':
            future_result = yield self.executor.submit( self.dao.GetProductsIndigo, 
                                                        rxn = a1['rxn']
                                                        )                 
#             print future_result
            self.write(future_result) 
        elif param1 == 'MatchBingoReaction':
            future_result = yield self.executor.submit( self.dao.match_reaction, 
                                                        rxn = a1
                                                        )                 
            self.write(future_result) 
        elif param1 == 'GetReagents':
            par1 = utility.getParam(dict, 'notebook')
            par2 = utility.getParam(dict, 'page')
            par3 = utility.getParam(dict, 'enumVal')
            future_result = yield self.executor.submit( self.dao.get_reagents,
                                                         notebook = par1, 
                                                         page =par2, 
                                                         enumVal = par3)    
            self.write(future_result) 
        elif param1 == "GetReaction":  
            par1 = utility.getParam(dict, 'reactionId')
#             print par1
            future_result = yield self.executor.submit( self.dao.get_reaction,
                                                        idReaction = par1 )
            self.write(future_result) 
        elif param1 == "InsertDetail":  
            future_result = yield self.executor.submit( self.daoI.insert_detail ,
                                                        request = dict )    
            self.write(future_result) 
        elif param1 == "UpdateStoic":  
            future_result = yield self.executor.submit( self.daoI.update_stoic ,
                                                        notebook = a1['notebook'],
                                                        page = a1['page'],
                                                        Reagents = a1['Reagents'], 
                                                        Products = a1['Products'], 
                                                        username =a1['username']
                                                         )    
            self.write(future_result) 
        elif param1 == "UpdateDetail":  
            future_result = yield self.executor.submit( self.daoI.insert_detail ,
                                                        request = a1 )    
            self.write(future_result) 
        elif param1 == 'UpdateSchema':
            future_result = yield self.executor.submit( self.daoI.update_schema, 
                                                        rxn = a1['rxn'],
                                                        notebook = a1['notebook'],
                                                        page = a1['page'],
                                                        enumVal = a1['enumVal']
                                                        )                 
            self.write(future_result) 
        elif param1 == 'UpdateProcedura':
            future_result = yield self.executor.submit( self.daoI.update_procedura, 
                                                        notebook = a1['notebook'],
                                                        page = a1['page'],
                                                        procedura = a1['procedura']
                                                        )                 
            self.write(future_result) 
        else:
            print param1
            print "error MANCA LA FUNZIONE IN REACTION class"
            return
        self.finish()
        
    def options(self, *args, **kwargs):
#         print "SUPPORTED_METHODS"
#         tornado.web.RequestHandler.options(self, *args, **kwargs)
        self.finish()

#     def post(self, *args, **kwargs):
#         if param1 == 'GetUsersFullname':
#             future_result = yield self.executor.submit( self.dao.get_fullname )    
#             self.write(future_result) 
#         elif param1 == 'getProjects':
#             future_result = yield self.executor.submit( self.dao.get_projects )    
#             self.write(future_result) 
#         elif param1 == "GetUserNotebooks":
#             par0 = self.get_argument("cns")
#             par1 = self.get_argument("userFullname")
# #             par1=self.get_arguments("userFullname")
#             print par1
#             future_result = yield self.executor.submit( self.dao.get_usernotebooks,
#                                                         userFullname = par1 )    
#             self.write(future_result) 
#         else:
#             print "error post"
#             self.write_error(500) 
#         self.finish()
    post = get    

class BarHandler(tornado.web.RequestHandler):
 
    counter = 0
 
    def initialize(self, executor):
        self.executor = executor
 
    @tornado.gen.coroutine
    def get(self):
 
        global counter
        BarHandler.counter += 1
        current_counter = str(BarHandler.counter)
        print ("ABOUT to spawn thread for counter:%s" % (current_counter,))
 
        # Submit a task to run using the ThreadPoolExecutor. At this point we
        # give control back to Tornado, and it won't come back to us until the
        # task has finished or failed. Either way, it doesn't block because
        # we've handed control back. That's what the yield is doing.
        future_result = yield self.executor.submit(long_blocking_function,
                                              index=current_counter,
                                              sleep_time=5)
 
        # If we get here, then the long running function has either finished
        # or failed.
        print ("DONE executing thread for long function")
        self.write(future_result)
 
 
class Application(tornado.web.Application):
    def __init__(self):
        # Create the ThreadPoolExecutor here - we only want one of them.
        handlers = [(r"/bar", BarHandler, dict(executor=ThreadPoolExecutor(max_workers=10))),
                    (r"/test", TestHandler, dict(executor=ThreadPoolExecutor(max_workers=10))),
                    (r"/db", DbHandler, dict(executor=ThreadPoolExecutor(max_workers=10))),
                    (r"/db1", DbHandler1, dict(executor=ThreadPoolExecutor(max_workers=10))),
                    (r"/render", Render, dict(executor=ThreadPoolExecutor(max_workers=10))),
                    (r"/testarg", TestArg),
                    (r"/GetReaction.ashx", Render, dict(executor=ThreadPoolExecutor(max_workers=10))),
                    (r"/Reaction.asmx/([A-Za-z]+)", Reaction, dict(executor=ThreadPoolExecutor(max_workers=10))),
                    (r"/Convert/([A-Za-z]+)", Convert, dict(executor=ThreadPoolExecutor(max_workers=10))),
                    (r"/Mirror", Mirror, dict(executor=ThreadPoolExecutor(max_workers=10))),
                    (r"/Chemlink", Chemlink, dict(executor=ThreadPoolExecutor(max_workers=10))),
                    ]
 
#  ?P<param1>[^\/] (^[A-Za-z]+$)
        settings = dict(
            debug=True,
            static_path=os.path.join(os.path.dirname(__file__), "static"),
            template_path=os.path.join(os.path.dirname(__file__), "templates"),
        )
#         dsn = 'dbname=postgres user=postgres password=postgres ' \
#               'host=127.0.0.1 port=5433'
#         self.db = momoko.Pool(dsn=dsn, size=5)

        tornado.web.Application.__init__(self, handlers, **settings)
 
 
def main():
    application = Application()
    application.listen(8080)
 
    tornado.ioloop.IOLoop.instance().start()
 
if __name__ == "__main__":
    print """\
Starting server.

To test, use multiple invocations of curl. Browsers sometimes queue up requests
to the same URL which makes it look like your program isn't working.

Assuming curl is installed and is on your path, you would type this:

curl -i http://localhost:8080/Reaction.asmx/GetUsersFullname
curl -X POST http://10.16.1.1:8080/Reaction.asmx/SearchUsers -d '{"name":"a"}'
http://localhost:8080/render?smile=c1ccccc1

Good luck!
"""
 
    main()
 