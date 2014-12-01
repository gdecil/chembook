import tornado.ioloop
import tornado.web
import time
import datetime

from tornado.ioloop import IOLoop
from gi.overrides.keysyms import seconds


@tornado.gen.coroutine
def test(name):
    return name

class MainHandler(tornado.web.RequestHandler):
    def get(self):
        print 20
        self.write(datetime.now().strftime("%H:%M:%S") )
        
class AsincHandler(tornado.web.RequestHandler):
    def get(self):
        print 10
        ret = test("name")
        print ret.name
        self.write("ugo")

class WaitHandler(tornado.web.RequestHandler):
    def test(self):
        self.write("chunk!")
    @tornado.gen.coroutine
    def get(self):
        print 10
        IOLoop.instance().add_timeout(datetime.datetime.timedelta(seconds=5), self.test)
#         time.sleep(20)
        print 15
        self.write("chunk")
#         self.on_response(self)
        
#     def on_response(self, response):
#         print 30
#         self.write("response")
#         print 40
#         self.finish()

application = tornado.web.Application([
    (r"/", MainHandler),
    (r"/wait", WaitHandler),
    (r"/asinc", AsincHandler),
])

if __name__ == "__main__":
    application.listen(8889)
    tornado.ioloop.IOLoop.instance().start()
            