import tornado.ioloop
import tornado.web
import time

class MainHandler(tornado.web.RequestHandler):
    def get(self):
        print 20
        self.write("HW")
        
class WaitHandler(tornado.web.RequestHandler):
    @tornado.web.asynchronous
    def get(self):
        print 10
        time.sleep(20)
        self.on_response
        
    def on_response(self, response):
        self.write("pippo")
        self.finish()

application = tornado.web.Application([
    (r"/", MainHandler),
    (r"/wait", WaitHandler),
])

if __name__ == "__main__":
    application.listen(8888)
    tornado.ioloop.IOLoop.instance().start()
            