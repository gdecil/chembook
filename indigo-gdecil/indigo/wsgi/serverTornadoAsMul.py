#!/usr/bin/env python
 
import tornado.web
import tornado.gen
from tornado import gen
import time
from functools import partial
import os
from concurrent.futures import ThreadPoolExecutor
from tornado_cors import CorsMixin
from TorSel import TornadoSelect
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

def getParam(dict, name):
        temp = []
        dictlist = []
        for key, value in dict.iteritems():
            if key == name:
                return value
#             temp = [key,value]
#             dictlist.append(temp)
#         print dictlist[0][1]

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
        
class Render(tornado.web.RequestHandler): 
    def initialize(self, executor):
        self.executor = executor 
        self.dao = TornadoSelect()

    @gen.coroutine
    def get(self): 
        smile=self.get_arguments("smile")
#         ugo=self.get_arguments("ugo")
#         ugo=self.get_query_arguments("ugo")
#         print smile[0]
#         print ugo
        future_result = yield self.executor.submit( self.dao.renderInd, 
                                                    smile = smile[0], 
                                                    typeInd ="mol"
                                                    )                 
        
        self.write(future_result.decode('base64'))
        self.set_header("Content-type", "image/png") 
        self.finish()

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

    @gen.coroutine
    def get(self, param1): 
#         smile=self.get_arguments("smile")
#         print smile[0]
        dict = tornado.escape.json_decode(self.request.body.replace("\\", ""))
        print self.request.body
        print tornado.escape.json_decode(self.request.body)
        print self.request.body.replace("\\", "")
        
#         par = getParam(dict, 'smile')
#         par1 = getParam(dict, 'name')
#         print par
#         print par1
        if param1 == 'GetUsersFullname':
            future_result = yield self.executor.submit( self.dao.get_fullname )    
            self.write(future_result) 
        elif param1 == 'getProjects':
            future_result = yield self.executor.submit( self.dao.get_projects )    
            self.write(future_result) 
        elif param1 == "GetUserNotebooks":  
            par1 = getParam(dict.replace("\\", ""), 'userFullname')
            print par1
            future_result = yield self.executor.submit( self.dao.get_usernotebooks,
                                                        userFullname = par1 )    
            self.write(future_result) 
        else:
            print param1
            print "error 500"
            self.write_error(500) 
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
                    (r"/Reaction.asmx/([A-Za-z]+)", Reaction, dict(executor=ThreadPoolExecutor(max_workers=10))),
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
    application.listen(8889)
 
    tornado.ioloop.IOLoop.instance().start()
 
if __name__ == "__main__":
    print """\
Starting server.

To test, use multiple invocations of curl. Browsers sometimes queue up requests
to the same URL which makes it look like your program isn't working.

Assuming curl is installed and is on your path, you would type this:

$ curl -i http://localhost:8888/bar

Good luck!
"""
 
    main()
 