from concurrent.futures import ThreadPoolExecutor
from functools import partial, wraps
import time
 
import tornado.ioloop
import tornado.web
import momoko
 
 
EXECUTOR = ThreadPoolExecutor(max_workers=4)
 
 
def unblock(f):
 
    @tornado.web.asynchronous
    @wraps(f)
    def wrapper(*args, **kwargs):
        self = args[0]
 
        def callback(future):
            self.write(future.result())
            self.finish()
 
        EXECUTOR.submit(
            partial(f, *args, **kwargs)
        ).add_done_callback(
            lambda future: tornado.ioloop.IOLoop.instance().add_callback(
                partial(callback, future)))
 
    return wrapper
 
 
class MainHandler(tornado.web.RequestHandler):
 
    def get(self):
        self.write("Hello, world %s" % time.time())
 
 
class SleepHandler(tornado.web.RequestHandler):
 
    @unblock
    def get(self, n):
        dsn = 'dbname=postgres user=postgres password=postgres ' \
          'host=127.0.0.1 port=5433'
        self.db = momoko.Pool(dsn=dsn, size=5)
        
        sql = """
            SELECT id, username, email, password
            FROM users_user
        """
        cursor = momoko.Op(self.db.execute, sql)
        desc = cursor.description
        result = [dict(zip([col[0] for col in desc], row))
                         for row in cursor.fetchall()]
    
        cursor.close()    
        
        time.sleep(float(n))
        return result
 
 
class SleepAsyncHandler(tornado.web.RequestHandler):
 
    @tornado.web.asynchronous
    def get(self, n):
 
        def callback(future):
            self.write(future.result())
            self.finish()
 
        EXECUTOR.submit(
            partial(self.get_, n)
        ).add_done_callback(
            lambda future: tornado.ioloop.IOLoop.instance().add_callback(
                partial(callback, future)))
 
    def get_(self, n):
        time.sleep(float(n))
        return "Awake! %s" % time.time()
 
 
application = tornado.web.Application([
    (r"/", MainHandler),
    (r"/sleep/(\d+)", SleepHandler),
    (r"/sleep_async/(\d+)", SleepAsyncHandler),
])
 
 
if __name__ == "__main__":
    application.listen(8889)
    tornado.ioloop.IOLoop.instance().start()